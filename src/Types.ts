import { FlowchartNode, FlowchartOptions, LineType } from './types/Flowchart'
import { PieChartOptions } from './types/PieChart'

type GraphType = 'flowchart' | 'pie'

type Prettify<T> = { [K in keyof T]: T[K] } & {}

export interface MermaidConfig {
    theme: string,
    themeVariables: Record<string, string>,
    themeCSS: string
    look: string,
    handDrawnSeed: number,
    layout: string,
    maxTextSize: number,
    maxEdges: number,
    elk: {
        mergeEdges: boolean,
        nodePlacementStrategy: string,
        cycleBreakingStrategy: boolean,
        forceNodeModelOrder: boolean,
        considerModelOrder: boolean,
    },
    darkMode: boolean,
    htmlLabels: boolean,
    fontFamily: string,
    altFontFamily: string,
    logLevel: string | number,
    securityLevel: string,
    startOnLoad: boolean,
    arrowMarkerAbsolute: boolean,
    secure: string[],
    legacyMathML: boolean,
    deterministicIds: boolean,
    deterministicIDSeed: string,
}

export interface ClassDef {

}

interface BaseMermaidGraph {
    MermaidConfig?: MermaidConfig,
    classDefs?: Record<string, ClassDef>[],
}

export type MermaidGraph = BaseMermaidGraph &
(
    FlowchartOptions
    | PieChartOptions
)

type r = Prettify<MermaidGraph>