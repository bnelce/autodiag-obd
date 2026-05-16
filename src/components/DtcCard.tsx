import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppCard} from './AppCard';
import {colors} from '../theme/colors';
import {DiagnosticRule, Severity} from '../modules/diagnostics/diagnostic-rules';

interface Props {
  rule: DiagnosticRule;
}

const sevLabel: Record<Severity, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};
const sevColor: Record<Severity, string> = {
  high: colors.danger,
  medium: colors.warning,
  low: colors.success,
};

export function DtcCard({rule}: Props) {
  return (
    <AppCard elevated>
      <View style={styles.row}>
        <Text style={styles.code}>{rule.code}</Text>
        <View style={styles.sev}>
          <Text style={[styles.sevLabel, {color: sevColor[rule.severity]}]}>
            Gravidade: {sevLabel[rule.severity]}
          </Text>
          <View style={styles.bars}>
            {[0, 1, 2].map(i => (
              <View
                key={i}
                style={[
                  styles.bar,
                  {
                    backgroundColor:
                      (rule.severity === 'high' && i < 3) ||
                      (rule.severity === 'medium' && i < 2) ||
                      (rule.severity === 'low' && i < 1)
                        ? sevColor[rule.severity]
                        : colors.surface3,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.desc}>{rule.description}</Text>
      <Text style={styles.symptom}>Sintoma provável: {rule.symptom}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  code: {
    color: colors.text,
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: '700',
  },
  sev: {alignItems: 'flex-end', gap: 4},
  sevLabel: {fontFamily: 'monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8},
  bars: {flexDirection: 'row', gap: 2},
  bar: {width: 3, height: 10, borderRadius: 1},
  desc: {color: colors.text, fontSize: 14, marginTop: 4},
  symptom: {color: colors.text2, fontSize: 12, marginTop: 8, fontFamily: 'monospace'},
});
