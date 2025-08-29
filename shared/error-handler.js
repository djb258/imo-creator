/**
 * Simple Error Handler with Retries - Solo Developer Edition
 * Practical error handling without over-engineering
 */

class SimpleErrorHandler {
  static async withRetry(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          throw error;
        }
        
        if (attempt < maxRetries) {
          console.log(`⚠️  Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await this.sleep(delay);
          delay *= 1.5; // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }

  static isNonRetryableError(error) {
    // Don't retry on these errors
    const nonRetryable = [
      'ENOTFOUND',
      'ECONNREFUSED', 
      'EACCES',
      'Authentication',
      'Authorization',
      'Invalid API key'
    ];
    
    return nonRetryable.some(type => 
      error.code === type || 
      error.message.includes(type)
    );
  }

  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static wrapApiCall(apiFunction, options = {}) {
    return async (...args) => {
      const { maxRetries = 3, timeout = 30000 } = options;
      
      return this.withRetry(async () => {
        return Promise.race([
          apiFunction(...args),
          this.timeoutPromise(timeout)
        ]);
      }, maxRetries);
    };
  }

  static timeoutPromise(ms) {
    return new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms)
    );
  }
}

module.exports = SimpleErrorHandler;