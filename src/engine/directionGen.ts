import { NavGraph, RouteStep, NavNode, FloorId, getFloorLabel } from '../types';

const floorOrder: Record<FloorId, number> = { ground: 0, first: 1, second: 2, third: 3 };

function bearing(a: NavNode, b: NavNode): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  if (angle > -45 && angle <= 45) return 'east';
  if (angle > 45 && angle <= 135) return 'south';
  if (angle > 135 || angle <= -135) return 'west';
  return 'north';
}

function turnInstruction(prev: string, next: string): string {
  const dirs = ['north', 'east', 'south', 'west'];
  const pi = dirs.indexOf(prev);
  const ni = dirs.indexOf(next);
  const diff = (ni - pi + 4) % 4;
  if (diff === 0) return 'Continue straight';
  if (diff === 1) return 'Turn right';
  if (diff === 2) return 'Turn around';
  return 'Turn left';
}

function getNormalDirection(prevNode: NavNode | null, node: NavNode, nextNode: NavNode | null): string {
  if (prevNode && nextNode) {
    const curBearing = bearing(prevNode, node);
    const nextBearing = bearing(node, nextNode);
    const turn = turnInstruction(curBearing, nextBearing);
    
    if (turn === 'Continue straight') {
      return `Continue straight past ${node.label}`;
    } else {
      return `${turn} at ${node.label}`;
    }
  } else if (nextNode) {
    return `Walk towards ${node.label}`;
  } else {
    return `Arrive at ${node.label}`;
  }
}

export function generateDirections(
  path: string[],
  graph: NavGraph
): RouteStep[] {
  const steps: RouteStep[] = [];

  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];
    const node = graph.nodes[nodeId];
    if (!node) continue;

    const nextNode = i < path.length - 1 ? graph.nodes[path[i + 1]] : null;
    const prevNode = i > 0 ? graph.nodes[path[i - 1]] : null;

    // Skip landing stair/lift nodes where transition has already been described
    const isStaircaseOrLift = node.type === 'staircase' || node.type === 'lift';
    const isLanding =
      isStaircaseOrLift &&
      i > 0 &&
      i < path.length - 1 &&
      graph.nodes[path[i - 1]]?.type === node.type &&
      graph.nodes[path[i - 1]]?.floor !== node.floor &&
      (nextNode === null || nextNode.floor === node.floor);

    if (isLanding) {
      continue;
    }

    let direction = '';

    if (i === 0) {
      direction = `Start at ${node.label}`;
    } else if (node.type === 'staircase') {
      const curFloorVal = floorOrder[node.floor] ?? 0;
      const nextFloorVal = nextNode ? (floorOrder[nextNode.floor] ?? 0) : curFloorVal;
      
      if (nextNode && nextFloorVal > curFloorVal) {
        direction = `Climb stairs to ${getFloorLabel(nextNode.floor)}`;
      } else if (nextNode && nextFloorVal < curFloorVal) {
        direction = `Go down stairs to ${getFloorLabel(nextNode.floor)}`;
      } else {
        direction = getNormalDirection(prevNode, node, nextNode);
      }
    } else if (node.type === 'lift') {
      const curFloorVal = floorOrder[node.floor] ?? 0;
      const nextFloorVal = nextNode ? (floorOrder[nextNode.floor] ?? 0) : curFloorVal;
      
      if (nextNode && nextFloorVal > curFloorVal) {
        direction = `Take Lift to ${getFloorLabel(nextNode.floor)}`;
      } else if (nextNode && nextFloorVal < curFloorVal) {
        direction = `Take Lift down to ${getFloorLabel(nextNode.floor)}`;
      } else {
        direction = getNormalDirection(prevNode, node, nextNode);
      }
    } else if (i === path.length - 1) {
      direction = `Arrive at ${node.label}`;
    } else {
      direction = getNormalDirection(prevNode, node, nextNode);
    }

    // Detect if this step causes a floor change in the next step
    const isFloorChange = nextNode !== null && nextNode.floor !== node.floor;

    steps.push({
      nodeId,
      label: node.label,
      floor: node.floor,
      direction,
      isFloorChange,
      floorChangeTo: isFloorChange ? nextNode?.floor : undefined,
      changeType:
        node.type === 'lift'
          ? 'lift'
          : node.type === 'staircase'
          ? 'staircase'
          : undefined,
    });
  }

  return steps;
}
