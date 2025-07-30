// Error handling utilities
export interface ErrorInfo {
  message: string;
  stack?: string | undefined;
  timestamp: number;
  url: string;
  userAgent: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: ErrorInfo[] = [];

  private constructor() {
    this.setupGlobalErrorHandling();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Service Worker error handler
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('error', (event) => {
        this.logError({
          message: `Service Worker Error: ${event.type}`,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
      });
    }
  }

  public logError(errorInfo: ErrorInfo): void {
    this.errors.push(errorInfo);
    
    // Console logging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo);
    }

    // Send to analytics or error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorTracking(errorInfo);
    }
  }

  private sendToErrorTracking(errorInfo: ErrorInfo): void {
    // In a real application, you would send this to your error tracking service
    // For now, we'll just log it
    console.error('Production error:', errorInfo);
  }

  public getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public getErrorCount(): number {
    return this.errors.length;
  }
}

// Export a singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility function to wrap async functions with error handling
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.logError({
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
      throw error;
    }
  };
}

// Utility function to check if a resource exists
export async function checkResourceExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Utility function to validate manifest
export async function validateManifest(): Promise<boolean> {
  try {
    const response = await fetch('/manifest.json');
    if (!response.ok) {
      throw new Error(`Manifest not found: ${response.status}`);
    }
    
    const manifest = await response.json();
    const requiredFields = ['name', 'short_name', 'start_url'];
    
    for (const field of requiredFields) {
      if (!manifest[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    return true;
  } catch (error) {
    errorHandler.logError({
      message: `Manifest validation failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
    return false;
  }
}