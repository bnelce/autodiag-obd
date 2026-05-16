import {BluetoothService} from '../bluetooth/bluetooth.service';
import {ELM_INIT_SEQUENCE} from './elm327.commands';
import {normalizeResponse} from './elm327.parser';
import {decodePid} from './pid.parser';
import {Elm327Response} from './obd.types';

export class Elm327Client {
  constructor(private bt: BluetoothService) {}

  async sendCommand(command: string, timeoutMs = 4000): Promise<Elm327Response> {
    const trimmed = command.trim();
    const t0 = Date.now();
    try {
      const raw = await this.bt.send(trimmed, {timeoutMs});
      const {cleaned, bytes, isError, errorMessage} = normalizeResponse(trimmed, raw);
      const decoded = !isError ? decodePid(trimmed, cleaned, bytes) : null;
      return {
        command: trimmed,
        rawResponse: raw,
        cleaned,
        bytes,
        decoded: decoded?.value,
        unit: decoded?.unit,
        error: errorMessage,
        timestampMs: t0,
      };
    } catch (e: any) {
      return {
        command: trimmed,
        rawResponse: '',
        cleaned: '',
        bytes: [],
        error: e?.message ?? String(e),
        timestampMs: t0,
      };
    }
  }

  async initialize(): Promise<Elm327Response[]> {
    const out: Elm327Response[] = [];
    for (const cmd of ELM_INIT_SEQUENCE) {
      // ATZ takes longer (full reset)
      const timeout = cmd === 'ATZ' ? 6000 : 4000;
      const r = await this.sendCommand(cmd, timeout);
      out.push(r);
      // small breath between init steps
      await new Promise(res => setTimeout(res, 120));
    }
    return out;
  }

  readVoltage() {
    return this.sendCommand('ATRV');
  }
  readSupportedPids() {
    return this.sendCommand('0100');
  }
  readDTCs() {
    return this.sendCommand('03');
  }
  clearDTCs() {
    return this.sendCommand('04');
  }
  readPid(pid: string) {
    return this.sendCommand(pid);
  }
}
