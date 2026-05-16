export const ELM_INIT_SEQUENCE = [
  'ATZ',   // reset
  'ATE0',  // echo off
  'ATL0',  // linefeeds off
  'ATS0',  // spaces off
  'ATH0',  // headers off
  'ATSP0', // auto protocol
  '0100',  // probe supported PIDs (forces protocol detection)
];

export const QUICK_COMMANDS = [
  'ATI',
  'ATRV',
  'ATZ',
  'ATE0',
  'ATL0',
  'ATS0',
  'ATH0',
  'ATSP0',
  '0100',
  '0101',
  '010C',
  '0105',
  '0111',
  '03',
  '04',
] as const;

export const LIVE_PIDS = [
  {pid: 'ATRV', label: 'Tensão do adaptador', unit: 'V'},
  {pid: '010C', label: 'RPM', unit: 'rpm'},
  {pid: '0105', label: 'Temperatura do motor', unit: '°C'},
  {pid: '0111', label: 'Posição da borboleta', unit: '%'},
  {pid: '010D', label: 'Velocidade', unit: 'km/h'},
] as const;
