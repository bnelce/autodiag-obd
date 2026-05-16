import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {LiveDataCard} from '../components/LiveDataCard';
import {ScreenHeader} from '../components/ScreenHeader';
import {StatusBadge} from '../components/StatusBadge';
import {colors} from '../theme/colors';
import {LIVE_PIDS} from '../modules/obd/elm327.commands';
import {useObdStore} from '../store/obd.store';
import {Elm327Response} from '../modules/obd/obd.types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LiveData'>;

export function LiveDataScreen({navigation}: Props) {
  const status = useObdStore(s => s.status);
  const sendCommand = useObdStore(s => s.sendCommand);

  const [responses, setResponses] = useState<Record<string, Elm327Response>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const connected = status === 'connected';

  const read = async (pid: string) => {
    setLoading(l => ({...l, [pid]: true}));
    try {
      const r = await sendCommand(pid);
      setResponses(prev => ({...prev, [pid]: r}));
    } finally {
      setLoading(l => ({...l, [pid]: false}));
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Dados ao vivo"
        eyebrow="PIDs"
        onBack={() => navigation.goBack()}
        right={<StatusBadge tone={connected ? 'success' : 'muted'} label={connected ? 'ON' : 'OFF'} />}
      />
      <ScrollView contentContainerStyle={styles.body}>
        {!connected && <Text style={styles.warn}>Scanner desconectado — leitura bloqueada.</Text>}
        {LIVE_PIDS.map(p => {
          const r = responses[p.pid];
          return (
            <LiveDataCard
              key={p.pid}
              label={p.label}
              pid={p.pid}
              unit={p.unit}
              value={r?.decoded ?? (r?.cleaned ? r.cleaned : undefined)}
              rawResponse={r?.rawResponse}
              loading={!!loading[p.pid]}
              onRead={() => connected && read(p.pid)}
            />
          );
        })}
        <Text style={styles.note}>
          MVP: leitura sob demanda. Polling contínuo será implementado em versões futuras.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.bg},
  body: {padding: 16, gap: 10, paddingBottom: 40},
  warn: {color: colors.warning, fontFamily: 'monospace', fontSize: 12},
  note: {color: colors.text3, fontSize: 12, marginTop: 8, fontFamily: 'monospace'},
});
