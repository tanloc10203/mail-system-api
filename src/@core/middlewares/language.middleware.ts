import { NextFunction, Request, Response } from 'express';
import { LanguageEnum } from '../enum';
import { ContextProvider } from '../providers';

const { APP_HEADER_LANGUAGE, APP_FALLBACK_LANGUAGE } = process.env;

export const languageMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const lang: string = (req.headers[APP_HEADER_LANGUAGE || 'x-custom-lang'] ||
    APP_FALLBACK_LANGUAGE ||
    'vi') as string;

  console.log(`Check language:::`, lang);

  if (LanguageEnum[lang]) {
    ContextProvider.setLanguage(lang);
  }

  next();
};
