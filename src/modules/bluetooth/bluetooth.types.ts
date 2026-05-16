export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface BtDevice {
  address: string;
  name: string;
  bonded?: boolean;
}

export interface SendOptions {
  /** Total timeout for awaiting the ELM327 terminator '>'. Default 4000ms. */
  timeoutMs?: number;
  /** Polling interval in ms. Default 50. */
  pollMs?: number;
}
