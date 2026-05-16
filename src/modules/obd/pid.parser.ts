/**
 * PID decoders. Each takes the data bytes AFTER the response marker
 * (e.g. for 010C, response is "41 0C A B" -> bytes passed = ["A","B"])
 * and returns {value, unit}.
 */

export interface DecodedPid {
  value: number;
  unit: string;
}

export function decodeRpm(bytes: string[]): DecodedPid | null {
  if (bytes.length < 2) return null;
  const a = parseInt(bytes[0], 16);
  const b = parseInt(bytes[1], 16);
  if (isNaN(a) || isNaN(b)) return null;
  return {value: (256 * a + b) / 4, unit: 'rpm'};
}

export function decodeCoolantTemp(bytes: string[]): DecodedPid | null {
  if (bytes.length < 1) return null;
  const a = parseInt(bytes[0], 16);
  if (isNaN(a)) return null;
  return {value: a - 40, unit: '°C'};
}

export function decodeThrottle(bytes: string[]): DecodedPid | null {
  if (bytes.length < 1) return null;
  const a = parseInt(bytes[0], 16);
  if (isNaN(a)) return null;
  return {value: (a * 100) / 255, unit: '%'};
}

export function decodeSpeed(bytes: string[]): DecodedPid | null {
  if (bytes.length < 1) return null;
  const a = parseInt(bytes[0], 16);
  if (isNaN(a)) return null;
  return {value: a, unit: 'km/h'};
}

/** ATRV returns plain text like "12.3V". */
export function decodeVoltageText(cleaned: string): DecodedPid | null {
  const m = cleaned.match(/(\d+(?:\.\d+)?)\s*V?/i);
  if (!m) return null;
  return {value: parseFloat(m[1]), unit: 'V'};
}

/**
 * Strip mode-response marker from PID bytes.
 * For "0101"-style command (mode 01 PID 0C), expect bytes [41,0C,...] -> return remainder.
 */
export function stripPidHeader(command: string, bytes: string[]): string[] {
  const cmd = command.toUpperCase().trim();
  if (cmd.length < 4) return bytes;
  const mode = cmd.slice(0, 2);          // "01"
  const pid = cmd.slice(2, 4);           // "0C"
  const respMode = (parseInt(mode, 16) + 0x40).toString(16).toUpperCase().padStart(2, '0'); // "41"
  // find sequence respMode,pid in bytes
  for (let i = 0; i + 1 < bytes.length; i++) {
    if (bytes[i] === respMode && bytes[i + 1] === pid.toUpperCase()) {
      return bytes.slice(i + 2);
    }
  }
  return bytes;
}

export function decodePid(command: string, cleaned: string, bytes: string[]): DecodedPid | null {
  const cmd = command.toUpperCase().trim();
  if (cmd === 'ATRV') return decodeVoltageText(cleaned);
  const data = stripPidHeader(cmd, bytes);
  switch (cmd) {
    case '010C': return decodeRpm(data);
    case '0105': return decodeCoolantTemp(data);
    case '0111': return decodeThrottle(data);
    case '010D': return decodeSpeed(data);
    default: return null;
  }
}
