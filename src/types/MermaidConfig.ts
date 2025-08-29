//! This file is auto-generated from mermaid-config-schema.json
//! Do not edit manually - regenerate using: npm run generate-config

export interface MermaidConfig {
  /** Theme, the CSS style sheet.
You may also use `themeCSS` to override this value.
 */
  theme?: 'default' | 'base' | 'dark' | 'forest' | 'neutral' | 'null'; // default: "default"
  themeVariables?: any;
  themeCSS?: string;
  /** Defines which main look to use for the diagram.
 */
  look?: 'classic' | 'handDrawn'; // default: "classic"
  /** Defines the seed to be used when using handDrawn look. This is important for the automated tests as they will always find differences without the seed. The default value is 0 which gives a random seed.
 */
  handDrawnSeed?: number; // default: 0
  /** Defines which layout algorithm to use for rendering the diagram.
 */
  layout?: string; // default: "dagre"
  /** The maximum allowed size of the users text diagram */
  maxTextSize?: number; // default: 50000
  /** Defines the maximum number of edges that can be drawn in a graph.
 */
  maxEdges?: number; // default: 500
  elk?: {
  /** Elk specific option that allows edges to share path where it convenient. It can make for pretty diagrams but can also make it harder to read the diagram.
 */
  mergeEdges?: boolean; // default: false
  /** Elk specific option affecting how nodes are placed.
 */
  nodePlacementStrategy?: 'SIMPLE' | 'NETWORK_SIMPLEX' | 'LINEAR_SEGMENTS' | 'BRANDES_KOEPF'; // default: "BRANDES_KOEPF"
  /** This strategy decides how to find cycles in the graph and deciding which edges need adjustment to break loops.
 */
  cycleBreakingStrategy?: 'GREEDY' | 'DEPTH_FIRST' | 'INTERACTIVE' | 'MODEL_ORDER' | 'GREEDY_MODEL_ORDER'; // default: "GREEDY_MODEL_ORDER"
  /** The node order given by the model does not change to produce a better layout. E.g. if node A is before node B in the model this is not changed during crossing minimization. This assumes that the node model order is already respected before crossing minimization. This can be achieved by setting considerModelOrder.strategy to NODES_AND_EDGES.
 */
  forceNodeModelOrder?: boolean; // default: false
  /** Preserves the order of nodes and edges in the model file if this does not lead to additional edge crossings. Depending on the strategy this is not always possible since the node and edge order might be conflicting.
 */
  considerModelOrder?: 'NONE' | 'NODES_AND_EDGES' | 'PREFER_EDGES' | 'PREFER_NODES'; // default: "NODES_AND_EDGES"
};
  darkMode?: boolean; // default: false
  htmlLabels?: boolean;
  /** Specifies the font to be used in the rendered diagrams.
Can be any possible CSS `font-family`.
See https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
 */
  fontFamily?: string; // default: "\"trebuchet ms\", verdana, arial, sans-serif;"
  altFontFamily?: string;
  /** This option decides the amount of logging to be used by mermaid.
 */
  logLevel?: 'trace' | '0' | 'debug' | '1' | 'info' | '2' | 'warn' | '3' | 'error' | '4' | 'fatal' | '5' | number; // default: 5
  /** Level of trust for parsed diagram */
  securityLevel?: 'strict' | 'loose' | 'antiscript' | 'sandbox'; // default: "strict"
  /** Dictates whether mermaid starts on Page load */
  startOnLoad?: boolean; // default: true
  /** Controls whether or arrow markers in html code are absolute paths or anchors.
This matters if you are using base tag settings.
 */
  arrowMarkerAbsolute?: boolean; // default: false
  /** This option controls which `currentConfig` keys are considered secure and
can only be changed via call to `mermaid.initialize`.
This prevents malicious graph directives from overriding a site's default security.
 */
  secure?: string[]; // default: ["secure","securityLevel","startOnLoad","maxTextSize","suppressErrorRendering","maxEdges"]
  /** This option specifies if Mermaid can expect the dependent to include KaTeX stylesheets for browsers
without their own MathML implementation. If this option is disabled and MathML is not supported, the math
equations are replaced with a warning. If this option is enabled and MathML is not supported, Mermaid will
fall back to legacy rendering for KaTeX.
 */
  legacyMathML?: boolean; // default: false
  /** This option forces Mermaid to rely on KaTeX's own stylesheet for rendering MathML. Due to differences between OS
fonts and browser's MathML implementation, this option is recommended if consistent rendering is important.
If set to true, ignores legacyMathML.
 */
  forceLegacyMathML?: boolean; // default: false
  /** This option controls if the generated ids of nodes in the SVG are
generated randomly or based on a seed.
If set to `false`, the IDs are generated based on the current date and
thus are not deterministic. This is the default behavior.

This matters if your files are checked into source control e.g. git and
should not change unless content is changed.
 */
  deterministicIds?: boolean; // default: false
  /** This option is the optional seed for deterministic ids.
If set to `undefined` but deterministicIds is `true`, a simple number iterator is used.
You can set this attribute to base the seed on a static string.
 */
  deterministicIDSeed?: string;
  flowchart?: any;
  sequence?: any;
  gantt?: any;
  journey?: any;
  timeline?: any;
  class?: any;
  state?: any;
  er?: any;
  pie?: any;
  quadrantChart?: any;
  xyChart?: any;
  requirement?: any;
  architecture?: any;
  mindmap?: any;
  kanban?: any;
  gitGraph?: any;
  c4?: any;
  sankey?: any;
  packet?: any;
  block?: any;
  radar?: any;
  /** Configuration options to pass to the `dompurify` library. */
  dompurifyConfig?: Record<string, any>;
  wrap?: boolean;
  fontSize?: number; // default: 16
  markdownAutoWrap?: boolean; // default: true
  /** Suppresses inserting 'Syntax error' diagram in the DOM.
This is useful when you want to control how to handle syntax errors in your application.
 */
  suppressErrorRendering?: boolean; // default: false
}