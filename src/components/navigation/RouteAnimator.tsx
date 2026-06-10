import React from 'react';
import { NavNode } from '../../types';

interface RouteAnimatorProps {
  /** All nodes on the current floor that are part of the route */
  nodes: NavNode[];
  /** Index into `nodes` for the currently active step */
  activeIdx: number;
}

/**
 * Renders an animated route polyline on top of the floor SVG.
 * Parent <svg> must use viewBox="0 0 1000 660".
 */
export const RouteAnimator: React.FC<RouteAnimatorProps> = ({ nodes, activeIdx }) => {
  if (nodes.length < 2) return null;

  // Build the polyline points string
  const allPoints = nodes.map((n) => `${n.x},${n.y}`).join(' ');

  // Points up to (and including) the active step — "walked so far"
  const walkedNodes = nodes.slice(0, activeIdx + 1);
  const walkedPoints = walkedNodes.map((n) => `${n.x},${n.y}`).join(' ');

  // Active node position (glowing head)
  const activeNode = nodes[Math.min(activeIdx, nodes.length - 1)];

  return (
    <>
      {/* Full ghost path (dim) */}
      <polyline
        points={allPoints}
        fill="none"
        stroke="#93c5fd"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.35}
        strokeDasharray="8 6"
      />

      {/* Walked portion (bright) */}
      {walkedPoints && (
        <polyline
          points={walkedPoints}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
      )}

      {/* Node dots along entire route */}
      {nodes.map((n, i) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={i <= activeIdx ? 5 : 4}
          fill={i <= activeIdx ? '#2563eb' : '#bfdbfe'}
          stroke="#fff"
          strokeWidth={1.5}
          opacity={0.9}
        />
      ))}

      {/* Glowing head marker at active node */}
      {activeNode && (
        <>
          {/* Outer glow ring */}
          <circle
            cx={activeNode.x}
            cy={activeNode.y}
            r={14}
            fill="#3b82f6"
            opacity={0.2}
          />
          {/* Inner filled circle */}
          <circle
            cx={activeNode.x}
            cy={activeNode.y}
            r={8}
            fill="#1d4ed8"
            stroke="#fff"
            strokeWidth={2}
          />
        </>
      )}
    </>
  );
};
