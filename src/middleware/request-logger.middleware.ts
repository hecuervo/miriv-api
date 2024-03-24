import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {

    const now = Date.now();
    res.on('finish', () => {
      const statusCode = res.statusCode;

      const logMessage =
        `METHOD - ${req.method} | URL - ${req.url} | ` +
        (`QUERY - ${JSON.stringify(req.query)} | PARAMS - ${JSON.stringify(req.params)} | BODY - ${JSON.stringify(req.body)} `) +
        `${this.getColorizedStatusCode(res.statusCode)} ${Date.now() - now} ms`;
      this.logger.log(logMessage);

      if (statusCode === 401 || statusCode === 404 || statusCode === 405) {
        this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
      }
    });

    next();
  }

  private getColorizedStatusCode(statusCode: number): string {
    // ANSI escape codes for colorization
    const yellow = '\x1b[33m';
    const reset = '\x1b[0m';

    return `${yellow}${statusCode}${reset}`;
  }
}
