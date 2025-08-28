import fs from 'fs'
import path from 'path';

interface MermaidNode {
    id: string,
    label: string,
    shape?: MermaidShape,
    children?: (MermaidNode & { connectionLabel?: string })[],
    className?: string
    styleProps?: Record<string, any>,
}

const shapeMap = {
  rect: (id, label) => `${id}[${label}]`,
  'round-rect': (id, label) => `${id}("${label}")`,
  circle: (id, label) => `${id}(("${label}"))`,
  ellipse: (id, label) => `${id}((""${label}"))`,
  stadium: (id, label) => `${id}(["${label}"])`,
  subroutine: (id, label) => `${id}[["${label}"]]`,
  cylinder: (id, label) => `${id}[("${label}")]`,
  diamond: (id, label) => `${id}{"${label}"}`,
  hexagon: (id, label) => `${id}{{"${label}"}}`,
  'left-parallelogram': (id, label) => `${id}[/"${label}"/]`,
  'right-parallelogram': (id, label) => `${id}[\\"${label}"\\]`,
  'trapezoid-top': (id, label) => `${id}[\/"${label}"\\]`,
  'trapezoid-bottom': (id, label) => `${id}[\\"${label}"/]`,
//   odd: (id, label) => `${id}>"${label}"]`
} as const satisfies Record<
  string,
  (id: string, label: string) => string
>;


type MermaidShape = keyof typeof shapeMap;

// Function to load Mermaid JSON from a file
function loadMermaidJSON(filepath: string) {
    let data: string;
    try {
        const absolutePath = path.resolve(filepath);
        data = fs.readFileSync(absolutePath, 'utf8');
    } catch {``
        console.error(`Error reading file at ${filepath}`);
        return null;
    }

    try {
        const jsonData = JSON.parse(data);
        return jsonData as MermaidNode[];
    } catch (error) {
        console.error(`Error parsing JSON from file at ${filepath}:`, error);
        return null;
    }
}

// Save Mermaid JSON to a file
function saveMermaidJSON(filepath: string, data: MermaidNode[]) {
    try {
        const absolutePath = path.resolve(filepath);
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(absolutePath, jsonData, 'utf8');
        console.log(`Mermaid JSON saved to ${absolutePath}`);
    } catch (error) {
        console.error(`Error writing file at ${filepath}:`, error);
    }
}

// Turn MermainJSON into Markdown diagram
function mermaidToMarkdown(data: MermaidNode[]): string {
  if (!data || data.length === 0) return '';

  let markdown = '```mermaid\n';
  markdown += 'flowchart TD\n';

  const declaredNodes = new Set<string>();
  const levelMap = new Map<number, MermaidNode[]>();

  // BFS-style level assignment
  function assignLevels(nodes: MermaidNode[], level = 0) {
    if (!nodes || nodes.length === 0) return;
    for (const node of nodes) {
      if (!levelMap.has(level)) levelMap.set(level, []);
      levelMap.get(level)!.push(node);
      if (node.children && node.children.length > 0) {
        assignLevels(
          node.children.filter(c => typeof c !== 'string') as MermaidNode[],
          level + 1
        );
      }
    }
  }

  assignLevels(data);

  const formatProperties = (props: Record<string, any>) =>
    Object.entries(props).map(([k, v]) => `${k}:${v}`).join(', ');

  // Declare nodes grouped by level
  const sortedLevels = Array.from(levelMap.keys()).sort((a, b) => a - b);
  for (const level of sortedLevels) {
    const nodesAtLevel = levelMap.get(level)!;
    markdown += `  %% Level ${level}\n`;
    for (const node of nodesAtLevel) {
      const { id, label, shape, styleProps } = node;
      if (declaredNodes.has(id)) continue;

      // Ensure shape exists in shapeMap, fallback to 'rect'
      const nodeShape: MermaidShape = (shape && shapeMap[shape] ? shape : 'rect') as MermaidShape;

      // Clean label: remove extra backslashes
      const safeLabel = label.replace(/\\/g, '');

      markdown += `  ${shapeMap[nodeShape](id, safeLabel)}\n`;

      if (styleProps) {
        markdown += `  style ${id} ${formatProperties(styleProps)}\n`;
      } else if (node.className) {
        markdown += `  ${node.id}:::${node.className}\n\n`;
      }

      declaredNodes.add(id);
    }
    markdown += `\n`; // blank line between levels
  }

  markdown += `  %% Connections\n`;

  // Emit edges grouped by parent
  function emitEdges(node: MermaidNode) {
    if (!node.children || node.children.length === 0) return;
    for (const child of node.children) {
      const childId = typeof child === 'string' ? child : child.id;
      if (!childId) continue;

      const conLabel = typeof child !== 'string' && child.connectionLabel
        ? `|"${child.connectionLabel}"|`
        : '';

      markdown += `  ${node.id} -->${conLabel} ${childId}\n`;

      if (typeof child !== 'string') emitEdges(child);
    }
    markdown += '\n'; // blank line after this parent's edges
  }

  data.forEach(node => emitEdges(node));

  markdown += '```\n';
  return markdown;
}

function saveMermaidMd(filepath: string, data: MermaidNode[]) {
    const markdown = mermaidToMarkdown(data);
    fs.writeFileSync(filepath, markdown, 'utf8');
}


