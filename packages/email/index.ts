import { Resend } from 'resend';
import { keys } from './keys';

export const resend = new Resend(keys().RESEND_TOKEN);
export { DemoScheduleAdminTemplate } from './templates/demo-schedule-admin';
export { DemoScheduleConfirmationTemplate } from './templates/demo-schedule-confirmation';
export { EarlyAccessWelcomeTemplate } from './templates/early-access-welcome';
export { sendEarlyAccessEmails } from './services/early-access-email';
