export interface ITranslateParams {
  key: string;
  isTranslate?: boolean;
}

export interface IArgumentParams {
  [key: string]: {
    params?: Record<string, ITranslateParams>;
  } & ITranslateParams;
}

export interface IException {
  message: string;
  details?: Record<string, string>;
  code?: number;
  // params?: IArgumentParams;
}
