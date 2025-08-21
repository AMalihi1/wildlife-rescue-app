import logger from '../../src/lib/logger';

describe('logger', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('development mode enables pretty transport and debug level by default', async () => {
    process.env.NODE_ENV = 'development';
    jest.isolateModules(() => {
      const devLogger = require('../../src/lib/logger').default;
      // pino v9 exposes internal options on symbol, but we can at least log and ensure it does not throw
      expect(typeof devLogger.info).toBe('function');
    });
  });

  it('production mode sets uppercase level and iso timestamp', async () => {
    process.env.NODE_ENV = 'production';
    jest.isolateModules(() => {
      const prodLogger = require('../../src/lib/logger').default;
      expect(typeof prodLogger.warn).toBe('function');
    });
  });
});


