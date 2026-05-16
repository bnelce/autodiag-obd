import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppButton} from '../components/AppButton';
import {AppCard} from '../components/AppCard';
import {DtcCard} from '../components/DtcCard';
import {ScreenHeader} from '../components/ScreenHeader';
import {colors} from '../theme/colors';
import {getRule} from '../modules/diagnostics/ford-ecosport.rules';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ErrorDetail'>;

export function ErrorDetailScreen({route, navigation}: Props) {
  const code = route.params?.code ?? 'P2135';
  const rule = getRule(code);

  if (!rule) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={code} onBack={() => navigation.goBack()} />
        <Text style={styles.warn}>Regra não encontrada para {code}.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader eyebrow="DTC" title={code} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <DtcCard rule={rule} />

        <AppCard>
          <Text style={styles.h}>Significado</Text>
          <Text style={styles.p}>{rule.description}.</Text>
        </AppCard>

        <AppCard>
          <Text style={styles.h}>Sintomas comuns</Text>
          <Text style={styles.p}>{rule.symptom}.</Text>
        </AppCard>

        <AppCard>
          <Text style={styles.h}>Possíveis causas</Text>
          {rule.commonCauses.map((c, i) => (
            <Text style={styles.li} key={i}>• {c}</Text>
          ))}
        </AppCard>

        <AppCard>
          <Text style={styles.h}>Checklist recomendado</Text>
          {rule.checklist.map((c, i) => (
            <Text style={styles.li} key={i}>{i + 1}. {c}</Text>
          ))}
        </AppCard>

        <AppButton
          title="Abrir checklist"
          variant="primary"
          block
          onPress={() => navigation.navigate('Checklist', {code: rule.code})}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.bg},
  body: {padding: 16, gap: 12, paddingBottom: 40},
  warn: {color: colors.warning, padding: 16},
  h: {color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 6},
  p: {color: colors.text2, fontSize: 14, lineHeight: 20},
  li: {color: colors.text2, fontSize: 14, lineHeight: 22},
});
