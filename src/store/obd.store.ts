import {create} from 'zustand';
import {bluetoothService} from '../modules/bluetooth/bluetooth.service';
import {Elm327Client} from '../modules/obd/elm327.client';
import {Elm327Response} from '../modules/obd/obd.types';
import {ConnectionStatus, BtDevice} from '../modules/bluetooth/bluetooth.types';

const client = new Elm327Client(bluetoothService);

interface ObdState {
  status: ConnectionStatus;
  errorMessage: string | null;
  device: BtDevice | null;
  history: Elm327Response[];
  pending: boolean;

  setStatus: (s: ConnectionStatus, msg?: string) => void;
  setDevice: (d: BtDevice | null) => void;
  connect: (device: BtDevice) => Promise<void>;
  disconnect: () => Promise<void>;
  sendCommand: (cmd: string) => Promise<Elm327Response>;
  initializeElm: () => Promise<Elm327Response[]>;
  clearHistory: () => void;
  getClient: () => Elm327Client;
}

export const useObdStore = create<ObdState>((set, get) => ({
  status: 'disconnected',
  errorMessage: null,
  device: null,
  history: [],
  pending: false,

  setStatus: (s, msg) => set({status: s, errorMessage: msg ?? null}),
  setDevice: d => set({device: d}),

  connect: async device => {
    set({status: 'connecting', errorMessage: null, device});
    try {
      await bluetoothService.connect(device.address);
      set({status: 'connected'});
    } catch (e: any) {
      set({status: 'error', errorMessage: e?.message ?? 'Falha na conexão'});
    }
  },

  disconnect: async () => {
    try {
      await bluetoothService.disconnect();
    } finally {
      set({status: 'disconnected', device: null});
    }
  },

  sendCommand: async cmd => {
    set({pending: true});
    const r = await client.sendCommand(cmd);
    set(state => ({history: [...state.history, r], pending: false}));
    return r;
  },

  initializeElm: async () => {
    set({pending: true});
    const all: Elm327Response[] = [];
    const results = await client.initialize();
    all.push(...results);
    set(state => ({history: [...state.history, ...all], pending: false}));
    return all;
  },

  clearHistory: () => set({history: []}),

  getClient: () => client,
}));
