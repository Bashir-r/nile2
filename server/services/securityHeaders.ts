import helmet from 'helmet';
import type { Express, NextFunction, Request, Response } from 'express';

export function buildCspDirectives(isDev: boolean): Record<string, string[] | null> {
  return {
    'default-src': ["'self'"],
    'script-src': isDev
      ? [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://maps.googleapis.com',
          'https://maps.gstatic.com',
        ]
      : ["'self'", "'unsafe-inline'", 'https://maps.googleapis.com', 'https://maps.gstatic.com'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'media-src': ["'self'", 'blob:', 'data:'],
    'worker-src': ["'self'", 'blob:'],
    'connect-src': isDev
      ? [
          "'self'",
          'ws:',
          'wss:',
          'https://maps.googleapis.com',
          'https://maps.gstatic.com',
          'https://places.googleapis.com',
          'https://routes.googleapis.com',
          'https://open.er-api.com',
          'https://cdn.jsdelivr.net',
        ]
      : [
          "'self'",
          'https://maps.googleapis.com',
          'https://maps.gstatic.com',
          'https://places.googleapis.com',
          'https://routes.googleapis.com',
          'https://open.er-api.com',
          'https://cdn.jsdelivr.net',
        ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': [
      "'self'",
      'https://aistudio.google.com',
      'https://*.aistudio.google.com',
      'https://*.googleusercontent.com',
      'https://*.run.app',
    ],
    ...(isDev ? { 'upgrade-insecure-requests': null } : {}),
  };
}

export function applySecurityHeaders(app: Express, isDev: boolean): void {
  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: buildCspDirectives(isDev),
      },
      hsts: {
        maxAge: 31_536_000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      // Frame embedding is governed strictly by CSP frame-ancestors so preview iframes work safely.
      frameguard: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=(self)');
    next();
  });
}
