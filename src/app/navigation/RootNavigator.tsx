import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {DashboardScreen} from '../../screens/DashboardScreen';
import {ScannerScreen} from '../../screens/ScannerScreen';
import {ObdTerminalScreen} from '../../screens/ObdTerminalScreen';
import {DiagnosticScreen} from '../../screens/DiagnosticScreen';
import {LiveDataScreen} from '../../screens/LiveDataScreen';
import {ErrorDetailScreen} from '../../screens/ErrorDetailScreen';
import {ChecklistScreen} from '../../screens/ChecklistScreen';
import {colors} from '../../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
    notification: colors.accent,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: colors.bg}}}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="ObdTerminal" component={ObdTerminalScreen} />
        <Stack.Screen name="Diagnostic" component={DiagnosticScreen} />
        <Stack.Screen name="LiveData" component={LiveDataScreen} />
        <Stack.Screen name="ErrorDetail" component={ErrorDetailScreen} />
        <Stack.Screen name="Checklist" component={ChecklistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
