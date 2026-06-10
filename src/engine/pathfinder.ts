import { NavGraph, NavNode } from '../types';

function heuristic(a: NavNode, b: NavNode): number {
  // Scale pixel distance to edge-weight units.
  // SVG is 1000×660 px; max corridor distance ≈ 800 px ≈ weight 80.
  // So scale factor ≈ 0.1  (800 px → 80 units)
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const pixelDist = Math.sqrt(dx * dx + dy * dy);

  // Floor penalty: each floor crossing costs ~50 weight units
  const floorOrder: Record<string, number> = { ground: 0, first: 1, second: 2 };
  const floorDiff = Math.abs((floorOrder[a.floor] ?? 0) - (floorOrder[b.floor] ?? 0));
  const floorPenalty = floorDiff * 50;

  return pixelDist * 0.1 + floorPenalty;
}

export function findRoute(
  graph: NavGraph,
  fromId: string,
  toId: string
): string[] | null {
  const open = new Set<string>();
  const closed = new Set<string>();

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, string>();

  const startNode = graph.nodes[fromId];
  const goalNode = graph.nodes[toId];
  if (!startNode || !goalNode) return null;

  open.add(fromId);
  gScore.set(fromId, 0);
  fScore.set(fromId, heuristic(startNode, goalNode));

  while (open.size > 0) {
    // Find the node in open set with lowest fScore
    let currentId = '';
    let minF = Infinity;
    for (const id of open) {
      const f = fScore.get(id) ?? Infinity;
      if (f < minF) {
        minF = f;
        currentId = id;
      }
    }

    if (!currentId) break;

    // Reach destination
    if (currentId === toId) {
      const path: string[] = [];
      let temp: string | undefined = currentId;
      while (temp) {
        path.unshift(temp);
        temp = cameFrom.get(temp);
      }
      return path;
    }

    open.delete(currentId);
    closed.add(currentId);

    // Scan neighbors
    for (const edge of graph.edges) {
      if (edge.from !== currentId) continue;
      if (closed.has(edge.to)) continue;

      const neighbor = graph.nodes[edge.to];
      if (!neighbor) continue;

      // Distance weight
      const tentativeG = (gScore.get(currentId) ?? Infinity) + edge.weight;

      if (!open.has(edge.to)) {
        open.add(edge.to);
      } else if (tentativeG >= (gScore.get(edge.to) ?? Infinity)) {
        continue; // Not a better path
      }

      cameFrom.set(edge.to, currentId);
      gScore.set(edge.to, tentativeG);
      fScore.set(edge.to, tentativeG + heuristic(neighbor, goalNode));
    }
  }

  return null; // Route not found
}
export default findRoute;
