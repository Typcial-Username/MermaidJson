import { generateFlowchartDiagram } from './types/Flowchart'
import type { MermaidGraph } from './types/Types';
import { generatePieChartDiagram } from './types/PieChart';

// Turn MermaidJSON into Markdown diagram
export function generateMermaidDiagram(data: MermaidGraph): string {
  let configStr = ""
  if (data.config) {
    configStr = "---\nconfig:"
    // Apply Mermaid Config to diagram generation
    for (const key in data.config) {
      configStr += `\n  ${key}: ${JSON.stringify(data.config[key as keyof typeof data.config], null, 2)}`;
    }
    configStr += '\n---\n';
  }

  switch (data.graphType) {
    case 'flowchart': 
      return configStr + generateFlowchartDiagram(data)
    case 'pie':
      return configStr + generatePieChartDiagram(data)
    default:
      throw new Error(`Unsupported graph type: ${(data as MermaidGraph).graphType}`)
  }
}

export type { MermaidGraph } from './types/Types'
export type { FlowchartNode, FlowchartOptions } from './types/Flowchart'
export type { PieChartOptions } from './types/PieChart'