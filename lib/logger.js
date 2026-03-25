/**
 * Comprehensive logging utility
 * Provides structured logging with different levels and formats
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LOG_COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[32m', // Green
  WARN: '\x1b[33m', // Yellow
  ERROR: '\x1b[31m', // Red
  RESET: '\x1b[0m',
};

class Logger {
  constructor(name = 'App', minLevel = LOG_LEVELS.INFO) {
    this.name = name;
    this.minLevel = minLevel;
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs
  }

  /**
   * Format log message with colors (for console)
   */
  formatConsoleMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const color = LOG_COLORS[level] || '';
    const reset = LOG_COLORS.RESET;
    
    return `${color}[${timestamp}] [${this.name}] [${level}]${reset} ${message}`;
  }

  /**
   * Store log in memory
   */
  storeLog(level, message, data) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    });

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Debug level logging
   */
  debug(message, data) {
    if (LOG_LEVELS.DEBUG >= this.minLevel) {
      console.log(
        this.formatConsoleMessage('DEBUG', message),
        data || ''
      );
      this.storeLog('DEBUG', message, data);
    }
  }

  /**
   * Info level logging
   */
  info(message, data) {
    if (LOG_LEVELS.INFO >= this.minLevel) {
      console.log(
        this.formatConsoleMessage('INFO', message),
        data || ''
      );
      this.storeLog('INFO', message, data);
    }
  }

  /**
   * Warn level logging
   */
  warn(message, data) {
    if (LOG_LEVELS.WARN >= this.minLevel) {
      console.warn(
        this.formatConsoleMessage('WARN', message),
        data || ''
      );
      this.storeLog('WARN', message, data);
    }
  }

  /**
   * Error level logging
   */
  error(message, error) {
    if (LOG_LEVELS.ERROR >= this.minLevel) {
      const errorData = error instanceof Error 
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error;

      console.error(
        this.formatConsoleMessage('ERROR', message),
        errorData || ''
      );
      this.storeLog('ERROR', message, errorData);
    }
  }

  /**
   * Log API request
   */
  logApiRequest(method, url, data = null) {
    this.info(`API Request: ${method} ${url}`, data);
  }

  /**
   * Log API response
   */
  logApiResponse(method, url, status, data = null) {
    const logFn = status >= 400 ? this.warn : this.info;
    logFn.call(
      this,
      `API Response: ${method} ${url} (${status})`,
      data
    );
  }

  /**
   * Log API error
   */
  logApiError(method, url, status, error) {
    this.error(
      `API Error: ${method} ${url} (${status})`,
      error
    );
  }

  /**
   * Performance logging
   */
  logPerformance(name, duration, threshold = 0) {
    const logFn = duration > threshold ? this.warn : this.info;
    logFn.call(
      this,
      `Performance: ${name} took ${duration}ms`
    );
  }

  /**
   * Get all logs
   */
  getLogs(level = null) {
    if (!level) return this.logs;
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Set minimum log level
   */
  setMinLevel(level) {
    this.minLevel = LOG_LEVELS[level] || LOG_LEVELS.INFO;
  }
}

// Create default logger instance
const defaultLogger = new Logger('QuizForge', 
  process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO
);

// Create logger factory
export function createLogger(name) {
  return new Logger(name, defaultLogger.minLevel);
}

// Export default logger
export default defaultLogger;

export { Logger, LOG_LEVELS };

/**
 * Middleware/utility for logging API requests and responses
 */
export function createApiLogger() {
  return {
    request: (config) => {
      defaultLogger.logApiRequest(
        config.method?.toUpperCase() || 'GET',
        config.url,
        config.data
      );
      return config;
    },
    response: (response) => {
      defaultLogger.logApiResponse(
        response.config.method?.toUpperCase() || 'GET',
        response.config.url,
        response.status,
        response.data
      );
      return response;
    },
    error: (error) => {
      const config = error.config;
      defaultLogger.logApiError(
        config?.method?.toUpperCase() || 'GET',
        config?.url || 'unknown',
        error.response?.status || 0,
        error
      );
      return Promise.reject(error);
    },
  };
}

/**
 * Performance monitoring utility
 */
export function measurePerformance(name, fn) {
  const start = performance.now();
  try {
    const result = fn();
    
    // Handle promises
    if (result instanceof Promise) {
      return result
        .then((value) => {
          const duration = performance.now() - start;
          defaultLogger.logPerformance(name, duration);
          return value;
        })
        .catch((error) => {
          const duration = performance.now() - start;
          defaultLogger.error(`Performance Error: ${name} failed after ${duration}ms`, error);
          throw error;
        });
    }

    const duration = performance.now() - start;
    defaultLogger.logPerformance(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    defaultLogger.error(`Performance Error: ${name} failed after ${duration}ms`, error);
    throw error;
  }
}
