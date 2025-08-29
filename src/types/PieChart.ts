import { MermaidGraph } from "./Types";

export type PieChartOptions = {
    graphType: 'pie',
    title?: string,
    showData?: boolean,
    nodes: {
        label: string,
        value: number,
    }[]
}

export function generatePieChartDiagram(data: MermaidGraph & PieChartOptions): string {
  if (!data || data.nodes.length === 0) return '';

  let diagram = `pie ${data.showData ? 'showData' : ''}\n`;
  
  if (data.title) {
    diagram += `  title ${data.title}\n`;
  }

  diagram += `  %% Data\n`;
  data.nodes.forEach(node => {
    diagram += `  \"${node.label}\": ${node.value}\n`;
  });

  return diagram;
}