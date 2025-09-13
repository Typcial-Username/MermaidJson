import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  required?: string[];
}

const generatedEnums = new Map<string, string>();

function toEnumName(propertyKey: string) {
  return propertyKey.charAt(0).toUpperCase() +propertyKey.slice(1) + 'Enum';
}

function mapJsonTypeToTsType(jsonType: string | string[], property: JsonSchemaProperty, rootSchema: any, propertyKey?: string): string {
  const types = Array.isArray(jsonType) ? jsonType : [jsonType];

  // Handle $ref
  if ((property as any)['$ref']) {
    const ref = (property as any)['$ref'];
    const resolved = resolveRef(ref, rootSchema);
    if (resolved) {
      return mapJsonTypeToTsType(resolved.type!, resolved, rootSchema);
    }
  }

  const tsTypes = types.map(type => {
    switch (type) {
      case 'string':
        if (property.enum && propertyKey) {
          const enumName = toEnumName(propertyKey);
          if (!generatedEnums.has(enumName)) {
            const enumMembers = property.enum.map(v => `  ${v.replace(/[^a-zA-Z0-9_]/g, '_')} = '${v}'`).join(',\n');
            generatedEnums.set(enumName, `export enum ${enumName} {\n${enumMembers}\n}`);
          }
          return enumName;
        }
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        if (property.items) {
          const itemType = mapJsonTypeToTsType(property.items.type!, property.items, rootSchema, propertyKey);
          return `${itemType}[]`;
        }
        return 'any[]';
      case 'object':
        if (property.properties) {
          return generateInterfaceFromProperties(property.properties, rootSchema, (property as any).required || []);
        }
        return 'Record<string, any>';
      default:
        return 'any';
    }
  });
  
  return tsTypes.join(' | ');
}

function resolveRef(ref: string, rootSchema: any): JsonSchemaProperty | undefined {
  // Only supports local refs like "#/$defs/FlowchartDiagramConfig"
  if (!ref.startsWith("#/")) return undefined;
  const path = ref.slice(2).split("/");
  let current: any = rootSchema;
  for (const part of path) {
    current = current[part];
    if (!current) return undefined;
  }
  return current;
}

function generateInterfaceFromProperties(properties: Record<string, JsonSchemaProperty>, rootSchema: any, required: string[]): string {
  const props = Object.entries(properties).map(([key, prop]) => {
  const tsType = mapJsonTypeToTsType(prop.type!, prop, rootSchema);
  const isRequired = required.includes(key);

  const comment = prop.description ? `  /** ${prop.description} */\n` : '';
  const defaultComment = prop.default !== undefined ? ` // default: ${JSON.stringify(prop.default)}` : '';
  
  return `${comment}  ${key}${isRequired ? '' : '?'}: ${tsType};${defaultComment}`;
  }).join('\n');
  
  return `{\n${props}\n}`;
}

async function generateMermaidConfigType(): Promise<string> {
  console.log('🌐 Fetching Mermaid config schema...');
  const response = await fetch("https://mermaid.js.org/schemas/config.schema.json");
  const configJson = await response.json();
  const schema: JsonSchema = configJson;
  console.log('✅ Fetched Mermaid config schema successfully.');

  generatedEnums.clear();
  const interfaceBody = generateInterfaceFromProperties(schema.properties, schema, schema.required || []);
  const enumsStr = Array.from(generatedEnums.values()).join('\n\n');
  const fileHeader = `//! This file is auto-generated from mermaid-config-schema.json\n//! Do not edit manually - regenerate using: npm run generate-config\n`;
  
  return `${fileHeader}\n${enumsStr}\nexport interface MermaidConfig ${interfaceBody}`;
}

// Usage - Fix the paths for src/scripts/ location
try {
    // // Get the project root directory (where package.json is)
    // // From src/scripts/, we need to go up two levels
    const projectRoot = path.resolve(__dirname, '..');
    const srcDir = path.join(projectRoot, 'src');
    
    // // Look for the schema file in the same directory as this script first
    // const possibleSchemaPaths = [
    //     path.join(__dirname, 'mermaid-config-schema.json'), // Same directory as script
    //     path.join(projectRoot, 'mermaid-config-schema.json'), // Project root
    //     path.join(projectRoot, 'schemas', 'mermaid-config-schema.json') // Schemas folder
    // ];
    
    // let schemaPath: string | null = null;
    // for (const possiblePath of possibleSchemaPaths) {
    //     if (fs.existsSync(possiblePath)) {
    //         schemaPath = possiblePath;
    //         break;
    //     }
    // }
    
    // if (!schemaPath) {
    //     console.error('❌ Could not find mermaid-config-schema.json in any of these locations:');
    //     possibleSchemaPaths.forEach(p => console.error(`   - ${p}`));
    //     console.error('\nPlease ensure the schema file exists in one of these locations.');
    //     process.exit(1);
    // }
    
    // console.log(`📄 Found schema at: ${schemaPath}`);
    
    // // Ensure src directory exists
    // if (!fs.existsSync(srcDir)) {
    //     fs.mkdirSync(srcDir, { recursive: true });
    // }

    const configSchema = await generateMermaidConfigType();
    const outputPath = path.join(srcDir, 'types', 'MermaidConfig.ts');

    fs.writeFileSync(outputPath, configSchema);
    console.log(`✅ Generated MermaidConfig.ts successfully at: ${outputPath}`);

} catch (err) {
    console.error('❌ Error generating Mermaid config:', err);
    process.exit(1);
}