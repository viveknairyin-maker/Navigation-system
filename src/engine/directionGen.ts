import { NavGraph, RouteStep, NavNode } from '../types';

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

    let direction = '';

    if (i === 0) {
      direction = `Start at ${node.label}`;
    } else if (node.type === 'staircase') {
      const floorOrder: Record<string, number> = { ground: 0, first: 1, second: 2, third: 3 };
      const floorLabel: Record<string, string> = { ground: 'Ground', first: '1st', second: '2nd', third: '3rd' };
      const goingUp = nextNode && (floorOrder[nextNode.floor] ?? 0) > (floorOrder[node.floor] ?? 0);
      direction = goingUp
        ? `Climb stairs up to the ${floorLabel[nextNode?.floor ?? '']} Floor`
        : `Go down stairs to the ${floorLabel[nextNode?.floor ?? '']} Floor`;
    } else if (node.type === 'lift') {
      const floorOrder: Record<string, number> = { ground: 0, first: 1, second: 2, third: 3 };
      const floorLabel: Record<string, string> = { ground: 'Ground', first: '1st', second: '2nd', third: '3rd' };
      const goingUp = nextNode && (floorOrder[nextNode.floor] ?? 0) > (floorOrder[node.floor] ?? 0);
      direction = goingUp
        ? `Take the Lift up to the ${floorLabel[nextNode?.floor ?? '']} Floor`
        : `Take the Lift down to the ${floorLabel[nextNode?.floor ?? '']} Floor`;
    } else if (i === path.length - 1) {
      direction = `Arrive at ${node.label}`;
    } else if (prevNode && nextNode) {
      // If we are at a junction/corridor, calculate the turn instruction
      const curBearing = bearing(prevNode, node);
      const nextBearing = bearing(node, nextNode);
      const turn = turnInstruction(curBearing, nextBearing);
      
      // If we continue straight, avoid spamming the user unless it is a main hallway
      if (turn === 'Continue straight') {
        direction = `Continue straight past ${node.label}`;
      } else {
        direction = `${turn} at ${node.label}`;
      }
    } else {
      direction = `Walk towards ${node.label}`;
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
