import { ClsServiceManager } from 'nestjs-cls';
import { LanguageEnum } from '../enum';

export class ContextProvider {
  private static readonly NAMESPACE = 'request';
  private static readonly LANGUAGE_KEY: string = 'language_key';

  private static get<T>(key: string) {
    const store = ClsServiceManager.getClsService();
    if (!store) return undefined;
    return store.get<T>(ContextProvider.getKeyWithNamespace(key));
  }

  private static set(key: string, value: string) {
    const store = ClsServiceManager.getClsService();
    if (!store) return;
    store.set(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.NAMESPACE}.${key}`;
  }

  static setLanguage(language: string): void {
    ContextProvider.set(ContextProvider.LANGUAGE_KEY, language);
  }

  static getLanguage(): LanguageEnum | undefined {
    return ContextProvider.get<LanguageEnum>(ContextProvider.LANGUAGE_KEY);
  }
}
