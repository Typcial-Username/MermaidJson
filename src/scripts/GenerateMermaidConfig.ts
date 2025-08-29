import fs from 'fs';
import path from 'path';

interface JsonSchemaProperty {
  type: string | string[];
  description?: string;
  default?: any;
  minimum?: number;
  maximum?: number;
  enum?: any[];
  properties?: Record<string, JsonSchemaProperty>;
  items?: JsonSchemaProperty;
}

interface JsonSchema {
  type: string;
  properties: Record<string, JsonSchemaProperty>;
}

function mapJsonTypeToTsType(jsonType: string | string[], property: JsonSchemaProperty): string {
  const types = Array.isArray(jsonType) ? jsonType : [jsonType];
  
  const tsTypes = types.map(type => {
    switch (type) {
      case 'string':
        return property.enum ? property.enum.map(v => `'${v}'`).join(' | ') : 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        if (property.items) {
          const itemType = mapJsonTypeToTsType(property.items.type!, property.items);
          return `${itemType}[]`;
        }
        return 'any[]';
      case 'object':
        if (property.properties) {
          return generateInterfaceFromProperties(property.properties);
        }
        return 'Record<string, any>';
      default:
        return 'any';
    }
  });
  
  return tsTypes.join(' | ');
}

function generateInterfaceFromProperties(properties: Record<string, JsonSchemaProperty>): string {
  const props = Object.entries(properties).map(([key, prop]) => {
    const tsType = mapJsonTypeToTsType(prop.type!, prop);
    const comment = prop.description ? `  /** ${prop.description} */\n` : '';
    const defaultComment = prop.default !== undefined ? ` // default: ${JSON.stringify(prop.default)}` : '';
    
    return `${comment}  ${key}?: ${tsType};${defaultComment}`;
  }).join('\n');
  
  return `{\n${props}\n}`;
}

function generateMermaidConfigType(schemaPath: string): string {
  const schema: JsonSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  
  const interfaceBody = generateInterfaceFromProperties(schema.properties);
  const fileHeader = `//! This file is auto-generated from mermaid-config-schema.json\n//! Do not edit manually - regenerate using: npm run generate-config\n`;
  
  return `${fileHeader}\nexport interface MermaidConfig ${interfaceBody}`;
}

// Usage - Fix the paths for src/scripts/ location
try {
    // Get the project root directory (where package.json is)
    // From src/scripts/, we need to go up two levels
    const projectRoot = path.resolve(__dirname, '..', '..');
    const srcDir = path.join(projectRoot, 'src');
    
    // Look for the schema file in the same directory as this script first
    const possibleSchemaPaths = [
        path.join(__dirname, 'mermaid-config-schema.json'), // Same directory as script
        path.join(projectRoot, 'mermaid-config-schema.json'), // Project root
        path.join(projectRoot, 'schemas', 'mermaid-config-schema.json') // Schemas folder
    ];
    
    let schemaPath: string | null = null;
    for (const possiblePath of possibleSchemaPaths) {
        if (fs.existsSync(possiblePath)) {
            schemaPath = possiblePath;
            break;
        }
    }
    
    if (!schemaPath) {
        console.error('❌ Could not find mermaid-config-schema.json in any of these locations:');
        possibleSchemaPaths.forEach(p => console.error(`   - ${p}`));
        console.error('\nPlease ensure the schema file exists in one of these locations.');
        process.exit(1);
    }
    
    console.log(`📄 Found schema at: ${schemaPath}`);
    
    // Ensure src directory exists
    if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir, { recursive: true });
    }
    
    const configSchema = generateMermaidConfigType(schemaPath);
    const outputPath = path.join(srcDir, 'types', 'MermaidConfig.ts');
    
    fs.writeFileSync(outputPath, configSchema);
    console.log(`✅ Generated MermaidConfig.ts successfully at: ${outputPath}`);

} catch (err) {
    console.error('❌ Error generating Mermaid config:', err);
    process.exit(1);
}