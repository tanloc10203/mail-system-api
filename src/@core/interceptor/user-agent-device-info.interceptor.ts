import { IUserAgentDevice } from '@/utils/types';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class UserAgentDeviceInfoInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserAgentDeviceInfoInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'];
    const ip = request.ip;

    // Parse user agent and device information
    const deviceInfo = this.parseUserAgent(userAgent);
    // Set device information in the request object
    request.deviceInfo = {
      ...deviceInfo,
      ip,
    };

    // Log device information
    this.logger.debug(`Device information: `, deviceInfo);

    return next.handle();
  }

  private parseUserAgent(userAgent: string): IUserAgentDevice {
    // Parse user agent string and extract device information
    // Example: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
    // Device information: Windows, Chrome, 91.0.4472.124

    const parser = new UAParser(userAgent);
    const browserInfo = parser.getResult();

    const deviceInfo = {
      browser: browserInfo.browser.name || 'Unknown',
      browserVersion: browserInfo.browser.version || 'Unknown',
      engine: browserInfo.engine.name || 'Unknown',
      os: browserInfo.os.name || 'Unknown',
      osVersion: browserInfo.os.version || 'Unknown',
      device: browserInfo.device.vendor
        ? `${browserInfo.device.vendor} ${browserInfo.device.model}`
        : 'Unknown',
      deviceType: browserInfo.device.type || 'desktop',
      cpu: browserInfo.cpu.architecture || 'Unknown',
      ip: "",
    };

    return deviceInfo;
  }
}
