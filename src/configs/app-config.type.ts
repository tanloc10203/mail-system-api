export type AppConfig = {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  appName: string;
  backendDomain: string;
  frontendDomain?: string;
  fallbackLanguage: string;
  headerLanguage: string;
  workingDirectory: string;
};
