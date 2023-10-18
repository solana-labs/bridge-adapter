import Debug from "debug";
import type { JsonObject } from "roarr/dist/types";
import type { Logger, ROARR as globalROARR } from "roarr";
import { getLogLevelName, Roarr as log } from "roarr";

const fatal = Debug("fatal");

const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || "";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
  let ROARR: typeof globalROARR;
}

enum LogLevels {
  debug = 20,
  info = 30,
  warn = 40,
  error = 50,
}

abstract class LoggerProvider {
  protected adapter;
  constructor(adapter: {
    debug: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
  }) {
    this.adapter = adapter;
  }
  abstract write(level: number, message: string): void;
}

function isBrowser() {
  let isBrowser = false;
  try {
    if ((process as NodeJS.Process & { browser?: boolean }).browser === true)
      isBrowser = true;
  } catch (e: unknown) {
    fatal(e);
  }
  return isBrowser;
}

if (isBrowser()) {
  const DebugLogger = {
    debug: Debug("debug:logger"),
    info: Debug("info:logger"),
    warn: Debug("warn:logger"),
    error: Debug("error:logger"),
  };

  class DebugLoggerProvider extends LoggerProvider {
    write(level: LogLevels, message: string | NonNullable<unknown>) {
      if (level == LogLevels.debug) return this.adapter.debug(message);
      if (level == LogLevels.info) return this.adapter.info(message);
      if (level == LogLevels.warn) return this.adapter.warn(message);
      if (level == LogLevels.error) return this.adapter.error(message);
    }
  }

  const loggerProvider = new DebugLoggerProvider(DebugLogger);

  globalThis.ROARR.write = (message: string) => {
    // Do not log if the level is absent
    if (LOG_LEVEL.length === 0) return;

    const data = JSON.parse(message) as {
      context: { logLevel: number };
      message: string;
    };

    const numericLogLevel = parseInt(LOG_LEVEL);
    if (isNaN(numericLogLevel)) {
      fatal("Unsupported LOG_LEVEL:", LOG_LEVEL);
      return;
    }

    const expectedLevel = getLogLevelName(numericLogLevel);

    if (expectedLevel && data.context.logLevel >= numericLogLevel) {
      loggerProvider.write(data.context.logLevel, data.message);
    }
  };
}

interface CustomLogger extends Logger<JsonObject> {
  warn(message: string, ...other: unknown[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(...any: any): any;
}

// FIXME: adjust the implementation to satisfy the wagmi logger
export const logger: Pick<CustomLogger, "debug" | "info" | "warn" | "error"> = {
  debug: log.debug,
  error: log.error,
  info: log.info,
  warn(message: string, ...rest: unknown[]) {
    log.warn(rest.length ? JSON.stringify({ message, rest }) : message);
  },
};
