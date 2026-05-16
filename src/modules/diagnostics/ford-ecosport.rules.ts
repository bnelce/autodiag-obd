import {DiagnosticRule} from './diagnostic-rules';

export const FORD_ECOSPORT_RULES: Record<string, DiagnosticRule> = {
  P2135: {
    code: 'P2135',
    description: 'Correlação sensor borboleta/pedal',
    severity: 'high',
    symptom: 'Aceleração limitada / modo segurança (limp mode)',
    commonCauses: [
      'Tensão de bateria fraca ou instável',
      'Aterramento motor/chassi com mau contato',
      'Fusíveis e relés da injeção oxidados ou folgados',
      'Chicote elétrico próximo ao motor de partida danificado',
      'Conector do TBI (corpo de borboleta) com mau contato',
      'Conector do pedal eletrônico com mau contato',
      'Corpo de borboleta (TBI) com defeito',
      'Pedal eletrônico (APP) com defeito',
      'PCM (somente após eliminar causas elétricas)',
    ],
    checklist: [
      'Verificar tensão da bateria',
      'Verificar aterramento motor/chassi',
      'Conferir fusíveis e relés da injeção',
      'Inspecionar chicote próximo ao motor de partida',
      'Verificar conector do TBI',
      'Verificar conector do pedal',
      'Ler sensores APP/TPS em tempo real',
      'Apagar códigos e testar novamente',
    ],
  },
};

export function getRule(code: string): DiagnosticRule | undefined {
  return FORD_ECOSPORT_RULES[code.toUpperCase()];
}
