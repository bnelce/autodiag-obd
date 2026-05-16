import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {colors} from '../theme/colors';

interface Props {
  index: number;
  label: string;
  checked: boolean;
  note: string;
  onToggle: () => void;
  onChangeNote: (s: string) => void;
}

export function ChecklistItem({index, label, checked, note, onToggle, onChangeNote}: Props) {
  return (
    <View style={styles.box}>
      <Pressable style={styles.row} onPress={onToggle}>
        <View style={[styles.check, checked && styles.checkOn]}>
          {checked && <Text style={styles.tick}>✓</Text>}
        </View>
        <Text style={styles.idx}>{index.toString().padStart(2, '0')}</Text>
        <Text style={[styles.label, checked && styles.labelDone]}>{label}</Text>
      </Pressable>
      <TextInput
        value={note}
        onChangeText={onChangeNote}
        placeholder="Observação..."
        placeholderTextColor={colors.text3}
        style={styles.input}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  row: {flexDirection: 'row', alignItems: 'center', gap: 10},
  check: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bg2,
  },
  checkOn: {backgroundColor: colors.accent, borderColor: colors.accent},
  tick: {color: colors.onAccent, fontWeight: '800', fontSize: 14},
  idx: {color: colors.text3, fontFamily: 'monospace', fontSize: 12},
  label: {color: colors.text, fontSize: 14, flex: 1},
  labelDone: {color: colors.text2, textDecorationLine: 'line-through'},
  input: {
    marginTop: 8,
    backgroundColor: colors.bg2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.text,
    fontFamily: 'monospace',
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 40,
  },
});
