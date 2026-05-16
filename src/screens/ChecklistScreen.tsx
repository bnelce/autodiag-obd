import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ChecklistItem} from '../components/ChecklistItem';
import {ScreenHeader} from '../components/ScreenHeader';
import {colors} from '../theme/colors';
import {getRule} from '../modules/diagnostics/ford-ecosport.rules';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Checklist'>;

interface ItemState {
  checked: boolean;
  note: string;
}

export function ChecklistScreen({route, navigation}: Props) {
  const code = route.params?.code ?? 'P2135';
  const rule = getRule(code);

  const [items, setItems] = useState<ItemState[]>(
    () => (rule?.checklist ?? []).map(() => ({checked: false, note: ''})),
  );

  if (!rule) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={code} onBack={() => navigation.goBack()} />
        <Text style={styles.warn}>Regra não encontrada para {code}.</Text>
      </View>
    );
  }

  const toggle = (i: number) =>
    setItems(prev => prev.map((it, idx) => idx === i ? {...it, checked: !it.checked} : it));

  const setNote = (i: number, note: string) =>
    setItems(prev => prev.map((it, idx) => idx === i ? {...it, note} : it));

  const doneCount = items.filter(i => i.checked).length;

  return (
    <View style={styles.screen}>
      <ScreenHeader eyebrow={`DTC ${code}`} title="Checklist" onBack={() => navigation.goBack()} />
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, {width: `${(doneCount / items.length) * 100}%`}]} />
      </View>
      <Text style={styles.counter}>{doneCount} / {items.length}</Text>
      <ScrollView contentContainerStyle={styles.body}>
        {rule.checklist.map((label, i) => (
          <ChecklistItem
            key={i}
            index={i + 1}
            label={label}
            checked={items[i].checked}
            note={items[i].note}
            onToggle={() => toggle(i)}
            onChangeNote={n => setNote(i, n)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.bg},
  body: {padding: 16, paddingBottom: 40},
  warn: {color: colors.warning, padding: 16},
  progressBar: {height: 4, backgroundColor: colors.surface2, marginHorizontal: 16, borderRadius: 100, overflow: 'hidden'},
  progressFill: {height: '100%', backgroundColor: colors.accent},
  counter: {color: colors.text3, fontFamily: 'monospace', fontSize: 12, paddingHorizontal: 16, paddingVertical: 8},
});
