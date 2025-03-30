export interface IException {
  message: string;
  details?: Record<string, string>;
  code?: number;
}
