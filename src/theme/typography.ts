import {Platform, TextStyle} from 'react-native';

const mono = Platform.select({android: 'monospace', ios: 'Menlo', default: 'monospace'});
const sans = Platform.select({android: 'sans-serif', ios: 'System', default: 'System'});

export const typography = {
  mono: {fontFamily: mono} as TextStyle,
  sans: {fontFamily: sans} as TextStyle,
  h1: {fontFamily: sans, fontSize: 22, fontWeight: '600'} as TextStyle,
  h2: {fontFamily: sans, fontSize: 18, fontWeight: '600'} as TextStyle,
  h3: {fontFamily: sans, fontSize: 15, fontWeight: '600'} as TextStyle,
  body: {fontFamily: sans, fontSize: 14, fontWeight: '400'} as TextStyle,
  small: {fontFamily: sans, fontSize: 12, fontWeight: '400'} as TextStyle,
  eyebrow: {
    fontFamily: mono,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  } as TextStyle,
  monoSm: {fontFamily: mono, fontSize: 12} as TextStyle,
  monoMd: {fontFamily: mono, fontSize: 14} as TextStyle,
  metric: {fontFamily: mono, fontSize: 28, fontWeight: '600'} as TextStyle,
};
