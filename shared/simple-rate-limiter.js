/**
 * Simple Rate Limiter - Solo Developer Edition
 * In-memory rate limiting without Redis complexity
 */

class SimpleRateLimiter {
  constructor() {
    this.requests = new Map();
    
    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  isAllowed(identifier, limit = 100, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get or create request history for this identifier
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const requestHistory = this.requests.get(identifier);
    
    // Remove old requests outside the window
    const recentRequests = requestHistory.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (recentRequests.length >= limit) {
      return {
        allowed: false,
        resetTime: Math.min(...recentRequests) + windowMs,
        remaining: 0
      };
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return {
      allowed: true,
      remaining: limit - recentRequests.length,
      resetTime: now + windowMs
    };
  }

  cleanup() {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    
    for (const [key, requests] of this.requests) {
      const recentRequests = requests.filter(time => now - time < maxAge);
      
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }

  middleware(options = {}) {
    const { limit = 100, windowMs = 15 * 60 * 1000, keyGen } = options;
    
    return (req, res, next) => {
      const identifier = keyGen ? keyGen(req) : req.ip;
      const result = this.isAllowed(identifier, limit, windowMs);
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000)
      });
      
      if (!result.allowed) {
        return res.status(429).json({
          error: 'Too Many Requests',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        });
      }
      
      next();
    };
  }
}

// Singleton instance
const rateLimiter = new SimpleRateLimiter();

module.exports = rateLimiter;