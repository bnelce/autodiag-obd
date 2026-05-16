import {DtcCode} from './obd.types';

const SYSTEM_MAP: Record<string, DtcCode['system']> = {
  '0': 'P', '1': 'P', '2': 'P', '3': 'P',
  '4': 'C', '5': 'C', '6': 'C', '7': 'C',
  '8': 'B', '9': 'B', 'A': 'B', 'B': 'B',
  'C': 'U', 'D': 'U', 'E': 'U', 'F': 'U',
};

const FIRST_DIGIT: Record<string, string> = {
  '0': '0', '1': '1', '2': '2', '3': '3',
  '4': '0', '5': '1', '6': '2', '7': '3',
  '8': '0', '9': '1', 'A': '2', 'B': '3',
  'C': '0', 'D': '1', 'E': '2', 'F': '3',
};

function decodeDtc(byteA: string, byteB: string): DtcCode | null {
  if (!/^[0-9A-F]{2}$/.test(byteA) || !/^[0-9A-F]{2}$/.test(byteB)) return null;
  if (byteA === '00' && byteB === '00') return null;
  const n0 = byteA[0];
  const sys = SYSTEM_MAP[n0];
  const d1 = FIRST_DIGIT[n0];
  const d2 = byteA[1];
  const d3 = byteB[0];
  const d4 = byteB[1];
  const code = `${sys}${d1}${d2}${d3}${d4}`;
  return {code, raw: byteA + byteB, system: sys};
}

/**
 * Parses Mode 03 response bytes into DTCs.
 * Tolerates: "43 01 21 35", "4301 2135", "43012135", multi-frame "43 02 21 35 P0420".
 * Strategy: drop leading 0x43 markers and any count byte, then pair remaining bytes.
 */
export function parseDtcsFromBytes(bytes: string[]): DtcCode[] {
  if (bytes.length === 0) return [];

  // Find first 0x43; collect everything after every 0x43 marker (multi-frame echoes)
  const data: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] === '43') {
      // next byte is sometimes a count (number of DTCs). Skip it if it looks like a count
      // (small number and remaining bytes are divisible by 2 around it). We just skip 1 byte.
      let j = i + 1;
      // If response starts with "43 NN" where NN <= count threshold, treat as count.
      if (j < bytes.length) {
        const candidate = parseInt(bytes[j], 16);
        if (!Number.isNaN(candidate) && candidate <= 0x0f) {
          j += 1;
        }
      }
      while (j < bytes.length && bytes[j] !== '43') {
        data.push(bytes[j]);
        j += 1;
      }
      i = j - 1;
    }
  }

  // Fallback: if we never saw a 43 marker, use bytes as-is.
  const payload = data.length > 0 ? data : bytes;

  const codes: DtcCode[] = [];
  for (let i = 0; i + 1 < payload.length; i += 2) {
    const dtc = decodeDtc(payload[i], payload[i + 1]);
    if (dtc) codes.push(dtc);
  }
  return codes;
}

/** Convenience: takes cleaned text and returns codes. */
export function parseDtcsFromText(cleaned: string): DtcCode[] {
  const noSpaces = cleaned.replace(/\s+/g, '').toUpperCase();
  const bytes: string[] = [];
  for (let i = 0; i + 1 < noSpaces.length; i += 2) {
    bytes.push(noSpaces.slice(i, i + 2));
  }
  return parseDtcsFromBytes(bytes);
}
