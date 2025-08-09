
//Development:
// Pretty, colorized output
// Debug level logging
// Easy to read timestamps

// Production:
// Structured JSON logs
// Info level logging (less verbose)
// ISO timestamps
// Proper log levels as strings

// src/lib/logger.ts
import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Note: In development, dotenv loads local .env file
// In production, environment variables are set by deployment platform

const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  
  // Production: structured JSON logs
  // Development: pretty formatted logs
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss', // Simple time format: 14:30:25
        ignore: 'pid,hostname', // Remove PID and hostname noise
        messageFormat: '{msg}', // Clean message format
        levelFirst: true,  // Show level first
        singleLine: true // Keep it compact
      }
    },
    level: 'info'
  }),

  // Production configuration
  ...(isProduction && {
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      }
    },
    timestamp: pino.stdTimeFunctions.isoTime
  })
  
});

export default logger;