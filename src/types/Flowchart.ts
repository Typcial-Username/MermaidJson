import type { MermaidGraph } from "./Types";

type Direction = 'TB' | 'TD' | 'BT' | 'RL' | 'LR';
export type LineType = 'Arrow' | 'Open' | 'Thick' | 'Dotted' | 'Invisible';
export type ArrowType = 'Circle' | 'Cross'

export type FlowchartOptions = {
  graphType: 'flowchart'
  direction: Direction,
  nodes: FlowchartNode[],
}

export const shapeMap = {
  rect: (id, label) => `${id}[${label}]`,
  'round-rect': (id, label) => `${id}("${label}")`,
  circle: (id, label) => `${id}(("${label}"))`,
  ellipse: (id, label) => `${id}([${label}])`,
  stadium: (id, label) => `${id}(["${label}"])`,
  subroutine: (id, label) => `${id}[["${label}"]]`,
  cylinder: (id, label) => `${id}[("${label}")]`,
  diamond: (id, label) => `${id}{"${label}"}`,
  hexagon: (id, label) => `${id}{{"${label}"}}`,
  'left-parallelogram': (id, label) => `${id}[/"${label}"/]`,
  'right-parallelogram': (id, label) => `${id}[\\"${label}"\\]`,
  'trapezoid-top': (id, label) => `${id}[\/"${label}"\\]`,
  'trapezoid-bottom': (id, label) => `${id}[\\"${label}"/]`,
  odd: (id, label) => `${id}>${label}]`
} as const satisfies Record<
  string,
  (id: string, label: string) => string
>;

export type FlowchartNodeShape = keyof typeof shapeMap;

export interface FlowchartNode {
    id: string,
    label: string,
    shape?: FlowchartNodeShape,
    children?: (FlowchartNode & FlowchartConnectionOptions)[],
    className?: string
    styleProps?: Record<string, any>,
}

export interface FlowchartConnectionOptions {
    connectionLabel?: string,
    lineType: LineType,
    arrowType?: ArrowType
}

export const lineTypeMap = {
    Arrow: {
        withoutText: '-->',
        withText: (text: string) => `-->|${text}|`
    },
    Open: {
        withoutText: '---',
        withText: (text: string) => `-- ${text} ---`
    },
    Thick: {
        withoutText: '==>',
        withText: (text: string) => `== ${text} ==>`
    },
    Dotted: {
        withoutText: '-.->',
        withText: (text: string) => `-. ${text} .->`
    },
    Invisible: {
        withoutText: '~~~',
        withText: null
    }
} as const;

// Helper function to get the correct line syntax
export function getLineSyntax(lineType: LineType, connectionLabel?: string/*, arrowType?: ArrowType*/): string {
    const lineConfig = lineTypeMap[lineType];
    
    // If connectionLabel is provided but this line type doesn't support text, ignore the label
    if (connectionLabel && lineConfig.withText === null) {
        console.warn(`Line type '${lineType}' does not support connection labels. Ignoring label: "${connectionLabel}"`);
        return lineConfig.withoutText/* + (arrowType ? lineConfig.withoutText + arrowType : '')*/;
    }
    
    return connectionLabel && lineConfig.withText
        ? lineConfig.withText(connectionLabel)/* + (arrowType ? arrowType : '')*/
        : lineConfig.withoutText/* + (arrowType ? arrowType : '')*/;
}

export function generateFlowchartDiagram(data: MermaidGraph & FlowchartOptions): string {
  if (!data || data.nodes.length === 0) return '';

  let diagram = `flowchart ${data.direction}\n`;

  const declaredNodes = new Set<string>();
  const levelMap = new Map<number, FlowchartNode[]>();

  // BFS-style level assignment
  function assignLevels(nodes: FlowchartNode[], level = 0) {
    if (!nodes || nodes.length === 0) return;
    for (const node of nodes) {
      if (!levelMap.has(level)) levelMap.set(level, []);
      levelMap.get(level)!.push(node);
      if (node.children && node.children.length > 0) {
        assignLevels(
          node.children.filter(c => typeof c !== 'string') as FlowchartNode[],
          level + 1
        );
      }
    }
  }

  assignLevels(data.nodes);

  const formatProperties = (props: Record<string, any>) =>
    Object.entries(props).map(([k, v]) => `${k}:${v}`).join(', ');

  // Declare nodes grouped by level
  const sortedLevels = Array.from(levelMap.keys()).sort((a, b) => a - b);
  for (const level of sortedLevels) {
    const nodesAtLevel = levelMap.get(level)!;
    diagram += `  %% Level ${level}\n`;
    for (const node of nodesAtLevel) {
      const { id, label, shape, styleProps } = node;
      if (declaredNodes.has(id)) continue;

      // Ensure shape exists in shapeMap, fallback to 'rect'
      const nodeShape: FlowchartNodeShape = (shape && shapeMap[shape] ? shape : 'rect') as FlowchartNodeShape;

      // Clean label: remove extra backslashes
      const safeLabel = label.replace(/\\/g, '');

      diagram += `  ${shapeMap[nodeShape](id, safeLabel)}\n`;

      if (styleProps) {
        diagram += `  style ${id} ${formatProperties(styleProps)}\n`;
      } else if (node.className) {
        diagram += `  ${node.id}:::${node.className}\n\n`;
      }

      declaredNodes.add(id);
    }
    diagram += `\n`; // blank line between levels
  }

  diagram += `  %% Connections\n`;

  // Emit edges grouped by parent
  function emitEdges(node: FlowchartNode) {
    if (!node.children || node.children.length === 0) return;
    for (const child of node.children) {
      const childId = typeof child === 'string' ? child : child.id;
      if (!childId) continue;

      const lineSyntax = getLineSyntax(child.lineType, child.connectionLabel/*, child.arrowType*/);

      diagram += `  ${node.id} ${lineSyntax} ${childId}\n`;

      if (typeof child !== 'string') emitEdges(child);
    }
    diagram += '\n'; // blank line after this parent's edges
  }

  data.nodes.forEach((node: FlowchartNode) => emitEdges(node));

  return diagram;
}