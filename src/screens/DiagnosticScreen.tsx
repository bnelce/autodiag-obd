import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppButton} from '../components/AppButton';
import {AppCard} from '../components/AppCard';
import {ScreenHeader} from '../components/ScreenHeader';
import {StatusBadge} from '../components/StatusBadge';
import {TerminalHistoryItem} from '../components/TerminalHistoryItem';
import {DtcCard} from '../components/DtcCard';
import {ClearCodesModal} from './ClearCodesModal';
import {colors} from '../theme/colors';
import {useObdStore} from '../store/obd.store';
import {Elm327Response, DtcCode} from '../modules/obd/obd.types';
import {parseDtcsFromBytes, parseDtcsFromText} from '../modules/obd/dtc.parser';
import {getRule} from '../modules/diagnostics/ford-ecosport.rules';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Diagnostic'>;

export function DiagnosticScreen({navigation}: Props) {
  const status = useObdStore(s => s.status);
  const pending = useObdStore(s => s.pending);
  const initializeElm = useObdStore(s => s.initializeElm);
  const getClient = useObdStore(s => s.getClient);
  const sendCommand = useObdStore(s => s.sendCommand);

  const [initLog, setInitLog] = useState<Elm327Response[]>([]);
  const [readResp, setReadResp] = useState<Elm327Response | null>(null);
  const [dtcs, setDtcs] = useState<DtcCode[]>([]);
  const [clearOpen, setClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const connected = status === 'connected';

  const onInit = async () => {
    const log = await initializeElm();
    setInitLog(log);
  };

  const onRead = async () => {
    const r = await sendCommand('03');
    setReadResp(r);
    const codes = r.bytes.length > 0
      ? parseDtcsFromBytes(r.bytes)
      : parseDtcsFromText(r.cleaned);
    setDtcs(codes);
  };

  const onConfirmClear = async () => {
    setClearing(true);
    try {
      await getClient().clearDTCs();
      setReadResp(null);
      setDtcs([]);
    } finally {
      setClearing(false);
      setClearOpen(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Diagnóstico"
        eyebrow="ELM327"
        onBack={() => navigation.goBack()}
        right={<StatusBadge tone={connected ? 'success' : 'muted'} label={connected ? 'ON' : 'OFF'} />}
      />
      <ScrollView contentContainerStyle={styles.body}>
        {!connected && (
          <Text style={styles.warn}>Scanner desconectado — ações bloqueadas.</Text>
        )}

        <AppCard>
          <Text style={styles.eyebrow}>Passo 1</Text>
          <Text style={styles.title}>Inicializar ELM327</Text>
          <Text style={styles.desc}>Executa: ATZ → ATE0 → ATL0 → ATS0 → ATH0 → ATSP0 → 0100</Text>
          <AppButton
            title={pending ? 'Inicializando…' : 'Inicializar ELM327'}
            variant="primary"
            block
            onPress={onInit}
            disabled={!connected || pending}
            loading={pending}
            style={{marginTop: 10}}
          />
        </AppCard>

        {initLog.length > 0 && (
          <AppCard>
            <Text style={styles.section}>Log de inicialização</Text>
            {initLog.map((r, i) => <TerminalHistoryItem key={i} r={r} />)}
          </AppCard>
        )}

        <AppCard>
          <Text style={styles.eyebrow}>Passo 2</Text>
          <Text style={styles.title}>Ler códigos de falha</Text>
          <Text style={styles.desc}>Comando: 03</Text>
          <AppButton
            title="Ler códigos de falha"
            block
            onPress={onRead}
            disabled={!connected || pending}
            style={{marginTop: 10}}
          />
          {readResp && <View style={{marginTop: 12}}><TerminalHistoryItem r={readResp} /></View>}
        </AppCard>

        {dtcs.length > 0 && (
          <>
            <Text style={styles.section}>Códigos detectados</Text>
            {dtcs.map(d => {
              const rule = getRule(d.code);
              if (rule) return <DtcCard key={d.code} rule={rule} />;
              return (
                <AppCard key={d.code}>
                  <Text style={styles.title}>{d.code}</Text>
                  <Text style={styles.desc}>Sem regra cadastrada.</Text>
                </AppCard>
              );
            })}
          </>
        )}

        <AppButton
          title="Apagar códigos de falha (04)"
          variant="danger"
          block
          disabled={!connected || pending}
          onPress={() => setClearOpen(true)}
          style={{marginTop: 8}}
        />
      </ScrollView>

      <ClearCodesModal
        visible={clearOpen}
        loading={clearing}
        onCancel={() => setClearOpen(false)}
        onConfirm={onConfirmClear}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.bg},
  body: {padding: 16, gap: 12, paddingBottom: 40},
  warn: {color: colors.warning, fontFamily: 'monospace', fontSize: 12},
  eyebrow: {color: colors.text3, fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase'},
  title: {color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 4},
  desc: {color: colors.text2, fontSize: 13, marginTop: 4, fontFamily: 'monospace'},
  section: {color: colors.text3, fontFamily: 'monospace', fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 4, marginBottom: 4},
});
