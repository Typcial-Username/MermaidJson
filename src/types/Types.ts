import type { FlowchartOptions } from './Flowchart'
import type { PieChartOptions } from './PieChart'
import type { MermaidConfig } from './MermaidConfig'

type Prettify<T> = { [K in keyof T]: T[K] } & {}

interface BaseMermaidGraph {
    config?: Partial<MermaidConfig>,
    classDefs?: Record<string, string>[],
}

export type MermaidGraph = BaseMermaidGraph &
(
    FlowchartOptions
    | PieChartOptions
)

type r = Prettify<MermaidGraph>