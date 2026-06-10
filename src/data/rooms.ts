import { NavNode, FloorId } from '../types';

// Corridor geometry (all floors share same viewport 1000×660):
//   North corridor centre y = 155,  band y=130-180
//   South corridor centre y = 505,  band y=480-530
//   West  corridor centre x = 180,  band x=155-205
//   East  corridor centre x = 820,  band x=795-845
//   Quadrangle: x=205-795, y=180-480

export const ALL_ROOMS: NavNode[] = [

  // ═══════════════════════  GROUND FLOOR  ═══════════════════════
  // Pathway junctions (hidden from dropdown)
  { id: 'gf_j_nw', label: 'NW Junction', type: 'junction', floor: 'ground', x: 180, y: 155 },
  { id: 'gf_j_ne', label: 'NE Junction', type: 'junction', floor: 'ground', x: 820, y: 155 },
  { id: 'gf_j_sw', label: 'SW Junction', type: 'junction', floor: 'ground', x: 180, y: 505 },
  { id: 'gf_j_se', label: 'SE Junction', type: 'junction', floor: 'ground', x: 820, y: 505 },

  // ── West corridor (x = 180) ──────────────────────────────────
  { id: 'gf_staircase1',       label: 'Staircase 1 (GF)',           type: 'staircase', floor: 'ground', x: 180, y: 215 },
  { id: 'gf_girls_washroom',   label: 'Girls Washroom (GF)',        type: 'washroom',  floor: 'ground', x: 180, y: 330 },
  { id: 'gf_back_entrance_aud',label: 'Back Entrance (Auditorium)', type: 'entrance',  floor: 'ground', x: 180, y: 425 },
  // Arm off gf_back_entrance_aud going west
  { id: 'gf_auditorium',       label: 'Auditorium',                 type: 'hall',      floor: 'ground', x: 80,  y: 490 },

  // ── North corridor (y = 155) ─────────────────────────────────
  { id: 'gf_back_entrance',    label: 'Back Entrance (College)',    type: 'entrance',  floor: 'ground', x: 520, y: 155 },

  // ── East corridor (x = 820) ──────────────────────────────────
  { id: 'gf_principal_office', label: 'Principal Office',           type: 'office',    floor: 'ground', x: 820, y: 215 },
  { id: 'gf_staircase2',       label: 'Staircase 2 (GF)',           type: 'staircase', floor: 'ground', x: 820, y: 320 },
  { id: 'gf_atm',              label: 'ATM',                        type: 'service',   floor: 'ground', x: 820, y: 415 },

  // ── South corridor (y = 505) ─────────────────────────────────
  { id: 'gf_management_office',label: 'Management Office',          type: 'office',    floor: 'ground', x: 440, y: 505 },

  // Arm off gf_j_se going south
  { id: 'gf_entrance',         label: 'Main Entrance',              type: 'entrance',  floor: 'ground', x: 820, y: 580 },


  // ═══════════════════════  FIRST FLOOR  ════════════════════════
  { id: 'ff_j_nw', label: 'NW Junction', type: 'junction', floor: 'first', x: 180, y: 200 },
  { id: 'ff_j_ne', label: 'NE Junction', type: 'junction', floor: 'first', x: 820, y: 200 },
  { id: 'ff_j_sw', label: 'SW Junction', type: 'junction', floor: 'first', x: 180, y: 530 },
  { id: 'ff_j_se', label: 'SE Junction', type: 'junction', floor: 'first', x: 820, y: 530 },

  // Arm north off ff_j_nw
  { id: 'ff_chemistry_lab',    label: 'Chemistry Lab',                          type: 'lab',       floor: 'first', x: 180, y: 110 },

  // ── North corridor (y = 200) ─────────────────────────────────
  { id: 'ff_dsd_lab_aec6',     label: 'Digital System Design Lab AEC6',         type: 'lab',       floor: 'first', x: 360, y: 200 },
  { id: 'ff_esd_lab_aec7',     label: 'Embedded System Design Lab AEC7',        type: 'lab',       floor: 'first', x: 510, y: 200 },
  { id: 'ff_boys_washroom',    label: 'Boys Washroom (FF)',                      type: 'washroom',  floor: 'first', x: 625, y: 200 },
  { id: 'ff_staircase_north',  label: 'Staircase (FF North)',                   type: 'staircase', floor: 'first', x: 710, y: 200 },
  // Arms off north corridor
  { id: 'ff_lift',             label: 'Lift (FF)',                               type: 'lift',      floor: 'first', x: 625, y: 120 },
  { id: 'ff_girls_washroom',   label: 'Girls Washroom (FF)',                     type: 'washroom',  floor: 'first', x: 820, y: 120 },

  // ── East side ────────────────────────────────────────────────
  // Arms off ff_j_ne
  { id: 'ff_project_lab',      label: 'Project Lab',                            type: 'lab',       floor: 'first', x: 910, y: 260 },
  // On east corridor (x = 820)
  { id: 'ff_lab_east',         label: 'Lab (East)',                             type: 'lab',       floor: 'first', x: 820, y: 390 },

  // ── West corridor (x = 180) ──────────────────────────────────
  { id: 'ff_hod_ece_a17',      label: 'HOD ECE Department A17',                 type: 'office',    floor: 'first', x: 180, y: 270 },
  { id: 'ff_server_room_a35',  label: 'Server Room A35',                        type: 'lab',       floor: 'first', x: 180, y: 375 },
  { id: 'ff_a2_computer_center',label: 'A2 Computer Center',                    type: 'lab',       floor: 'first', x: 180, y: 470 },
  // Arm south off ff_j_sw
  { id: 'ff_xerox_shop_sw',    label: 'Xerox Shop (Main)',                       type: 'service',   floor: 'first', x: 180, y: 578 },

  // ── South corridor (y = 530) ─────────────────────────────────
  { id: 'ff_aec1',             label: 'AEC1 Classroom',                         type: 'room',      floor: 'first', x: 710, y: 530 },
  { id: 'ff_aec2',             label: 'AEC2 Classroom',                         type: 'room',      floor: 'first', x: 570, y: 530 },
  { id: 'ff_aec3',             label: 'AEC3 Classroom',                         type: 'room',      floor: 'first', x: 430, y: 530 },
  { id: 'ff_staircase_south',  label: 'Staircase 1 & 3 (FF)',                   type: 'staircase', floor: 'first', x: 330, y: 530 },
  { id: 'ff_xerox_shop_s',     label: 'Xerox Shop (South)',                     type: 'service',   floor: 'first', x: 260, y: 530 },


  // ═══════════════════════  SECOND FLOOR  ═══════════════════════
  { id: 'sf_j_nw', label: 'NW Junction', type: 'junction', floor: 'second', x: 180, y: 155 },
  { id: 'sf_j_ne', label: 'NE Junction', type: 'junction', floor: 'second', x: 820, y: 155 },
  { id: 'sf_j_sw', label: 'SW Junction', type: 'junction', floor: 'second', x: 180, y: 505 },
  { id: 'sf_j_se', label: 'SE Junction', type: 'junction', floor: 'second', x: 820, y: 505 },

  // ── NW arms ──────────────────────────────────────────────────
  { id: 'sf_english_lab',      label: 'English Lab',                type: 'lab',        floor: 'second', x: 180, y: 100 },
  { id: 'sf_ncc_office',       label: 'NCC Office',                 type: 'office',     floor: 'second', x: 80,  y: 75  },

  // ── North corridor (y = 155) ─────────────────────────────────
  { id: 'sf_maths_dept',       label: 'Maths Department',           type: 'department', floor: 'second', x: 390, y: 155 },

  // NE arm
  { id: 'sf_library',          label: 'Library',                    type: 'room',       floor: 'second', x: 910, y: 90  },

  // ── East corridor (x = 820) ──────────────────────────────────
  { id: 'sf_lab3_acs9',        label: 'Lab 3 ACS9 Compilerzone',    type: 'lab',        floor: 'second', x: 820, y: 240 },
  { id: 'sf_ais2',             label: 'AIS2',                       type: 'lab',        floor: 'second', x: 820, y: 325 },
  { id: 'sf_ais1',             label: 'AIS1',                       type: 'lab',        floor: 'second', x: 820, y: 415 },
  { id: 'sf_staircase3',       label: 'Staircase 3 (SF)',           type: 'staircase',  floor: 'second', x: 820, y: 475 },

  // SE arms
  { id: 'sf_cse_seminar_hall', label: 'CSE Seminar Hall',           type: 'hall',       floor: 'second', x: 910, y: 525 },
  { id: 'sf_a3_computer_center',label: 'A3 Computer Center',        type: 'lab',        floor: 'second', x: 910, y: 595 },

  // ── South corridor (y = 505) ─────────────────────────────────
  { id: 'sf_info_sci_dept',    label: 'Information Science Dept',   type: 'department', floor: 'second', x: 390, y: 505 },

  // SW arm
  { id: 'sf_physics_lab',      label: 'Physics Lab',                type: 'lab',        floor: 'second', x: 80,  y: 555 },

  // ── West corridor (x = 180, SW→NW) ───────────────────────────
  { id: 'sf_ais4',             label: 'AIS4',                       type: 'lab',        floor: 'second', x: 180, y: 465 },
  { id: 'sf_ais3',             label: 'AIS3',                       type: 'lab',        floor: 'second', x: 180, y: 385 },
  { id: 'sf_lift_room',        label: 'Lift Room (SF)',             type: 'lift',       floor: 'second', x: 180, y: 315 },
  { id: 'sf_staircase4',       label: 'Staircase 4 (SF)',           type: 'staircase',  floor: 'second', x: 180, y: 235 },
  // West arms
  { id: 'sf_girls_washroom',   label: 'Girls Washroom (SF)',        type: 'washroom',   floor: 'second', x: 80,  y: 315 },
  { id: 'sf_boys_washroom',    label: 'Boys Washroom (SF)',         type: 'washroom',   floor: 'second', x: 80,  y: 235 },
];

export const SEARCHABLE_ROOMS = ALL_ROOMS.filter((n) => n.type !== 'junction');

export const getRoomById = (id: string) => ALL_ROOMS.find((n) => n.id === id) ?? null;
export const getRoomsByFloor = (floor: FloorId) => ALL_ROOMS.filter((n) => n.floor === floor);
