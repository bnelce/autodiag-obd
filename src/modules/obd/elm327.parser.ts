/**
 * Normalises raw ELM327 responses:
 *  - removes the prompt '>'
 *  - removes echoed command line (if present)
 *  - collapses CR/LF
 *  - returns hex byte tokens
 */
export function normalizeResponse(command: string, raw: string): {
  cleaned: string;
  bytes: string[];
  isError: boolean;
  errorMessage?: string;
} {
  let s = raw.replace(/>/g, '');
  // split lines, trim, drop empties
  const lines = s
    .split(/\r|\n/)
    .map(l => l.trim())
    .filter(Boolean);

  // remove an echo line equal to command (case-insensitive)
  const cmdUpper = command.trim().toUpperCase();
  const filtered = lines.filter(l => l.toUpperCase() !== cmdUpper);

  const cleaned = filtered.join(' ').trim();
  const upper = cleaned.toUpperCase();

  const errorTokens = [
    'NO DATA',
    'UNABLE TO CONNECT',
    'STOPPED',
    'BUS INIT',
    'BUS BUSY',
    'CAN ERROR',
    'DATA ERROR',
    '?',
  ];
  const isError = errorTokens.some(t => upper.includes(t));

  // hex byte tokens: groups of 2 hex chars, tolerant of spaces
  const noSpaces = cleaned.replace(/\s+/g, '');
  const bytes: string[] = [];
  if (/^[0-9A-Fa-f]+$/.test(noSpaces) && noSpaces.length % 2 === 0) {
    for (let i = 0; i < noSpaces.length; i += 2) {
      bytes.push(noSpaces.slice(i, i + 2).toUpperCase());
    }
  } else {
    // alternatively split by whitespace if it already comes spaced
    const tokens = cleaned.split(/\s+/);
    if (tokens.every(t => /^[0-9A-Fa-f]{2}$/.test(t))) {
      bytes.push(...tokens.map(t => t.toUpperCase()));
    }
  }

  return {cleaned, bytes, isError, errorMessage: isError ? cleaned : undefined};
}
