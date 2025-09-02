'use server';

import { env } from '@/env';
import { database } from '@repo/database';
import { sendEarlyAccessEmails } from '@repo/email';
import { parseError } from '@repo/observability/error';
import { createRateLimiter, slidingWindow } from '@repo/rate-limit';
import { headers } from 'next/headers';
import { z } from 'zod';

const earlyAccessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  companyType: z.enum(['freelancer', 'sme', 'corporate', 'agency', 'other'], {
    errorMap: () => ({ message: 'Please select a company type' }),
  }),
  eventPlanningProblem: z
    .string()
    .min(10, 'Please describe your problem in at least 10 characters'),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification required'),
});

const verifyRecaptcha = async (
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

export const submitEarlyAccess = async (formData: {
  name: string;
  email: string;
  company: string;
  companyType: string;
  eventPlanningProblem: string;
  recaptchaToken: string;
}): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Validate input data
    const validatedData = earlyAccessSchema.parse(formData);

    // Rate limiting
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      const rateLimiter = createRateLimiter({
        limiter: slidingWindow(3, '1h'), // 3 requests per hour
      });
      const head = await headers();
      const ip = head.get('x-forwarded-for') || 'unknown';

      const { success } = await rateLimiter.limit(`early_access_${ip}`);

      if (!success) {
        throw new Error(
          'You have reached your request limit. Please try again later.'
        );
      }
    }

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(validatedData.recaptchaToken);

    if (!recaptchaResult.success) {
      throw new Error('reCAPTCHA verification failed. Please try again.');
    }

    // Check reCAPTCHA score (0.5 is a reasonable threshold)
    if (recaptchaResult.score && recaptchaResult.score < 0.5) {
      throw new Error('Security verification failed. Please try again.');
    }

    // Check if email already exists
    const existingRequest = await database.earlyAccessRequest.findUnique({
      where: { email: validatedData.email },
    });

    if (existingRequest) {
      throw new Error(
        'This email has already been registered for early access.'
      );
    }

    // Save to database
    const earlyAccessRequest = await database.earlyAccessRequest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        companyType: validatedData.companyType,
        eventPlanningProblem: validatedData.eventPlanningProblem,
      },
    });

    // Send emails (if configured)
    if (env.RESEND_FROM && env.RESEND_TOKEN) {
      try {
        await sendEarlyAccessEmails({
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company,
          companyType: validatedData.companyType,
          eventPlanningProblem: validatedData.eventPlanningProblem,
          resendFrom: env.RESEND_FROM,
        });
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Failed to send notification emails:', emailError);
      }
    }

    return { success: true };
  } catch (error) {
    const errorMessage = parseError(error);
    return { success: false, error: errorMessage };
  }
};
