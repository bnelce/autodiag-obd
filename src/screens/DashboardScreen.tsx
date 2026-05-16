import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppCard} from '../components/AppCard';
import {AppButton} from '../components/AppButton';
import {StatusBadge} from '../components/StatusBadge';
import {DtcCard} from '../components/DtcCard';
import {ScreenHeader} from '../components/ScreenHeader';
import {colors} from '../theme/colors';
import {useObdStore} from '../store/obd.store';
import {useVehicleStore, vehicleLabel} from '../store/vehicle.store';
import {getRule} from '../modules/diagnostics/ford-ecosport.rules';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const STATUS_TONE = {
  disconnected: {tone: 'muted' as const, label: 'Desconectado'},
  connecting: {tone: 'warning' as const, label: 'Conectando'},
  connected: {tone: 'success' as const, label: 'Conectado'},
  error: {tone: 'danger' as const, label: 'Erro'},
};

export function DashboardScreen({navigation}: Props) {
  const status = useObdStore(s => s.status);
  const vehicle = useVehicleStore(s => s.active);
  const rule = getRule('P2135');
  const stat = STATUS_TONE[status];

  const blocked = status !== 'connected';

  return (
    <View style={styles.screen}>
      <ScreenHeader eyebrow="AutoDiag OBD" title="Olá, Abner" />
      <ScrollView contentContainerStyle={styles.body}>
        <AppCard elevated>
          <Text style={styles.eyebrow}>Veículo ativo</Text>
          <Text style={styles.vehicle}>{vehicleLabel(vehicle)}</Text>
          <View style={styles.row}>
            <StatusBadge tone={stat.tone} label={`Scanner: ${stat.label}`} />
          </View>
        </AppCard>

        <Text style={styles.section}>Ações rápidas</Text>
        <View style={styles.grid}>
          <AppButton
            title="Conectar scanner"
            variant="primary"
            block
            onPress={() => navigation.navigate('Scanner')}
          />
          <AppButton
            title="Terminal OBD"
            block
            disabled={blocked}
            onPress={() => navigation.navigate('ObdTerminal')}
          />
          <AppButton
            title="Diagnóstico"
            block
            disabled={blocked}
            onPress={() => navigation.navigate('Diagnostic')}
          />
          <AppButton
            title="Dados ao vivo"
            block
            disabled={blocked}
            onPress={() => navigation.navigate('LiveData')}
          />
        </View>

        {rule && (
          <>
            <Text style={styles.section}>Alerta ativo</Text>
            <DtcCard rule={rule} />
            <AppButton
              title="Ver detalhes do erro"
              variant="ghost"
              block
              onPress={() => navigation.navigate('ErrorDetail', {code: 'P2135'})}
              style={{marginTop: 8}}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.bg},
  body: {padding: 16, gap: 12, paddingBottom: 40},
  eyebrow: {color: colors.text3, fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase'},
  vehicle: {color: colors.text, fontSize: 18, fontWeight: '600', marginTop: 4},
  row: {marginTop: 12, flexDirection: 'row', gap: 8},
  section: {color: colors.text3, fontFamily: 'monospace', fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 8, marginBottom: 2},
  grid: {gap: 10},
});
