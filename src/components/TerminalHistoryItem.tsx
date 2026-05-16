import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {Elm327Response} from '../modules/obd/obd.types';

export function TerminalHistoryItem({r}: {r: Elm327Response}) {
  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.prompt}>{'>'} </Text>
        <Text style={styles.cmd}>{r.command}</Text>
      </View>
      {r.error ? (
        <Text style={styles.err}>ERRO: {r.error}</Text>
      ) : (
        <>
          <Text style={styles.resp} selectable>
            {r.cleaned || '(sem dados)'}
          </Text>
          {r.decoded !== undefined && (
            <Text style={styles.decoded}>
              {typeof r.decoded === 'number' ? r.decoded.toFixed(2) : r.decoded}
              {r.unit ? ` ${r.unit}` : ''}
            </Text>
          )}
          <Text style={styles.raw} selectable>
            raw: {r.rawResponse.replace(/\r/g, '\\r').replace(/\n/g, '\\n') || '∅'}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.bg2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  row: {flexDirection: 'row'},
  prompt: {color: colors.accent, fontFamily: 'monospace', fontSize: 13},
  cmd: {color: colors.text, fontFamily: 'monospace', fontSize: 13, fontWeight: '600'},
  resp: {color: colors.text2, fontFamily: 'monospace', fontSize: 13, marginTop: 4},
  decoded: {color: colors.accent, fontFamily: 'monospace', fontSize: 13, marginTop: 2},
  raw: {color: colors.text3, fontFamily: 'monospace', fontSize: 11, marginTop: 4},
  err: {color: colors.danger, fontFamily: 'monospace', fontSize: 12, marginTop: 4},
});
