interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

const LIMIT = 10000;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 jam

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    const resetTime = now + WINDOW_MS;
    store.set(identifier, { count: 1, resetTime });

    return {
      allowed: true,
      remaining: LIMIT - 1,
      resetTime,
    };
  }

  // Check limit
  if (record.count >= LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment
  record.count++;

  return {
    allowed: true,
    remaining: LIMIT - record.count,
    resetTime: record.resetTime,
  };
}

setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) {
        store.delete(key);
      }
    }
  },
  60 * 60 * 1000,
);
