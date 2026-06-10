export type FloorId = 'ground' | 'first' | 'second';

export type NodeType =
  | 'room'
  | 'lab'
  | 'office'
  | 'washroom'
  | 'staircase'
  | 'lift'
  | 'entrance'
  | 'junction'
  | 'corridor'
  | 'department'
  | 'hall'
  | 'service';

export interface NavNode {
  id: string;
  label: string;
  type: NodeType;
  floor: FloorId;
  x: number;          // SVG coordinate
  y: number;          // SVG coordinate
  description?: string;
}

export interface NavEdge {
  from: string;       // node id
  to: string;         // node id
  weight: number;     // distance in abstract units
  isVertical?: boolean; // staircase/lift edge
}

export interface NavGraph {
  nodes: Record<string, NavNode>;
  edges: NavEdge[];
}

export interface RouteStep {
  nodeId: string;
  label: string;
  floor: FloorId;
  direction?: string; // "Turn left", "Continue straight", etc.
  distance?: number;
  isFloorChange?: boolean;
  floorChangeTo?: FloorId;
  changeType?: 'staircase' | 'lift';
}

export interface Route {
  steps: RouteStep[];
  totalDistance: number;
  estimatedTime: number; // seconds
  floorChanges: number;
  from: NavNode;
  to: NavNode;
}

export interface FloorData {
  id: FloorId;
  label: string;
  svgViewBox: string;
  nodes: NavNode[];
  pathways: PathwaySegment[];
}

export interface PathwaySegment {
  id: string;
  points: [number, number][];
  floor: FloorId;
}

export interface NavigationState {
  from: string | null;
  to: string | null;
  route: Route | null;
  currentFloor: FloorId;
  currentStepIndex: number; // For step-by-step turn-by-turn navigation
  animationPhase: 'idle' | 'animating' | 'floor-switch' | 'complete';
  setFrom: (id: string | null) => void;
  setTo: (id: string | null) => void;
  setRoute: (route: Route | null) => void;
  setCurrentFloor: (floor: FloorId) => void;
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}
