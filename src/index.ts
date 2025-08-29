import { writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path';
import { generateFlowchartDiagram } from './types/Flowchart'
import type { MermaidGraph } from './types/Types';
import type { FlowchartNode } from './types/Flowchart'
import { generatePieChartDiagram } from './types/PieChart';

// Function to load Mermaid JSON from a file
export function loadMermaidJSON(filepath: string) {
    let data: string;
    try {
        const absolutePath =  resolve(filepath);
        data = readFileSync(absolutePath, 'utf8');
    } catch {
        console.error(`Error reading file at ${filepath}`);
        return null;
    }

    try {
        const jsonData = JSON.parse(data);
        return jsonData as FlowchartNode[];
    } catch (error) {
        console.error(`Error parsing JSON from file at ${filepath}:`, error);
        return null;
    }
}

// Save Mermaid JSON to a file
export function saveMermaidJSON(filepath: string, data: MermaidGraph) {
    try {
        const absolutePath = resolve(filepath);
        const jsonData = JSON.stringify(data, null, 2);
        writeFileSync(absolutePath, jsonData, 'utf8');
        console.log(`Mermaid JSON saved to ${absolutePath}`);
    } catch (error) {
        console.error(`Error writing file at ${filepath}:`, error);
    }
}

// Turn MermaidJSON into Markdown diagram
export function generateMermaidDiagram(data: MermaidGraph): string {
  console.log("Creating " + data.graphType + " diagram...");
  switch (data.graphType) {
    case 'flowchart': 
      return generateFlowchartDiagram(data)
    case 'pie':
      return generatePieChartDiagram(data)
    default:
      const _exhaustive: never = data;
      throw new Error(`Unsupported graph type: ${(_exhaustive as any).graphType}`)
  }
}

export function saveDiagramAsMarkdown(filepath: string, data: MermaidGraph) {
    let markdown = '```mermaid\n';
    markdown += generateMermaidDiagram(data);
    markdown += '```\n';
    console.log("Generated Diagram:\n" + markdown);
    writeFileSync(filepath, markdown, 'utf8');
}

const exampleGraph: MermaidGraph = {
  graphType: 'flowchart',
  direction: 'TD',
  nodes: [
    {
      id: 'start',
      label: 'Start',
      children: [
        {
          id: 'end',
          label: 'End',
          lineType: 'Arrow'
        }
      ]
    }
  ]
}

saveDiagramAsMarkdown('example.md', exampleGraph);