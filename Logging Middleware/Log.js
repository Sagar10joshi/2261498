// Logging Middleware/logMiddleware.js
import dotenv from 'dotenv';
dotenv.config();

import { Log as sendLog } from './logger.js';

const token = process.env.LOGGING_TOKEN;

export function Log(req, res, next) {
  const stack = 'express';
  const level = 'info';
  const packageName = 'url-shortener';
  const message = `${req.method} ${req.originalUrl} from ${req.ip} at ${new Date().toISOString()}`;

  sendLog(stack, level, packageName, message, token)
    .catch((err) => {
      console.error('Logging failed:', err.message);
    });

  next();
}
