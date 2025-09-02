'use server';

import { env } from '@/env';
import { database } from '@repo/database';
import {
  DemoScheduleAdminTemplate,
  DemoScheduleConfirmationTemplate,
  resend,
} from '@repo/email';
import { parseError } from '@repo/observability/error';
import { createRateLimiter, slidingWindow } from '@repo/rate-limit';
import { headers } from 'next/headers';
import { z } from 'zod';

const demoScheduleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  scheduledDate: z.string().min(1, 'Please select a date'),
  scheduledTime: z.string().min(1, 'Please select a time'),
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

export const submitDemoSchedule = async (formData: {
  name: string;
  email: string;
  scheduledDate: string;
  scheduledTime: string;
  recaptchaToken: string;
}): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Validate input data
    const validatedData = demoScheduleSchema.parse(formData);

    // Rate limiting
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      const rateLimiter = createRateLimiter({
        limiter: slidingWindow(5, '1h'), // 5 demo requests per hour
      });
      const head = await headers();
      const ip = head.get('x-forwarded-for') || 'unknown';

      const { success } = await rateLimiter.limit(`demo_schedule_${ip}`);

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

    // Validate date is in the future (tomorrow or later)
    const selectedDate = new Date(validatedData.scheduledDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      throw new Error('Please select a date from tomorrow onwards.');
    }

    // Save to database
    const demoScheduleRequest = await database.demoScheduleRequest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        scheduledDate: validatedData.scheduledDate,
        scheduledTime: validatedData.scheduledTime,
      },
    });

    // Send emails (if configured)
    if (env.RESEND_FROM && env.RESEND_TOKEN) {
      try {
        // Send admin notification email
        await resend.emails.send({
          from: env.RESEND_FROM,
          to: 'raja@eventdesk.io',
          subject: 'New EventDesk Demo Request',
          react: DemoScheduleAdminTemplate({
            name: validatedData.name,
            email: validatedData.email,
            scheduledDate: validatedData.scheduledDate,
            scheduledTime: validatedData.scheduledTime,
          }),
        });

        // Send confirmation email to subscriber
        await resend.emails.send({
          from: env.RESEND_FROM,
          to: validatedData.email,
          subject: 'Demo Request Confirmed - EventDesk',
          react: DemoScheduleConfirmationTemplate({
            name: validatedData.name,
            scheduledDate: validatedData.scheduledDate,
            scheduledTime: validatedData.scheduledTime,
          }),
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
