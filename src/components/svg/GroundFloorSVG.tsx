import React from 'react';
import { ALL_ROOMS } from '../../data/rooms';

// ─── colour helpers ───────────────────────────────────────────────────────────
const CORRIDOR   = '#dde6f0';   // corridor band
const QUAD       = '#f0f4f8';   // inner quadrangle
const ROOM_FILL  = '#ffffff';
const ROOM_STROKE= '#b0bece';
const LABEL_CLR  = '#2d3748';
const HL_FILL    = '#dbeafe';
const HL_STROKE  = '#3b82f6';

// Corridor geometry (shared across all floors):
//   North band : y 130-180  (centre 155)
//   South band : y 480-530  (centre 505)
//   West  band : x 155-205  (centre 180)
//   East  band : x 795-845  (centre 820)
//   Quadrangle : x 205-795, y 180-480

interface Props {
  highlightNodeIds: string[];
  onNodeClick?: (id: string) => void;
}

const GroundFloorSVG: React.FC<Props> = ({ highlightNodeIds, onNodeClick }) => {
  const hi = (id: string) => highlightNodeIds.includes(id);
  const rf = (id: string) => (hi(id) ? HL_FILL   : ROOM_FILL);
  const rs = (id: string) => (hi(id) ? HL_STROKE : ROOM_STROKE);

  // Get highlight nodes for this floor to draw dot indicators
  const dotNodes = ALL_ROOMS.filter(
    (n) => n.floor === 'ground' && highlightNodeIds.includes(n.id)
  );

  const Room = ({
    id, x, y, w, h, label, sub,
    clickable = true, fontSize = 10,
  }: {
    id: string; x: number; y: number; w: number; h: number;
    label: string; sub?: string; clickable?: boolean; fontSize?: number;
  }) => (
    <g
      onClick={() => clickable && onNodeClick?.(id)}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      <rect x={x} y={y} width={w} height={h} rx={3} ry={3}
        fill={rf(id)} stroke={rs(id)} strokeWidth={hi(id) ? 1.5 : 1} />
      <text x={x + w / 2} y={y + h / 2 - (sub ? 5 : 0)}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={fontSize} fontFamily="Outfit,Inter,sans-serif"
        fontWeight="600" fill={hi(id) ? '#1d4ed8' : LABEL_CLR}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 8}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={8} fontFamily="Outfit,Inter,sans-serif"
          fill={hi(id) ? '#3b82f6' : '#64748b'}>
          {sub}
        </text>
      )}
    </g>
  );

  return (
    <svg viewBox="0 0 1000 660" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none" style={{ display: 'block' }}>

      {/* ── background ─────────────────────────────────────────── */}
      <rect x={0} y={0} width={1000} height={660} fill="#f8fafc" />

      {/* ── corridor bands ──────────────────────────────────────── */}
      {/* North band */}
      <rect x={155} y={130} width={665} height={50} fill={CORRIDOR} />
      {/* South band */}
      <rect x={155} y={480} width={665} height={50} fill={CORRIDOR} />
      {/* West band */}
      <rect x={155} y={130} width={50}  height={400} fill={CORRIDOR} />
      {/* East band */}
      <rect x={795} y={130} width={50}  height={400} fill={CORRIDOR} />
      {/* Quadrangle */}
      <rect x={205} y={180} width={590} height={300} fill={QUAD} rx={4} />
      <text x={500} y={330} textAnchor="middle" fontSize={14}
        fontFamily="Outfit,Inter,sans-serif" fill="#94a3b8" fontStyle="italic">
        Quadrangle
      </text>

      {/* ── outer building wall ──────────────────────────────────── */}
      <rect x={10} y={10} width={980} height={640} rx={6}
        fill="none" stroke="#94a3b8" strokeWidth={2} />

      {/* ══ LEFT WING rooms (x 10-155) ══════════════════════════════
          West corridor entry points at x=155 / x=180 (centre)
          Node positions on corridor at x=180:
            gf_staircase1        y=215
            gf_girls_washroom    y=330
            gf_back_entrance_aud y=425
      */}
      <Room id="gf_staircase1"        x={10}  y={130} w={145} h={112} label="STAIRS 1"     sub="To 1st Floor" fontSize={10} />
      <Room id="gf_girls_washroom"    x={10}  y={264} w={145} h={116} label="GIRLS"         sub="WASHROOM" fontSize={10} />
      <Room id="gf_back_entrance_aud" x={10}  y={398} w={145} h={72}  label="BACK ENT."     sub="AUDITORIUM" fontSize={9} />
      <Room id="gf_auditorium"        x={10}  y={472} w={145} h={178} label="AUDITORIUM"    fontSize={11} />

      {/* ══ TOP BLOCK (y 10-130) ════════════════════════════════════
          Back Entrance College: node at x=520, y=155
      */}
      <Room id="gf_back_entrance" x={340} y={10} w={330} h={120} label="BACK ENTRANCE" sub="College" fontSize={11} />

      {/* ══ RIGHT WING rooms (x 845-990) ════════════════════════════
          East corridor entry at x=845 / x=820 (centre)
          Nodes on corridor at x=820:
            gf_principal_office y=215
            gf_staircase2       y=320
            gf_atm              y=415
      */}
      <Room id="gf_principal_office"  x={845} y={130} w={145} h={112} label="PRINCIPAL"    sub="OFFICE" fontSize={10} />
      <Room id="gf_staircase2"        x={845} y={264} w={145} h={100} label="STAIRS 2"     sub="To 1st Floor" fontSize={10} />
      <Room id="gf_atm"               x={845} y={376} w={145} h={84}  label="ATM"          fontSize={11} />
      {/* Main Entrance spans from y=462 down; gf_entrance node at (820,580) */}
      <Room id="gf_entrance"          x={845} y={472} w={145} h={178} label="MAIN"         sub="ENTRANCE" fontSize={10} />

      {/* ══ BOTTOM BLOCK (y 530-640) ════════════════════════════════
          Management Office: node at (440, 505) — on corridor
      */}
      <Room id="gf_management_office" x={175} y={530} w={615} h={120} label="MANAGEMENT OFFICE" fontSize={11} />

      {/* ══ Corridor grid lines (subtle) ════════════════════════════ */}
      <line x1={180} y1={130} x2={180} y2={530} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={820} y1={130} x2={820} y2={530} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={155} y1={155} x2={820} y2={155} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={155} y1={505} x2={820} y2={505} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />

      {/* ══ FLOOR LABEL ═════════════════════════════════════════════ */}
      <text x={500} y={25} textAnchor="middle" fontSize={13}
        fontFamily="Outfit,Inter,sans-serif" fontWeight="700" fill="#475569">
        GROUND FLOOR
      </text>

      {/* ══ Route dot indicators ════════════════════════════════════ */}
      {dotNodes.map((n) => (
        <circle key={n.id} cx={n.x} cy={n.y} r={7}
          fill={HL_STROKE} stroke="#fff" strokeWidth={2} opacity={0.9} />
      ))}
    </svg>
  );
};

export default GroundFloorSVG;
