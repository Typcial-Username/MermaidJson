import { generateFlowchartDiagram } from './types/Flowchart'
import type { MermaidGraph } from './types/Types';
import type { FlowchartNode } from './types/Flowchart'
import { generatePieChartDiagram } from './types/PieChart';

// Function to load Mermaid JSON from a file
export function loadMermaidJSON(filepath: string) {
  const { readFileSync } = require('fs');
  const { resolve } = require('path'); 

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
  const { writeFileSync } = require('fs');
  const { resolve } = require('path');

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

export function saveDiagramAsMarkdown(filepath: string, data: MermaidGraph) {
  const { writeFileSync } = require('fs');
    let markdown = '```mermaid\n';
    markdown += generateMermaidDiagram(data);
    markdown += '```\n';
    writeFileSync(filepath, markdown, 'utf8');
}

export type { MermaidGraph } from './types/Types'
export type { FlowchartNode, FlowchartOptions } from './types/Flowchart'
export type { PieChartOptions } from './types/PieChart'