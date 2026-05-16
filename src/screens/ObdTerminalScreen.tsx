import React, {useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {AppButton} from '../components/AppButton';
import {ScreenHeader} from '../components/ScreenHeader';
import {StatusBadge} from '../components/StatusBadge';
import {TerminalHistoryItem} from '../components/TerminalHistoryItem';
import {colors} from '../theme/colors';
import {QUICK_COMMANDS} from '../modules/obd/elm327.commands';
import {useObdStore} from '../store/obd.store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ObdTerminal'>;

export function ObdTerminalScreen({navigation}: Props) {
  const status = useObdStore(s => s.status);
  const history = useObdStore(s => s.history);
  const pending = useObdStore(s => s.pending);
  const sendCommand = useObdStore(s => s.sendCommand);
  const clearHistory = useObdStore(s => s.clearHistory);

  const [cmd, setCmd] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const connected = status === 'connected';

  const submit = async (raw?: string) => {
    const c = (raw ?? cmd).trim();
    if (!c || !connected || pending) return;
    setCmd('');
    await sendCommand(c);
    setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 80);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Terminal OBD"
        eyebrow="DEBUG"
        onBack={() => navigation.goBack()}
        right={<StatusBadge tone={connected ? 'success' : 'muted'} label={connected ? 'ON' : 'OFF'} />}
      />

      {!connected && (
        <Text style={styles.warn}>Scanner desconectado — comandos bloqueados.</Text>
      )}

      <ScrollView ref={scrollRef} style={styles.history} contentContainerStyle={{padding: 12, paddingBottom: 8}}>
        {history.length === 0 ? (
          <Text style={styles.hint}>Histórico vazio. Envie um comando para começar.</Text>
        ) : (
          history.map((h, i) => <TerminalHistoryItem key={i} r={h} />)
        )}
      </ScrollView>

      <View style={styles.quickWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {QUICK_COMMANDS.map(c => (
            <AppButton
              key={c}
              title={c}
              size="sm"
              variant="secondary"
              onPress={() => submit(c)}
              disabled={!connected || pending}
              style={{marginRight: 6}}
            />
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={cmd}
            onChangeText={setCmd}
            placeholder="Digite um comando AT/OBD"
            placeholderTextColor={colors.text3}
            autoCapitalize="characters"
            autoCorrect={false}
            onSubmitEditing={() => submit()}
            returnKeyType="send"
            editable={connected && !pending}
          />
          <AppButton
            title={pending ? '...' : 'Enviar'}
            variant="primary"
            onPress={() => submit()}
            disabled={!connected || pending || !cmd.trim()}
            loading={pending}
          />
        </View>
        <View style={styles.clearWrap}>
          <AppButton title="Limpar terminal" variant="ghost" block onPress={clearHistory} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.bg},
  warn: {color: colors.warning, fontFamily: 'monospace', fontSize: 12, paddingHorizontal: 16, marginBottom: 4},
  history: {flex: 1, backgroundColor: colors.bg2, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border},
  hint: {color: colors.text3, fontSize: 13, marginTop: 12, textAlign: 'center'},
  quickWrap: {paddingVertical: 8, borderBottomWidth: 1, borderColor: colors.border},
  quickRow: {paddingHorizontal: 12},
  inputRow: {flexDirection: 'row', gap: 8, padding: 12, alignItems: 'center'},
  input: {
    flex: 1,
    backgroundColor: colors.bg2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  clearWrap: {paddingHorizontal: 12, paddingBottom: 12},
});
