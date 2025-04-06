import { AllConfig } from '@/configs/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService<AllConfig>) {}

  get isDevelopment(): boolean {
    return (
      this.configService.getOrThrow('app.nodeEnv', {
        infer: true,
      }) === 'development'
    );
  }

  get apiPrefix(): string {
    return this.configService.getOrThrow('app.apiPrefix', { infer: true });
  }

  get port(): number {
    return this.configService.getOrThrow('app.port', { infer: true });
  }

  get appName(): string {
    return this.configService.getOrThrow('app.appName', { infer: true });
  }

  get frontendDomain(): string {
    return this.configService.getOrThrow('app.frontendDomain', { infer: true });
  }

  get backendDomain(): string {
    return this.configService.getOrThrow('app.backendDomain', { infer: true });
  }

  get headerLanguage(): string {
    return this.configService.getOrThrow('app.headerLanguage', { infer: true });
  }

  get fallbackLanguage(): string {
    return this.configService.getOrThrow('app.fallbackLanguage', { infer: true });
  }
}
