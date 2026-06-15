import React from 'react';
import { ALL_ROOMS } from '../../data/rooms';

const CORRIDOR    = '#dde6f0';
const QUAD        = '#f0f4f8';
const ROOM_FILL   = '#ffffff';
const ROOM_STROKE = '#b0bece';
const LABEL_CLR   = '#2d3748';
const HL_FILL     = '#dbeafe';
const HL_STROKE   = '#3b82f6';

// FF corridor centres: North y=200, South y=530, West x=180, East x=820

interface Props {
  highlightNodeIds: string[];
  onNodeClick?: (id: string) => void;
}

const FirstFloorSVG: React.FC<Props> = ({ highlightNodeIds, onNodeClick }) => {
  const hi = (id: string) => highlightNodeIds.includes(id);
  const rf = (id: string) => (hi(id) ? HL_FILL   : ROOM_FILL);
  const rs = (id: string) => (hi(id) ? HL_STROKE : ROOM_STROKE);

  const dotNodes = ALL_ROOMS.filter(
    (n) => n.floor === 'first' && highlightNodeIds.includes(n.id)
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

  return (
    <svg viewBox="0 0 1000 660" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none" style={{ display: 'block' }}>

      <rect x={0} y={0} width={1000} height={660} fill="#f8fafc" />

      {/* Corridors */}
      <rect x={155} y={175} width={665} height={50} fill={CORRIDOR} />  {/* North */}
      <rect x={155} y={505} width={665} height={50} fill={CORRIDOR} />  {/* South */}
      <rect x={155} y={175} width={50}  height={380} fill={CORRIDOR} /> {/* West */}
      <rect x={795} y={175} width={50}  height={380} fill={CORRIDOR} /> {/* East */}
      <rect x={205} y={225} width={590} height={280} fill={QUAD} rx={4} />
      <text x={500} y={365} textAnchor="middle" fontSize={14}
        fontFamily="Outfit,Inter,sans-serif" fill="#94a3b8" fontStyle="italic">Quadrangle</text>

      <rect x={10} y={10} width={980} height={640} rx={6}
        fill="none" stroke="#94a3b8" strokeWidth={2} />

      {/* ══ TOP NORTH BLOCK (y 10-175) ══════════════════════════════
          Rooms along north corridor from left to right:
          Chemistry Lab arm: node (180,110)
          DSD AEC6:  node (360, 200)  → room above corridor
          ESD AEC7:  node (510, 200)
          Boys WR:   node (625, 200)
          Stair North: node (710, 200)
          Girls WR:  node (820, 120)  → arm off NE junction going north
          Lift:      node (625, 120)  → arm off Boys WR going north
      */}

      {/* Chemistry Lab – north arm off NW junction */}
      <Room id="ff_chemistry_lab"    x={10}  y={10}  w={145} h={165} label="CHEMISTRY" sub="LAB" fontSize={10} />
      {/* Labs along top */}
      <Room id="ff_dsd_lab_aec6"    x={155} y={10}  w={160} h={165} label="DIGITAL SYS." sub="DESIGN LAB AEC6" fontSize={9} />
      <Room id="ff_esd_lab_aec7"    x={315} y={10}  w={160} h={165} label="EMBEDDED SYS." sub="DESIGN LAB AEC7" fontSize={9} />
      {/* Boys WR + Lift together in same north block zone */}
      <Room id="ff_boys_washroom"   x={475} y={10}  w={90}  h={85}  label="BOYS WR" fontSize={8} />
      <Room id="ff_lift"            x={475} y={95}  w={90}  h={80}  label="LIFT" fontSize={9} />
      {/* Staircase North */}
      <Room id="ff_staircase_north" x={565} y={10}  w={90}  h={165} label="STAIRS" sub="N (2+4)" fontSize={9} />
      {/* Girls WR – arm off NE junction north */}
      <Room id="ff_girls_washroom"  x={655} y={10}  w={165} h={165} label="GIRLS" sub="WASHROOM" fontSize={9} />

      {/* ══ LEFT WING (x 10-155, y 175-555) ════════════════════════
          West corridor entry at x=155, nodes at x=180:
            HOD A17          y=270
            Server Room A35  y=375
            A2 Computer      y=470
      */}
      <Room id="ff_hod_ece_a17"        x={10} y={175} w={145} h={125} label="HOD ECE" sub="DEPT A17" fontSize={9} />
      <Room id="ff_server_room_a35"     x={10} y={300} w={145} h={100} label="SERVER RM" sub="A35" fontSize={9} />
      <Room id="ff_a2_computer_center"  x={10} y={400} w={145} h={105} label="A2 COMPUTER" sub="CENTER" fontSize={9} />
      {/* Xerox SW – arm off SW junction going south */}
      <Room id="ff_xerox_shop_sw"      x={10} y={505} w={145} h={145} label="XEROX" sub="SHOP" fontSize={9} />

      {/* ══ RIGHT WING (x 845-990) ══════════════════════════════════
          East corridor entry at x=845, nodes at x=820:
            Project Lab arm  y=260  → room to right of NE junction
            Lab East         y=390  → room to right of east corridor
      */}
      <Room id="ff_project_lab" x={845} y={175} w={145} h={165} label="PROJECT" sub="LAB" fontSize={9} />
      <Room id="ff_lab_east"    x={845} y={340} w={145} h={165} label="LAB" sub="(EAST)" fontSize={9} />
      {/* SE corner empty/corridor */}
      <rect x={845} y={505} width={145} height={145} rx={3}
        fill="#f1f5f9" stroke={ROOM_STROKE} strokeWidth={1} />
      <text x={917} y={578} textAnchor="middle" fontSize={8}
        fontFamily="Outfit,Inter,sans-serif" fill="#94a3b8" transform="rotate(-90, 917, 578)">CORRIDOR</text>

      {/* ══ BOTTOM SOUTH BLOCK (y 555-640) ══════════════════════════
          South corridor nodes at y=530:
            AEC1 x=710   AEC2 x=570   AEC3 x=430
            StairSouth x=330   Xerox S x=260
      */}
      <Room id="ff_aec1"            x={640} y={555} w={210} h={95}  label="AEC1" sub="CLASSROOM" fontSize={9} />
      <Room id="ff_aec2"            x={495} y={555} w={145} h={95}  label="AEC2" sub="CLASSROOM" fontSize={9} />
      <Room id="ff_aec3"            x={350} y={555} w={145} h={95}  label="AEC3" sub="CLASSROOM" fontSize={9} />
      <Room id="ff_staircase_south" x={245} y={555} w={105} h={95}  label="STAIRS" sub="1 & 3" fontSize={9} />
      <Room id="ff_xerox_shop_s"    x={155} y={555} w={90}  h={95}  label="XEROX" fontSize={8} />

      {/* Corridor grid lines */}
      <line x1={180} y1={175} x2={180} y2={555} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={820} y1={175} x2={820} y2={555} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={155} y1={200} x2={820} y2={200} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={155} y1={530} x2={820} y2={530} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />

      <text x={500} y={25} textAnchor="middle" fontSize={13}
        fontFamily="Outfit,Inter,sans-serif" fontWeight="700" fill="#475569" transform="rotate(-90, 500, 25)">
        FIRST FLOOR
      </text>

      {/* Route dots */}
      {dotNodes.map((n) => (
        <circle key={n.id} cx={n.x} cy={n.y} r={7}
          fill={HL_STROKE} stroke="#fff" strokeWidth={2} opacity={0.9} />
      ))}
    </svg>
  );
};

export default FirstFloorSVG;
