import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';

interface Props {
  eyebrow?: string;
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function ScreenHeader({eyebrow, title, onBack, right}: Props) {
  return (
    <View style={styles.bar}>
      {onBack && (
        <Pressable style={styles.back} onPress={onBack} android_ripple={{color: '#222'}}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      )}
      <View style={styles.titleBlock}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },
  back: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border, borderWidth: 1,
  },
  backIcon: {color: colors.text, fontSize: 22, lineHeight: 24, fontWeight: '600'},
  titleBlock: {flex: 1, minWidth: 0},
  eyebrow: {
    color: colors.text3, fontFamily: 'monospace',
    fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase',
  },
  title: {color: colors.text, fontSize: 22, fontWeight: '600', marginTop: 2},
});
