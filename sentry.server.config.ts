import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Integration with BMAD for performance monitoring
  beforeSend(event, hint) {
    // Add BMAD trace context if available
    if (process.env.BMAD_TRACE_ID) {
      event.tags = {
        ...event.tags,
        bmadTrace: process.env.BMAD_TRACE_ID,
      };
    }
    
    // Don't capture certain errors in development
    if (process.env.NODE_ENV === 'development') {
      if (event.exception) {
        const error = hint.originalException;
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message);
          if (message.includes('ENOENT') || message.includes('MODULE_NOT_FOUND')) {
            return null;
          }
        }
      }
    }
    
    return event;
  },
});