import {PermissionsAndroid, Platform} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import {BtDevice, SendOptions} from './bluetooth.types';

const SPP_UUID = '00001101-0000-1000-8000-00805F9B34FB';
const ELM_TERMINATOR = '>';

export class BluetoothService {
  private device: BluetoothDevice | null = null;
  private rxBuffer = '';

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    const apiLevel = Platform.Version as number;

    const perms: string[] = [];
    if (apiLevel >= 31) {
      perms.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      );
    } else {
      perms.push(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    const granted = await PermissionsAndroid.requestMultiple(perms as any);
    return Object.values(granted).every(
      v => v === PermissionsAndroid.RESULTS.GRANTED,
    );
  }

  async isEnabled(): Promise<boolean> {
    try {
      return await RNBluetoothClassic.isBluetoothEnabled();
    } catch {
      return false;
    }
  }

  async listBondedDevices(): Promise<BtDevice[]> {
    const devices = await RNBluetoothClassic.getBondedDevices();
    return devices.map(d => ({
      address: d.address,
      name: d.name ?? d.address,
      bonded: true,
    }));
  }

  async connect(address: string): Promise<void> {
    if (this.device) {
      try {
        await this.disconnect();
      } catch {}
    }
    this.rxBuffer = '';
    const dev = await RNBluetoothClassic.connectToDevice(address, {
      delimiter: '',
      DELIMITER: '',
      // SPP UUID for ELM327 clones
      CONNECTION_TYPE: 'rfcomm',
      SECURE_SOCKET: true,
      UUID: SPP_UUID,
    } as any);
    this.device = dev;
  }

  async disconnect(): Promise<void> {
    if (!this.device) return;
    try {
      await this.device.disconnect();
    } finally {
      this.device = null;
      this.rxBuffer = '';
    }
  }

  isConnected(): boolean {
    return this.device !== null;
  }

  getConnectedAddress(): string | null {
    return this.device?.address ?? null;
  }

  /**
   * Sends a raw command (without terminator). Appends '\r' and reads until '>'.
   * Returns raw response chunk between writes (still includes echo if ATE0 not set).
   */
  async send(command: string, opts: SendOptions = {}): Promise<string> {
    if (!this.device) throw new Error('Bluetooth não conectado');
    const timeoutMs = opts.timeoutMs ?? 4000;
    const pollMs = opts.pollMs ?? 50;

    this.rxBuffer = '';
    await this.device.write(command + '\r');

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const available = await this.device.available();
      if (available > 0) {
        const chunk = await this.device.read();
        if (chunk) this.rxBuffer += chunk.toString();
      }
      if (this.rxBuffer.includes(ELM_TERMINATOR)) {
        return this.rxBuffer;
      }
      await new Promise(r => setTimeout(r, pollMs));
    }
    throw new Error(`Timeout aguardando resposta para "${command}"`);
  }
}

export const bluetoothService = new BluetoothService();
