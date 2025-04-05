import { IUserAgentDevice } from '@/utils/types';
import { NextFunction, Request, Response } from 'express';
import { UAParser } from 'ua-parser-js';
import { HeaderRequestAttachEnum } from '../enum';

export const deviceInfoMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;

  // Parse user agent and device information
  const deviceInfo = parseUserAgent(userAgent);

  // Set device information in the req object
  req[HeaderRequestAttachEnum.DeviceInfo] = {
    ...deviceInfo,
    ip,
  };

  // Log device information
  console.log('Device information: ', deviceInfo);

  next();
};

const parseUserAgent = (userAgent: string | undefined): IUserAgentDevice => {
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
    ip: '',
  };

  return deviceInfo;
};
