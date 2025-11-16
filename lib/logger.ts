
const log = (level: 'INFO' | 'WARN' | 'ERROR', message: string, context?: object) => {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, level, message, ...context }));
};

export const logger = {
  info: (message: string, context?: object) => log('INFO', message, context),
  warn: (message: string, context?: object) => log('WARN', message, context),
  error: (message: string, context?: object) => log('ERROR', message, context),
};
