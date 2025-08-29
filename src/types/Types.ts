import { FlowchartOptions } from './Flowchart'
import { PieChartOptions } from './PieChart'
import { MermaidConfig } from './MermaidConfig'

type Prettify<T> = { [K in keyof T]: T[K] } & {}

interface BaseMermaidGraph {
    MermaidConfig?: Partial<MermaidConfig>,
    classDefs?: Record<string, string>[],
}

export type MermaidGraph = BaseMermaidGraph &
(
    FlowchartOptions
    | PieChartOptions
)

type r = Prettify<MermaidGraph>