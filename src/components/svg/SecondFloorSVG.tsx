import React from 'react';
import { ALL_ROOMS } from '../../data/rooms';

const CORRIDOR    = '#dde6f0';
const QUAD        = '#f0f4f8';
const ROOM_FILL   = '#ffffff';
const ROOM_STROKE = '#b0bece';
const LABEL_CLR   = '#2d3748';
const HL_FILL     = '#dbeafe';
const HL_STROKE   = '#3b82f6';

// SF corridor centres match GF (same viewport):
// North y=155, South y=505, West x=180, East x=820

interface Props {
  highlightNodeIds: string[];
  onNodeClick?: (id: string) => void;
}

const SecondFloorSVG: React.FC<Props> = ({ highlightNodeIds, onNodeClick }) => {
  const hi = (id: string) => highlightNodeIds.includes(id);
  const rf = (id: string) => (hi(id) ? HL_FILL   : ROOM_FILL);
  const rs = (id: string) => (hi(id) ? HL_STROKE : ROOM_STROKE);

  const dotNodes = ALL_ROOMS.filter(
    (n) => n.floor === 'second' && highlightNodeIds.includes(n.id)
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
      <g transform={`translate(${x + w / 2}, ${y + h / 2}) scale(-1, 1) translate(-${x + w / 2}, -${y + h / 2})`}>
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
      <rect x={155} y={130} width={665} height={50} fill={CORRIDOR} />  {/* North */}
      <rect x={155} y={480} width={665} height={50} fill={CORRIDOR} />  {/* South */}
      <rect x={155} y={130} width={50}  height={400} fill={CORRIDOR} /> {/* West */}
      <rect x={795} y={130} width={50}  height={400} fill={CORRIDOR} /> {/* East */}
      <rect x={205} y={180} width={590} height={300} fill={QUAD} rx={4} />
      <g transform="translate(500, 330) scale(-1, 1) translate(-500, -330)">
        <text x={500} y={330} textAnchor="middle" fontSize={14}
          fontFamily="Outfit,Inter,sans-serif" fill="#94a3b8" fontStyle="italic">Quadrangle</text>
      </g>

      <rect x={10} y={10} width={980} height={640} rx={6}
        fill="none" stroke="#94a3b8" strokeWidth={2} />

      {/* ══ TOP NORTH BLOCK (y 10-130) ══════════════════════════════
          NW arms: English Lab (180,100) and NCC Office (80,75)
          North corridor node: Maths Dept (390, 155)
          NE arm: Library (910, 90)
      */}
      {/* NCC + English Lab in NW corner */}
      <Room id="sf_ncc_office"   x={10}  y={10}  w={145} h={68}  label="NCC OFFICE"  fontSize={9} />
      <Room id="sf_english_lab"  x={10}  y={78}  w={145} h={52}  label="ENGLISH LAB" fontSize={9} />
      {/* Maths Dept along top centre */}
      <Room id="sf_maths_dept"   x={155} y={10}  w={370} h={120} label="MATHS DEPARTMENT" fontSize={10} />
      {/* Library in NE top corner */}
      <Room id="sf_library"      x={525} y={10}  w={465} h={120} label="LIBRARY" fontSize={12} />

      {/* ══ LEFT WING (x 10-155) ════════════════════════════════════
          West corridor nodes at x=180 (top→bottom):
            Stair4      y=235
            Boys WR arm x=80, y=235
            Lift Room   y=315
            Girls WR arm x=80, y=315
            AIS3        y=385
            AIS4        y=465
      */}
      <Room id="sf_staircase4"    x={10} y={130} w={145} h={95}  label="STAIRS 4"    sub="SF" fontSize={9} />
      <Room id="sf_boys_washroom" x={10} y={225} w={90}  h={90}  label="BOYS WR"     fontSize={8} />
      {/* Boys WR arm connector to corridor */}
      <rect x={100} y={225} width={55} height={90} fill={CORRIDOR} />
      <Room id="sf_lift_room"     x={10} y={315} w={145} h={75}  label="LIFT ROOM"   fontSize={9} />
      <Room id="sf_girls_washroom" x={10}y={390} w={90}  h={90}  label="GIRLS WR"    fontSize={8} />
      {/* Girls WR arm */}
      <rect x={100} y={390} width={55} height={90} fill={CORRIDOR} />
      <Room id="sf_ais3"          x={10} y={480} w={145} h={70}  label="AIS3"        fontSize={9} />
      <Room id="sf_ais4"          x={10} y={550} w={145} h={100} label="AIS4"        fontSize={9} />

      {/* ══ RIGHT WING (x 845-990) ══════════════════════════════════
          East corridor nodes at x=820 (top→bottom):
            Lab3 ACS9   y=240
            AIS2        y=325
            AIS1        y=415
            Stair3      y=475
          SE arms: CSE Seminar Hall (910,525), A3 Computer (910,595)
      */}
      <Room id="sf_lab3_acs9"        x={845} y={130} w={145} h={120} label="LAB 3"      sub="ACS9 Compilerzone" fontSize={8} />
      <Room id="sf_ais2"             x={845} y={250} w={145} h={90}  label="AIS2"        fontSize={10} />
      <Room id="sf_ais1"             x={845} y={340} w={145} h={90}  label="AIS1"        fontSize={10} />
      <Room id="sf_staircase3"       x={845} y={430} w={145} h={75}  label="STAIRS 3"    sub="SF" fontSize={9} />
      <Room id="sf_cse_seminar_hall" x={845} y={505} w={145} h={75}  label="CSE"         sub="SEMINAR HALL" fontSize={9} />
      <Room id="sf_a3_computer_center" x={845} y={580} w={145} h={70} label="A3 COMPUTER" sub="CENTER" fontSize={8} />

      {/* ══ BOTTOM SOUTH BLOCK (y 530-640) ══════════════════════════
          Info Sci Dept on south corridor: (390, 505)
          Physics Lab SW arm: (80, 555)
      */}
      <Room id="sf_physics_lab"    x={10}  y={530} w={145} h={110} label="PHYSICS LAB"  fontSize={9} />
      <Room id="sf_info_sci_dept"  x={155} y={530} w={590} h={110} label="INFORMATION SCIENCE DEPARTMENT" fontSize={10} />

      {/* Corridor grid lines */}
      <line x1={180} y1={130} x2={180} y2={530} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={820} y1={130} x2={820} y2={530} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={155} y1={155} x2={820} y2={155} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={155} y1={505} x2={820} y2={505} stroke="#c4d5e8" strokeWidth={0.5} strokeDasharray="4 4" />

      <g transform="translate(500, 25) scale(-1, 1) translate(-500, -25)">
        <text x={500} y={25} textAnchor="middle" fontSize={13}
          fontFamily="Outfit,Inter,sans-serif" fontWeight="700" fill="#475569">
          SECOND FLOOR
        </text>
      </g>

      {/* Route dots */}
      {dotNodes.map((n) => (
        <circle key={n.id} cx={n.x} cy={n.y} r={7}
          fill={HL_STROKE} stroke="#fff" strokeWidth={2} opacity={0.9} />
      ))}
    </svg>
  );
};

export default SecondFloorSVG;
