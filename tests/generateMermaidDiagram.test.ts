import { expect, it, describe } from 'vitest'
import { generateMermaidDiagram } from '../src/index'
import type { MermaidGraph } from '../src/types/Types'

describe('Generate flowchart Mermaid diagram', () => {
    it('should generate a flowchart diagram', () => {
        const data: MermaidGraph = { 
            graphType: 'flowchart', 
            direction: 'TD', nodes: [
            { 
                id: 'A', 
                label: 'Start', 
                children: [
                { id: 'B', label: 'End', lineType: 'Arrow' }
            ] 
        },
        ], 
     }
        const result = generateMermaidDiagram(data)
        const expected = `flowchart TD
  %% Level 0
  A[Start]

  %% Level 1
  B[End]

  %% Connections
  A --> B
`
        expect(result).toContain(expected)
    })
})

describe('generateMermaidDiagram with config', () => {
    it('should include config in the diagram', () => {
        const data: MermaidGraph = { 
            graphType: 'flowchart',
            direction: 'LR',
            config: {
                theme: 'dark'
            },
            nodes: [
                { id: 'A', label: 'Node A', children: [
                    { id: 'B', label: 'Node B', lineType: 'Open'}
                ] },
            ],
        }

        const result = generateMermaidDiagram(data)
        const expected = `---
config:
  theme: "dark"
---
flowchart LR
  %% Level 0
  A[Node A]

  %% Level 1
  B[Node B]

  %% Connections
  A --- B
`
        expect(result).toContain(expected)
    })
})

describe('Generate pie chart Mermaid diagram', () => {
    it('should generate a pie chart diagram', () => {
        const data: MermaidGraph = {
            graphType: 'pie',
            title: 'Sample Pie Chart',
            nodes: [
                { label: 'Category A', value: 30 },
                { label: 'Category B', value: 70 },
            ],
        }

        const result = generateMermaidDiagram(data)
        const expected = `pie 
  title Sample Pie Chart
  %% Data
  "Category A": 30
  "Category B": 70
`
        expect(result).toContain(expected)
    })
})