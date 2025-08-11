import { MAX_REQUESTS, STORAGE_WINDOW_MS } from '@/app/config/constants';

// Input Validator

export class InputValidator {
  static validateText(text: string, max_text_length: number): { isValid: boolean; error?: string } {
    if (!text || text.trim().length === 0) {
      return { isValid: false, error: 'Please enter some text to translate' };
    }

    if (text.length > max_text_length) {
      return {
        isValid: false,
        error: `Text too long. Maximum ${max_text_length} characters allowed.`,
      };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
      /javascript:/gi, // JavaScript protocol
      /on\w+\s*=/gi, // Event handlers
      /data:text\/html/gi, // Data URLs
      /vbscript:/gi, // VBScript
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return {
          isValid: false,
          error: 'Potentially malicious content detected',
        };
      }
    }

    // Check for spam patterns
    const spamPatterns = [
      /\b(spam|viagra|casino|poker|bet)\b/gi,
      /(http|https):\/\/[^\s]+/g, // URLs
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email addresses
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(text)) {
        return {
          isValid: false,
          error: 'Content contains prohibited patterns',
        };
      }
    }

    return { isValid: true };
  }
}

// Server Rate Limiter
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class ServerRateLimiter {
  private static store = new Map<string, RateLimitEntry>();

  static checkLimit(ip: string): boolean {
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.store.set(ip, {
        count: 1,
        resetTime: now + STORAGE_WINDOW_MS,
      });
      return true;
    }

    if (entry.count >= MAX_REQUESTS) {
      return false; // Rate limit exceeded
    }

    // Increment count
    entry.count++;
    return true;
  }

  static getRemaining(ip: string): number {
    const entry = this.store.get(ip);
    if (!entry || Date.now() > entry.resetTime) {
      return MAX_REQUESTS;
    }
    return Math.max(0, MAX_REQUESTS - entry.count);
  }

  // Clean up old entries periodically
  static cleanup() {
    const now = Date.now();
    for (const [ip, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(ip);
      }
    }
  }
}

// Clean up every 5 minutes
setInterval(() => ServerRateLimiter.cleanup(), 5 * 60 * 1000);

// Client-side Rate Limiter
export class ClientRateLimiter {
  private static STORAGE_KEY = 'movie_recommendation_requests';

  private static isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private static safeGetItem(key: string): string | null {
    if (!this.isClient()) {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private static safeSetItem(key: string, value: string): void {
    if (!this.isClient()) {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  private static safeRemoveItem(key: string): void {
    if (!this.isClient()) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  static checkLimit(): boolean {
    if (!this.isClient()) {
      return true; // Allow on server-side
    }

    const now = Date.now();
    const requests = JSON.parse(this.safeGetItem(this.STORAGE_KEY) || '[]');

    // Remove old requests outside the window
    const validRequests = requests.filter(
      (timestamp: number) => now - timestamp < STORAGE_WINDOW_MS
    );

    if (validRequests.length >= MAX_REQUESTS) {
      return false; // Rate limit exceeded
    }

    // Add current request
    validRequests.push(now);
    this.safeSetItem(this.STORAGE_KEY, JSON.stringify(validRequests));

    return true;
  }

  static getRemainingRequests(): number {
    if (!this.isClient()) {
      return MAX_REQUESTS; // Return max on server-side
    }

    const now = Date.now();
    const requests = JSON.parse(this.safeGetItem(this.STORAGE_KEY) || '[]');
    const validRequests = requests.filter(
      (timestamp: number) => now - timestamp < STORAGE_WINDOW_MS
    );

    return Math.max(0, MAX_REQUESTS - validRequests.length);
  }

  static getCurrentCount(): number {
    if (!this.isClient()) {
      return 0; // Return 0 on server-side
    }

    const now = Date.now();
    const requests = JSON.parse(this.safeGetItem(this.STORAGE_KEY) || '[]');
    const validRequests = requests.filter(
      (timestamp: number) => now - timestamp < STORAGE_WINDOW_MS
    );

    return validRequests.length;
  }

  static decrementRequests(): void {
    if (!this.isClient()) {
      return; // No-op on server-side
    }

    const now = Date.now();
    const requests = JSON.parse(this.safeGetItem(this.STORAGE_KEY) || '[]');

    // Remove old requests outside the window
    const validRequests = requests.filter(
      (timestamp: number) => now - timestamp < STORAGE_WINDOW_MS
    );

    // Add current request to increment the count (this decrements remaining)
    validRequests.push(now);
    this.safeSetItem(this.STORAGE_KEY, JSON.stringify(validRequests));
  }

  static resetRequests(): void {
    this.safeRemoveItem(this.STORAGE_KEY);
  }
}
