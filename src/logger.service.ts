import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  log(message: any) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  }

  error(message: any, trace?: string) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, trace);
  }

  warn(message: any) {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  }

  debug(message: any) {
    console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
  }

  verbose(message: any) {
    console.log(`[VERBOSE] ${new Date().toISOString()}: ${message}`);
  }
}