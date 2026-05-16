import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';

type Tone = 'success' | 'danger' | 'warning' | 'muted' | 'accent';

interface Props {
  tone: Tone;
  label: string;
}

const toneMap: Record<Tone, {bg: string; border: string; text: string; dot: string}> = {
  success: {bg: colors.successDim, border: 'rgba(54,217,122,0.3)', text: colors.success, dot: colors.success},
  danger: {bg: colors.dangerDim, border: 'rgba(255,93,93,0.3)', text: colors.danger, dot: colors.danger},
  warning: {bg: colors.warningDim, border: 'rgba(255,181,71,0.28)', text: colors.warning, dot: colors.warning},
  muted: {bg: colors.surface2, border: colors.border, text: colors.text2, dot: colors.text3},
  accent: {bg: colors.accentDim, border: colors.accentLine, text: colors.accent, dot: colors.accent},
};

export function StatusBadge({tone, label}: Props) {
  const t = toneMap[tone];
  return (
    <View style={[styles.badge, {backgroundColor: t.bg, borderColor: t.border}]}>
      <View style={[styles.dot, {backgroundColor: t.dot}]} />
      <Text style={[styles.label, {color: t.text}]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    paddingLeft: 8,
    borderRadius: 100,
    borderWidth: 1,
    gap: 6,
  },
  dot: {width: 6, height: 6, borderRadius: 100},
  label: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
