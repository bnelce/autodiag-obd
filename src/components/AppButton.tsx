import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {colors} from '../theme/colors';
import {radii} from '../theme/spacing';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSolid';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function AppButton({
  title,
  onPress,
  variant = 'secondary',
  size = 'md',
  block,
  disabled,
  loading,
  style,
}: Props) {
  const bg = bgFor(variant);
  const fg = fgFor(variant);
  const border = borderFor(variant);
  const sz = sizeMap[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{color: 'rgba(255,255,255,0.08)'}}
      style={({pressed}) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor: border,
          height: sz.height,
          paddingHorizontal: sz.padX,
          borderRadius: sz.radius,
          opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
          width: block ? '100%' : undefined,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.text, {color: fg, fontSize: sz.font}]}>{title}</Text>
      )}
    </Pressable>
  );
}

const sizeMap = {
  sm: {height: 36, padX: 14, radius: radii.md, font: 13},
  md: {height: 48, padX: 18, radius: radii.lg, font: 15},
  lg: {height: 56, padX: 20, radius: 16, font: 16},
};

function bgFor(v: Variant): string {
  switch (v) {
    case 'primary': return colors.accent;
    case 'secondary': return colors.surface2;
    case 'ghost': return 'transparent';
    case 'danger': return colors.dangerDim;
    case 'dangerSolid': return colors.danger;
  }
}
function fgFor(v: Variant): string {
  switch (v) {
    case 'primary': return colors.onAccent;
    case 'secondary': return colors.text;
    case 'ghost': return colors.text2;
    case 'danger': return colors.danger;
    case 'dangerSolid': return '#1a0000';
  }
}
function borderFor(v: Variant): string {
  switch (v) {
    case 'primary': return colors.accent;
    case 'secondary': return colors.borderStrong;
    case 'ghost': return 'transparent';
    case 'danger': return 'rgba(255,93,93,0.35)';
    case 'dangerSolid': return colors.danger;
  }
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {fontWeight: '600'},
});
