import { env } from '@/env';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

export const loadRecaptcha = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

export const executeRecaptcha = async (action: string): Promise<string> => {
  await loadRecaptcha();

  return new Promise((resolve) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action })
        .then(resolve);
    });
  });
};

export const verifyRecaptcha = async (
  token: string
): Promise<{
  success: boolean;
  score?: number;
  error?: string;
}> => {
  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: env.RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      }
    );

    const data = await response.json();

    return {
      success: data.success,
      score: data.score,
      error: data['error-codes']?.[0],
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to verify reCAPTCHA',
    };
  }
};
