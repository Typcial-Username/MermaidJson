import { FlowchartNode, generateMermaidDiagram, MermaidGraph } from ".";

export function saveDiagramAsMarkdown(filepath: string, data: MermaidGraph) {
  const { writeFileSync } = require('fs');
    let markdown = '```mermaid\n';
    markdown += generateMermaidDiagram(data);
    markdown += '```\n';
    writeFileSync(filepath, markdown, 'utf8');
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