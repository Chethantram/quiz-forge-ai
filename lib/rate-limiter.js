/**
 * Simple in-memory rate limiter
 * In production, use Redis or a dedicated service
 */

const rateLimitStore = new Map();

/**
 * Rate limit by user/identifier
 * @param {string} identifier - User ID, IP, or email
 * @param {{ maxRequests: number, windowMs: number }} config - Rate limit configuration
 * @returns {{ allowed: boolean, remaining: number, resetTime: number, reason?: string }}
 */
export function rateLimit(
  identifier,
  config = { maxRequests: 10, windowMs: 60 * 1000 } // 10 requests per minute
) {
  const key = `rate-limit:${identifier}`;
  const now = Date.now();

  // Get or create rate limit record
  let record = rateLimitStore.get(key);

  if (!record || now - record.startTime > config.windowMs) {
    // Create new window
    record = {
      count: 1,
      startTime: now,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, record);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: record.resetTime,
    };
  }

  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    const resetTime = record.resetTime;
    return {
      allowed: false,
      remaining: 0,
      resetTime,
      reason: `Rate limit exceeded. Try again in ${Math.ceil((resetTime - now) / 1000)} seconds.`,
    };
  }

  // Increment count
  record.count++;

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Rate limit for quiz generation (more restrictive)
 * @param {string} userId - User ID
 * @returns {{ allowed: boolean, remaining: number, resetTime: number, reason?: string }}
 */
export function rateLimitQuizGeneration(userId) {
  // Max 5 quizzes per hour per user
  return rateLimit(`quiz-gen:${userId}`, {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Rate limit for API requests (general)
 * @param {string} identifier - User ID or IP
 * @returns {{ allowed: boolean, remaining: number, resetTime: number, reason?: string }}
 */
export function rateLimitApiRequest(identifier) {
  // Max 100 requests per minute
  return rateLimit(`api:${identifier}`, {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  });
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupExpiredLimits() {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, record] of rateLimitStore.entries()) {
    if (now - record.startTime > 24 * 60 * 60 * 1000) { // Remove after 24 hours
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  return cleaned;
}

// Run cleanup every hour
setInterval(cleanupExpiredLimits, 60 * 60 * 1000);