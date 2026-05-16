import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {colors} from '../theme/colors';
import {radii, spacing} from '../theme/spacing';

interface Props extends ViewProps {
  elevated?: boolean;
  tight?: boolean;
}

export function AppCard({elevated, tight, style, children, ...rest}: Props) {
  return (
    <View
      {...rest}
      style={[
        styles.card,
        tight && styles.tight,
        elevated && styles.elevated,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  tight: {padding: spacing.md + 2},
  elevated: {backgroundColor: colors.surface2},
});
