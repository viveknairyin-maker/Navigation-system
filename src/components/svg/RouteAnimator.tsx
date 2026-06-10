import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { NavNode } from '../../types';

interface Props {
  pathNodes: NavNode[];
  currentFloor: string;
  isAnimating: boolean;
}

export const RouteAnimator: React.FC<Props> = ({
  pathNodes,
  currentFloor,
  isAnimating,
}) => {
  const controls = useAnimation();

  // Filter nodes that belong to the current floor
  const floorNodes = pathNodes.filter((n) => n.floor === currentFloor);

  if (floorNodes.length === 0) return null;

  // If there's only 1 node on this floor (e.g. entrance/exit node of floor change)
  if (floorNodes.length === 1) {
    const node = floorNodes[0];
    return (
      <g id="route-layer-single">
        <circle
          cx={node.x}
          cy={node.y}
          r={10}
          fill="#3b82f6"
          stroke="white"
          strokeWidth={2.5}
          className="pulse-node"
        />
        <text x={node.x} y={node.y - 15} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563eb">
          {node.label}
        </text>
      </g>
    );
  }

  const points = floorNodes.map((n) => `${n.x},${n.y}`).join(' ');

  // Calculate path length for stroke dashoffset animation
  const totalLength = floorNodes.reduce((acc, node, i) => {
    if (i === 0) return 0;
    const prev = floorNodes[i - 1];
    return acc + Math.hypot(node.x - prev.x, node.y - prev.y);
  }, 0);

  useEffect(() => {
    if (isAnimating) {
      controls.set({ strokeDashoffset: totalLength });
      controls.start({
        strokeDashoffset: 0,
        transition: { duration: Math.max(1, totalLength / 180), ease: 'easeInOut' },
      });
    }
  }, [isAnimating, controls, totalLength, currentFloor]);

  const isStartFloor = pathNodes[0].floor === currentFloor;
  const isEndFloor = pathNodes[pathNodes.length - 1].floor === currentFloor;

  const startNode = floorNodes[0];
  const endNode = floorNodes[floorNodes.length - 1];

  return (
    <g id="route-layer">
      {/* Glow effect filter */}
      <defs>
        <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Underlay route line */}
      <polyline
        points={points}
        fill="none"
        stroke="#93c5fd"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
      />

      {/* Animated route path */}
      <motion.polyline
        points={points}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#routeGlow)"
        strokeDasharray={totalLength}
        initial={{ strokeDashoffset: totalLength }}
        animate={controls}
      />

      {/* Tracking animated dot */}
      <motion.circle
        r={7}
        fill="#2563eb"
        stroke="#ffffff"
        strokeWidth={2}
        initial={{ cx: startNode.x, cy: startNode.y, opacity: 0 }}
        animate={
          isAnimating
            ? {
                cx: floorNodes.map((n) => n.x),
                cy: floorNodes.map((n) => n.y),
                opacity: [0, 1, 1, 1],
              }
            : { opacity: 0 }
        }
        transition={{
          duration: Math.max(1, totalLength / 180),
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: 0.5,
        }}
      />

      {/* Start pin on this floor */}
      {isStartFloor && (
        <g>
          <circle cx={startNode.x} cy={startNode.y} r={12} fill="#10b981" stroke="white" strokeWidth={2} />
          <circle cx={startNode.x} cy={startNode.y} r={4} fill="white" />
        </g>
      )}

      {/* End pin on this floor */}
      {isEndFloor && (
        <g>
          <circle cx={endNode.x} cy={endNode.y} r={12} fill="#ef4444" stroke="white" strokeWidth={2} />
          <circle cx={endNode.x} cy={endNode.y} r={4} fill="white" />
        </g>
      )}

      {/* Intermediate connector (stairs/lift icon indicator) */}
      {!isStartFloor && (
        <g>
          <circle cx={startNode.x} cy={startNode.y} r={9} fill="#f59e0b" stroke="white" strokeWidth={1.5} />
          <text x={startNode.x} y={startNode.y + 3} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">↑</text>
        </g>
      )}
      {!isEndFloor && (
        <g>
          <circle cx={endNode.x} cy={endNode.y} r={9} fill="#f59e0b" stroke="white" strokeWidth={1.5} />
          <text x={endNode.x} y={endNode.y + 3} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">↓</text>
        </g>
      )}
    </g>
  );
};
