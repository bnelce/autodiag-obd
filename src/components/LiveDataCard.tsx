import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppCard} from './AppCard';
import {AppButton} from './AppButton';
import {colors} from '../theme/colors';

interface Props {
  label: string;
  pid: string;
  unit: string;
  value?: string | number;
  rawResponse?: string;
  loading?: boolean;
  onRead: () => void;
}

export function LiveDataCard({label, pid, unit, value, rawResponse, loading, onRead}: Props) {
  return (
    <AppCard tight>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.pid}>{pid}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.value}>
          {value !== undefined && value !== '' ? value : '—'}
          <Text style={styles.unit}>{value !== undefined ? ` ${unit}` : ''}</Text>
        </Text>
        <AppButton title={loading ? '...' : 'Ler'} size="sm" onPress={onRead} loading={loading} />
      </View>
      {rawResponse ? (
        <Text style={styles.raw} numberOfLines={2}>raw: {rawResponse}</Text>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  head: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  label: {color: colors.text2, fontFamily: 'monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8},
  pid: {color: colors.text3, fontFamily: 'monospace', fontSize: 11},
  body: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6},
  value: {color: colors.text, fontFamily: 'monospace', fontSize: 24, fontWeight: '600'},
  unit: {color: colors.text3, fontSize: 12, fontFamily: 'monospace'},
  raw: {color: colors.text3, fontFamily: 'monospace', fontSize: 11, marginTop: 8},
});
