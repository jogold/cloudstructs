/**
 * SSL Server test grade
 */
export enum SslServerTestGrade {
  A_PLUS = 'A+',
  A = 'A',
  A_MINUS = 'A-',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

/**
 * Response from SSL Labs analyze API
 */
export interface AnalyzeResponse {
  status: AnalyzeStatus;
  statusMessage?: string;
  endpoints: {
    grade: string;
  }[];
}

/**
 * Analysis status
 */
export enum AnalyzeStatus {
  DNS = 'DNS',
  ERROR = 'ERROR',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
}
