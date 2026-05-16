import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AppButton} from '../components/AppButton';
import {AppCard} from '../components/AppCard';
import {StatusBadge} from '../components/StatusBadge';
import {ScreenHeader} from '../components/ScreenHeader';
import {colors} from '../theme/colors';
import {bluetoothService} from '../modules/bluetooth/bluetooth.service';
import {BtDevice} from '../modules/bluetooth/bluetooth.types';
import {useObdStore} from '../store/obd.store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner'>;

const STATUS_TONE = {
  disconnected: {tone: 'muted' as const, label: 'Desconectado'},
  connecting: {tone: 'warning' as const, label: 'Conectando'},
  connected: {tone: 'success' as const, label: 'Conectado'},
  error: {tone: 'danger' as const, label: 'Erro'},
};

export function ScannerScreen({navigation}: Props) {
  const status = useObdStore(s => s.status);
  const error = useObdStore(s => s.errorMessage);
  const device = useObdStore(s => s.device);
  const connect = useObdStore(s => s.connect);
  const disconnect = useObdStore(s => s.disconnect);

  const [devices, setDevices] = useState<BtDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [permGranted, setPermGranted] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const granted = await bluetoothService.requestPermissions();
      setPermGranted(granted);
      if (!granted) {
        Alert.alert(
          'Permissões necessárias',
          'O app precisa de permissão Bluetooth para listar dispositivos pareados.',
          [
            {text: 'Cancelar', style: 'cancel'},
            {text: 'Abrir configurações', onPress: () => Linking.openSettings()},
          ],
        );
        return;
      }
      const enabled = await bluetoothService.isEnabled();
      if (!enabled) {
        Alert.alert('Bluetooth desligado', 'Ative o Bluetooth do aparelho.');
        return;
      }
      const list = await bluetoothService.listBondedDevices();
      setDevices(list);
    } catch (e: any) {
      Alert.alert('Erro', e?.message ?? 'Falha ao listar dispositivos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const stat = STATUS_TONE[status];

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Scanner Bluetooth"
        eyebrow="ELM327"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.body}>
        <AppCard elevated>
          <View style={styles.statRow}>
            <StatusBadge tone={stat.tone} label={stat.label} />
            {device && (
              <Text style={styles.devText}>{device.name}</Text>
            )}
          </View>
          {error && <Text style={styles.err}>{error}</Text>}
          <View style={styles.actions}>
            {status === 'connected' ? (
              <>
                <AppButton title="Ir ao Terminal" variant="primary" block onPress={() => navigation.navigate('ObdTerminal')} />
                <AppButton title="Desconectar" variant="danger" block onPress={disconnect} style={{marginTop: 8}} />
              </>
            ) : (
              <AppButton title={loading ? 'Atualizando...' : 'Atualizar lista'} block onPress={refresh} loading={loading} />
            )}
          </View>
        </AppCard>

        <Text style={styles.section}>Dispositivos pareados</Text>

        {!permGranted && !loading ? (
          <Text style={styles.hint}>Permissões Bluetooth não concedidas.</Text>
        ) : loading ? (
          <ActivityIndicator color={colors.accent} style={{marginTop: 24}} />
        ) : devices.length === 0 ? (
          <Text style={styles.hint}>
            Nenhum dispositivo pareado encontrado. Pareie o ELM327 nas configurações de Bluetooth do Android primeiro.
          </Text>
        ) : (
          <FlatList
            data={devices}
            keyExtractor={d => d.address}
            renderItem={({item}) => (
              <Pressable
                onPress={() => connect(item)}
                disabled={status === 'connecting'}
                android_ripple={{color: '#222'}}
                style={styles.devItem}>
                <View>
                  <Text style={styles.devName}>{item.name}</Text>
                  <Text style={styles.devAddr}>{item.address}</Text>
                </View>
                <Text style={styles.connect}>
                  {status === 'connecting' && device?.address === item.address ? 'Conectando…' : 'Conectar'}
                </Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.bg},
  body: {flex: 1, paddingHorizontal: 16, paddingBottom: 16, gap: 12},
  statRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  devText: {color: colors.text2, fontFamily: 'monospace', fontSize: 12},
  err: {color: colors.danger, fontSize: 12, marginTop: 8, fontFamily: 'monospace'},
  actions: {marginTop: 12},
  section: {color: colors.text3, fontFamily: 'monospace', fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 4},
  hint: {color: colors.text2, fontSize: 13, marginTop: 8},
  devItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: 14, padding: 14, marginBottom: 8,
  },
  devName: {color: colors.text, fontSize: 15, fontWeight: '600'},
  devAddr: {color: colors.text3, fontFamily: 'monospace', fontSize: 11, marginTop: 2},
  connect: {color: colors.accent, fontWeight: '600'},
});
