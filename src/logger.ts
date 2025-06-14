

const NODE_ENV = process.env.NODE_ENV || "development";
const isDev = NODE_ENV !== "production";

export function logInfo(message: string, ...optional: any[]) {
  if (isDev) {
    console.info(`✅ [${NODE_ENV.toUpperCase()}] ${message}`, ...optional);
  }
}

export function logError(message: string, ...optional: any[]) {
  if (isDev) {
    console.error(`❌ [${NODE_ENV.toUpperCase()} ERROR] ${message}`, ...optional);
  } else {
    console.error(`[PROD ERROR] ${message}`, ...optional);
    // Optional: send to monitoring service like Sentry here
  }
}

export function logProd(message: string) {
  if (!isDev) {
    console.log(`✅ [PROD] ${message}`);
  }
}

