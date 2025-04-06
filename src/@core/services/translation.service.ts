import { formatTranslateToObject } from '@/utils/format-translate';
import { Injectable } from '@nestjs/common';
import { I18nService, TranslateOptions } from 'nestjs-i18n';
import { ContextProvider } from '../providers';
import { EnvironmentService } from './environment.service';

@Injectable()
export class TranslationService {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly i18n: I18nService,
  ) {}

  translate(key: string, options?: TranslateOptions): string {
    const lang = ContextProvider.getLanguage() || this.environmentService.fallbackLanguage;

    return this.i18n.translate(key, {
      lang,
      ...options,
    });
  }

  translateError(key: string, lang?: string): string {
    const formatted = formatTranslateToObject(key);
    const argsFormatted = formatted.args || {};

    const args = Object.entries(argsFormatted).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        return { ...acc, [key]: value };
      }

      return {
        ...acc,
        [key]: this.translate(value.key, {
          lang,
        }),
      };
    }, {});

    const translatedKey = this.translate(formatted.key, { args, lang });

    return translatedKey;
  }
}
