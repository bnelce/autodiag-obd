export type Severity = 'low' | 'medium' | 'high';

export interface DiagnosticRule {
  code: string;
  description: string;
  severity: Severity;
  symptom: string;
  commonCauses: string[];
  checklist: string[];
}
