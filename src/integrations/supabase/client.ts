
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gtamdkvdoncawhuwpnwf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0YW1ka3Zkb25jYXdodXdwbndmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODUzNTEsImV4cCI6MjA1ODY2MTM1MX0.FBG8u7z9EAkSLQeDAwpIJUhQ5n919eahumwfr4zNWeM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: { 'x-application-name': 'lifetracker' },
    fetch: (url, options) => {
      const requestOptions = {
        ...options,
        headers: {
          ...options?.headers,
          'Cache-Control': 'no-cache',
        },
      };
      
      // Add retry mechanism for fetch operations
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 500; // ms
      
      return new Promise((resolve, reject) => {
        const attemptFetch = (retriesLeft) => {
          fetch(url, requestOptions)
            .then(resolve)
            .catch((error) => {
              if (retriesLeft > 0) {
                console.log(`Retrying fetch, ${retriesLeft} retries left`);
                setTimeout(() => attemptFetch(retriesLeft - 1), RETRY_DELAY);
              } else {
                reject(error);
              }
            });
        };
        
        attemptFetch(MAX_RETRIES);
      });
    }
  }
});
