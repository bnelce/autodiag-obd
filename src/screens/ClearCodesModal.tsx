import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {AppButton} from '../components/AppButton';
import {colors} from '../theme/colors';

interface Props {
  visible: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ClearCodesModal({visible, loading, onCancel, onConfirm}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Apagar códigos de falha</Text>
          <Text style={styles.body}>
            Antes de apagar, salve ou registre a leitura atual. Apagar códigos não
            corrige defeitos ativos no veículo.
          </Text>
          <AppButton title="Cancelar" variant="ghost" block onPress={onCancel} disabled={loading} />
          <AppButton
            title={loading ? 'Enviando…' : 'Enviar comando 04'}
            variant="dangerSolid"
            block
            onPress={onConfirm}
            loading={loading}
            style={{marginTop: 8}}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  sheet: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: colors.borderStrong, alignSelf: 'center', marginBottom: 14,
  },
  title: {color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 10},
  body: {color: colors.text2, fontSize: 14, marginBottom: 18, lineHeight: 20},
});
