export interface Elm327Response {
  command: string;
  rawResponse: string;
  /** Cleaned response: echo, '>', '\r', '\n' removed. */
  cleaned: string;
  /** Hex byte tokens, e.g. ["41","0C","1A","F8"]. Empty when not applicable. */
  bytes: string[];
  /** Decoded human-readable value when a parser was applied. */
  decoded?: string | number;
  /** Decoded value's unit. */
  unit?: string;
  error?: string;
  timestampMs: number;
}

export interface DtcCode {
  code: string;        // e.g. P2135
  raw: string;         // raw 4 hex chars
  system: 'P' | 'C' | 'B' | 'U';
}
