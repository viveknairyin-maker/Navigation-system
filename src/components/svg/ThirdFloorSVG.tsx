import React from 'react';
import { ALL_ROOMS } from '../../data/rooms';

// ─── colour palette (same as other floors) ───────────────────────────────────
const CORRIDOR    = '#dde6f0';
const QUAD        = '#f0f4f8';
const ROOM_FILL   = '#ffffff';
const ROOM_STROKE = '#b0bece';
const LABEL_CLR   = '#2d3748';
const HL_FILL     = '#dbeafe';
const HL_STROKE   = '#3b82f6';

// Third Floor corridor centres (identical viewport to other floors):
//   North y=155  South y=505  West x=180  East x=820
// Corridor bands:  N y=130-180, S y=480-530, W x=155-205, E x=795-845

interface Props {
  highlightNodeIds: string[];
  onNodeClick?: (id: string) => void;
}

const ThirdFloorSVG: React.FC<Props> = ({ highlightNodeIds, onNodeClick }) => {
  const hi = (id: string) => highlightNodeIds.includes(id);
  const rf = (id: string) => (hi(id) ? HL_FILL   : ROOM_FILL);
  const rs = (id: string) => (hi(id) ? HL_STROKE : ROOM_STROKE);

  const dotNodes = ALL_ROOMS.filter(
    (n) => n.floor === 'third' && highlightNodeIds.includes(n.id)
  );

  const Room = ({
    id, x, y, w, h, label, sub, fontSize = 10,
  }: {
    id: string; x: number; y: number; w: number; h: number;
    label: string; sub?: string; fontSize?: number;
  }) => (
    <g onClick={() => onNodeClick?.(id)} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width={w} height={h} rx={3}
        fill={rf(id)} stroke={rs(id)} strokeWidth={hi(id) ? 1.5 : 1} />
      <g transform={`rotate(-90, ${x + w / 2}, ${y + h / 2})`}>
        <text x={x + w / 2} y={y + h / 2 - (sub ? 5 : 0)}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={fontSize} fontFamily="Outfit,Inter,sans-serif"
          fontWeight="600" fill={hi(id) ? '#1d4ed8' : LABEL_CLR}>{label}</text>
        {sub && (
          <text x={x + w / 2} y={y + h / 2 + 8}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={8} fontFamily="Outfit,Inter,sans-serif"
            fill={hi(id) ? '#3b82f6' : '#64748b'}>{sub}</text>
        )}
      </g>
    </g>
  );
 
  // Staircase box helper (cross-hatched pattern)
  const StairBox = ({
    id, x, y, w, h, label,
  }: {
    id: string; x: number; y: number; w: number; h: number; label: string;
  }) => (
    <g onClick={() => onNodeClick?.(id)} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width={w} height={h} rx={2}
        fill={hi(id) ? HL_FILL : '#e8eef6'} stroke={rs(id)} strokeWidth={hi(id) ? 1.5 : 1} />
      {/* Cross hatch lines to indicate staircase */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t}
          x1={x} y1={y + h * t} x2={x + w} y2={y + h * t}
          stroke={hi(id) ? '#93c5fd' : '#c4d5e8'} strokeWidth={0.8} />
      ))}
      <g transform={`rotate(-90, ${x + w / 2}, ${y + h / 2})`}>
        <text x={x + w / 2} y={y + h / 2 - 4}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={8} fontFamily="Outfit,Inter,sans-serif"
          fontWeight="700" fill={hi(id) ? '#1d4ed8' : '#475569'}>{label}</text>
        <text x={x + w / 2} y={y + h / 2 + 6}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={7} fontFamily="Outfit,Inter,sans-serif"
          fill={hi(id) ? '#3b82f6' : '#94a3b8'}>↕ STAIRS</text>
      </g>
    </g>
  );

  return (
    <svg viewBox="0 0 1000 660" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none" style={{ display: 'block' }}>

      {/* ── Background ──────────────────────────────────────────── */}
      <rect x={0} y={0} width={1000} height={660} fill="#f8fafc" />

      {/* ── Corridor bands ─────────────────────────────────────── */}
      <rect x={155} y={130} width={665} height={50}  fill={CORRIDOR} />  {/* North */}
      <rect x={155} y={480} width={665} height={50}  fill={CORRIDOR} />  {/* South */}
      <rect x={155} y={130} width={50}  height={400} fill={CORRIDOR} />  {/* West */}
      <rect x={795} y={130} width={50}  height={400} fill={CORRIDOR} />  {/* East */}

      {/* ── Quadrangle ─────────────────────────────────────────── */}
      <rect x={205} y={180} width={590} height={300} fill={QUAD} rx={4} />
      <text x={500} y={330} textAnchor="middle" fontSize={14}
        fontFamily="Outfit,Inter,sans-serif" fill="#94a3b8" fontStyle="italic">
        Quadrangle
      </text>

      {/* ── Outer building wall ─────────────────────────────────── */}
      <rect x={10} y={10} width={980} height={640} rx={6}
        fill="none" stroke="#94a3b8" strokeWidth={2} />

      {/* ════════════════════════════════════════════════════════
          NORTH BLOCK  (y = 10-130)
          Rooms sit ABOVE the north corridor band.
          Layout left→right:
            [10-155]   Food Tech NW (arm, left of west corridor)
            [155-360]  Food Technology (large)
            [360-505]  Food Technology VI
            [505-585]  Lift Room
            [585-675]  Staircase North
            [675-795]  Chakra Robotics & AI
            [795-990]  ACS1 (in right wing, arm of j_ne)
          ════════════════════════════════════════════════════════ */}

      {/* Food Tech NW – small room NW corner */}
      <Room id="tf_food_tech_nw"    x={10}  y={10} w={145} h={120}
        label="FOOD TECH" sub="(NW)" fontSize={9} />

      {/* Food Technology – large north room */}
      <Room id="tf_food_technology" x={155} y={10} w={205} h={120}
        label="FOOD" sub="TECHNOLOGY" fontSize={10} />

      {/* Food Technology VI */}
      <Room id="tf_food_tech_vi"    x={360} y={10} w={145} h={120}
        label="FOOD TECH" sub="VI" fontSize={9} />

      {/* Lift Room */}
      <g onClick={() => onNodeClick?.('tf_lift_room')} style={{ cursor: 'pointer' }}>
        <rect x={505} y={10} width={80} height={120} rx={3}
          fill={rf('tf_lift_room')} stroke={rs('tf_lift_room')}
          strokeWidth={hi('tf_lift_room') ? 1.5 : 1} />
        <g transform="rotate(-90, 545, 70)">
          <text x={545} y={62} textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fontFamily="Outfit,Inter,sans-serif" fontWeight="700"
            fill={hi('tf_lift_room') ? '#1d4ed8' : LABEL_CLR}>LIFT</text>
          <text x={545} y={76} textAnchor="middle" dominantBaseline="middle"
            fontSize={8} fontFamily="Outfit,Inter,sans-serif"
            fill={hi('tf_lift_room') ? '#3b82f6' : '#64748b'}>ROOM</text>
        </g>
      </g>

      {/* Staircase North */}
      <StairBox id="tf_staircase_north" x={585} y={10} w={90} h={120}
        label="STAIRS N" />

      {/* Chakra Robotics & AI */}
      <Room id="tf_chakra_robotics" x={675} y={10} w={120} h={120}
        label="CHAKRA" sub="ROBOTICS & AI" fontSize={9} />

      {/* ACS1 – NE corner arm from tf_j_ne going north */}
      <Room id="tf_acs1"           x={845} y={10} w={145} h={120}
        label="ACS1" fontSize={11} />

      {/* ════════════════════════════════════════════════════════
          LEFT WING  (x = 10-155)
          CSE Staff: y=148-278  node (180,235)
          [gap corridor y=278-395]
          Pragma Lab: y=395-505  node (180,475)
          ════════════════════════════════════════════════════════ */}
      <Room id="tf_cse_staff"  x={10} y={148} w={145} h={130}
        label="CSE" sub="STAFF ROOM" fontSize={9} />
      <Room id="tf_pragma_lab" x={10} y={395} w={145} h={110}
        label="PRAGMA" sub="LAB" fontSize={9} />

      {/* ════════════════════════════════════════════════════════
          RIGHT WING  (x = 845-990)
          ACS2-5 run down the east corridor.
          ════════════════════════════════════════════════════════ */}
      <Room id="tf_acs2" x={845} y={148} w={145} h={95} label="ACS2" fontSize={11} />
      <Room id="tf_acs3" x={845} y={255} w={145} h={95} label="ACS3" fontSize={11} />
      <Room id="tf_acs4" x={845} y={360} w={145} h={95} label="ACS4" fontSize={11} />
      <Room id="tf_acs5" x={845} y={448} w={145} h={82} label="ACS5" fontSize={11} />

      {/* ════════════════════════════════════════════════════════
          SOUTH BLOCK  (y = 530-640)
          Rooms sit BELOW the south corridor band.
          Layout left→right:
            [155-370]  ECE Seminar Hall   node (262, 505)
            [370-460]  Stairs South       node (415, 505)
            [460-845]  Food Technology    node (652, 505)
          ════════════════════════════════════════════════════════ */}
      <Room id="tf_ece_seminar_hall" x={155} y={530} w={215} h={110}
        label="ECE" sub="SEMINAR HALL" fontSize={9} />
      <StairBox id="tf_staircase_south" x={370} y={530} w={90} h={110}
        label="STAIRS S" />
      <Room id="tf_food_tech_south" x={460} y={530} w={385} h={110}
        label="FOOD TECHNOLOGY" fontSize={10} />

      {/* ── Corridor centre-line guides (subtle) ───────────────── */}
      <line x1={180} y1={130} x2={180} y2={530}
        stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={820} y1={130} x2={820} y2={530}
        stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={155} y1={155} x2={820} y2={155}
        stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={155} y1={505} x2={820} y2={505}
        stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />

      {/* ── PATHWAY labels (match blueprint) ───────────────────── */}
      <text x={500} y={147} textAnchor="middle" fontSize={7}
        fontFamily="Outfit,Inter,sans-serif" fill="#94a3b8" letterSpacing={2}>PATHWAY</text>
      <text x={500} y={520} textAnchor="middle" fontSize={7}
        fontFamily="Outfit,Inter,sans-serif" fill="#94a3b8" letterSpacing={2}>PATHWAY</text>
      <text x={170} y={330} textAnchor="middle" fontSize={7} transform="rotate(-90,170,330)"
        fontFamily="Outfit,Inter,sans-serif" fill="#94a3b8" letterSpacing={2}>PATHWAY</text>
      <text x={830} y={330} textAnchor="middle" fontSize={7} transform="rotate(-90,830,330)"
        fontFamily="Outfit,Inter,sans-serif" fill="#94a3b8" letterSpacing={2}>PATHWAY</text>

      {/* ── Floor label ─────────────────────────────────────────── */}
      <text x={500} y={25} textAnchor="middle" fontSize={13}
        fontFamily="Outfit,Inter,sans-serif" fontWeight="700" fill="#475569" transform="rotate(-90, 500, 25)">
        THIRD FLOOR
      </text>

      {/* ── Route dot indicators ─────────────────────────────────── */}
      {dotNodes.map((n) => (
        <circle key={n.id} cx={n.x} cy={n.y} r={7}
          fill={HL_STROKE} stroke="#fff" strokeWidth={2} opacity={0.9} />
      ))}
    </svg>
  );
};

export default ThirdFloorSVG;
