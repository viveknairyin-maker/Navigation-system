import { NavEdge, NavGraph } from '../types';
import { ALL_ROOMS } from './rooms';

// Build undirected edge pair
const e = (from: string, to: string, w: number, vertical = false): NavEdge[] => [
  { from, to, weight: w, isVertical: vertical },
  { from: to, to: from, weight: w, isVertical: vertical },
];

export const GRAPH_EDGES: NavEdge[] = [

  // ═══════════════  GROUND FLOOR  ═══════════════════════════════
  // North corridor:  NW ↔ Back Entrance ↔ NE
  ...e('gf_j_nw',              'gf_back_entrance',      35),
  ...e('gf_back_entrance',     'gf_j_ne',               35),

  // West corridor:   NW ↔ Stair1 ↔ Girls WR ↔ Back Aud Ent ↔ SW
  ...e('gf_j_nw',              'gf_staircase1',         15),
  ...e('gf_staircase1',        'gf_girls_washroom',     30),
  ...e('gf_girls_washroom',    'gf_back_entrance_aud',  25),
  ...e('gf_back_entrance_aud', 'gf_j_sw',               20),
  // Arm into Auditorium
  ...e('gf_back_entrance_aud', 'gf_auditorium',         15),

  // East corridor:   NE ↔ Principal ↔ Stair2 ↔ ATM ↔ SE
  ...e('gf_j_ne',              'gf_principal_office',   15),
  ...e('gf_principal_office',  'gf_staircase2',         20),
  ...e('gf_staircase2',        'gf_atm',                25),
  ...e('gf_atm',               'gf_j_se',               25),

  // South corridor:  SE ↔ Management Office ↔ SW
  ...e('gf_j_se',              'gf_management_office',  50),
  ...e('gf_management_office', 'gf_j_sw',               40),
  // Arm to Main Entrance (south of SE junction)
  ...e('gf_j_se',              'gf_entrance',           20),


  // ═══════════════  FIRST FLOOR  ════════════════════════════════
  // North arm off NW junction
  ...e('ff_j_nw',              'ff_chemistry_lab',      20),

  // North corridor:  NW ↔ DSD ↔ ESD ↔ Boys WR ↔ StairN ↔ NE
  ...e('ff_j_nw',              'ff_dsd_lab_aec6',       30),
  ...e('ff_dsd_lab_aec6',      'ff_esd_lab_aec7',       25),
  ...e('ff_esd_lab_aec7',      'ff_boys_washroom',      20),
  ...e('ff_boys_washroom',     'ff_staircase_north',    15),
  ...e('ff_staircase_north',   'ff_j_ne',               20),
  // Arms off north corridor
  ...e('ff_boys_washroom',     'ff_lift',               15),
  ...e('ff_j_ne',              'ff_girls_washroom',     15),

  // East corridor:   NE ↔ Lab East ↔ SE
  ...e('ff_j_ne',              'ff_lab_east',           40),
  ...e('ff_lab_east',          'ff_j_se',               25),
  // Project Lab arm off NE junction
  ...e('ff_j_ne',              'ff_project_lab',        15),

  // South corridor:  SE ↔ AEC1 ↔ AEC2 ↔ AEC3 ↔ StairS ↔ XeroxS ↔ SW
  ...e('ff_j_se',              'ff_aec1',               20),
  ...e('ff_aec1',              'ff_aec2',               25),
  ...e('ff_aec2',              'ff_aec3',               25),
  ...e('ff_aec3',              'ff_staircase_south',    20),
  ...e('ff_staircase_south',   'ff_xerox_shop_s',       15),
  ...e('ff_xerox_shop_s',      'ff_j_sw',               20),

  // West corridor:   SW ↔ A2 ↔ Server ↔ HOD ↔ NW
  ...e('ff_j_sw',              'ff_a2_computer_center', 15),
  ...e('ff_a2_computer_center','ff_server_room_a35',    25),
  ...e('ff_server_room_a35',   'ff_hod_ece_a17',        25),
  ...e('ff_hod_ece_a17',       'ff_j_nw',               25),
  // Xerox SW arm off SW junction
  ...e('ff_j_sw',              'ff_xerox_shop_sw',      10),


  // ═══════════════  SECOND FLOOR  ═══════════════════════════════
  // NW arms
  ...e('sf_j_nw',              'sf_english_lab',        15),
  ...e('sf_english_lab',       'sf_ncc_office',         15),

  // North corridor:  NW ↔ Maths Dept ↔ NE
  ...e('sf_j_nw',              'sf_maths_dept',         40),
  ...e('sf_maths_dept',        'sf_j_ne',               50),
  // Library arm off NE
  ...e('sf_j_ne',              'sf_library',            15),

  // East corridor:   NE ↔ Lab3 ↔ AIS2 ↔ AIS1 ↔ Stair3 ↔ SE
  ...e('sf_j_ne',              'sf_lab3_acs9',          25),
  ...e('sf_lab3_acs9',         'sf_ais2',               25),
  ...e('sf_ais2',              'sf_ais1',               25),
  ...e('sf_ais1',              'sf_staircase3',         20),
  ...e('sf_staircase3',        'sf_j_se',               15),
  // SE arms
  ...e('sf_j_se',              'sf_cse_seminar_hall',   15),
  ...e('sf_j_se',              'sf_a3_computer_center', 20),

  // South corridor:  SE ↔ Info Sci ↔ SW
  ...e('sf_j_se',              'sf_info_sci_dept',      60),
  ...e('sf_info_sci_dept',     'sf_j_sw',               40),
  // Physics Lab arm off SW
  ...e('sf_j_sw',              'sf_physics_lab',        15),

  // West corridor:   SW ↔ AIS4 ↔ AIS3 ↔ Lift ↔ Stair4 ↔ NW
  ...e('sf_j_sw',              'sf_ais4',               15),
  ...e('sf_ais4',              'sf_ais3',               25),
  ...e('sf_ais3',              'sf_lift_room',          20),
  ...e('sf_lift_room',         'sf_staircase4',         20),
  ...e('sf_staircase4',        'sf_j_nw',               25),
  // West arms
  ...e('sf_lift_room',         'sf_girls_washroom',     10),
  ...e('sf_staircase4',        'sf_boys_washroom',      10),


  // ═══════════════  VERTICAL CONNECTIONS  ═══════════════════════
  // GF Staircase 1 → FF South Staircase (same physical stair)
  ...e('gf_staircase1',        'ff_staircase_south',    25, true),
  // GF Staircase 2 → FF North Staircase block
  ...e('gf_staircase2',        'ff_staircase_north',    25, true),
  // FF South Staircase → SF Staircase 3 (east side of SF)
  ...e('ff_staircase_south',   'sf_staircase3',         25, true),
  // FF North Staircase → SF Staircase 4 (west side of SF)
  ...e('ff_staircase_north',   'sf_staircase4',         25, true),
  // Lift chain FF → SF → TF
  ...e('ff_lift',              'sf_lift_room',          20, true),
  // SF Staircase 4 → TF North Staircase (stair chain continues up)
  ...e('sf_staircase4',        'tf_staircase_north',    25, true),
  // SF Staircase 3 → TF South Staircase
  ...e('sf_staircase3',        'tf_staircase_south',    25, true),
  // Lift SF → TF
  ...e('sf_lift_room',         'tf_lift_room',          20, true),


  // ═══════════════  THIRD FLOOR CORRIDORS  ══════════════════════
  // NW arm (small Food Tech room)
  ...e('tf_j_nw',              'tf_food_tech_nw',       20),

  // North corridor: NW ↔ Food Tech ↔ Food Tech VI ↔ Lift ↔ Stair ↔ Chakra ↔ NE
  ...e('tf_j_nw',              'tf_food_technology',    15),
  ...e('tf_food_technology',   'tf_food_tech_vi',       30),
  ...e('tf_food_tech_vi',      'tf_lift_room',          20),
  ...e('tf_lift_room',         'tf_staircase_north',    15),
  ...e('tf_staircase_north',   'tf_chakra_robotics',    20),
  ...e('tf_chakra_robotics',   'tf_j_ne',               15),

  // NE arm → ACS1
  ...e('tf_j_ne',              'tf_acs1',               15),

  // West corridor: NW ↔ CSE Staff ↔ Pragma Lab ↔ SW
  ...e('tf_j_nw',              'tf_cse_staff',          20),
  ...e('tf_cse_staff',         'tf_pragma_lab',         45),
  ...e('tf_pragma_lab',        'tf_j_sw',               10),

  // East corridor: NE ↔ ACS2 ↔ ACS3 ↔ ACS4 ↔ ACS5 ↔ SE
  ...e('tf_j_ne',              'tf_acs2',               15),
  ...e('tf_acs2',              'tf_acs3',               20),
  ...e('tf_acs3',              'tf_acs4',               20),
  ...e('tf_acs4',              'tf_acs5',               20),
  ...e('tf_acs5',              'tf_j_se',               10),

  // South corridor: SW ↔ ECE Seminar ↔ Stair South ↔ Food Tech South ↔ SE
  ...e('tf_j_sw',              'tf_ece_seminar_hall',   15),
  ...e('tf_ece_seminar_hall',  'tf_staircase_south',    25),
  ...e('tf_staircase_south',   'tf_food_tech_south',    45),
  ...e('tf_food_tech_south',   'tf_j_se',               35),
];

export const NAVIGATION_GRAPH: NavGraph = {
  nodes: Object.fromEntries(ALL_ROOMS.map((n) => [n.id, n])),
  edges: GRAPH_EDGES,
};
