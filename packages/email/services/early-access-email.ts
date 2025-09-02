import { resend } from '../index';
import { EarlyAccessWelcomeTemplate } from '../templates/early-access-welcome';

export const sendEarlyAccessEmails = async (data: {
  name: string;
  email: string;
  company: string;
  companyType: string;
  eventPlanningProblem: string;
  resendFrom: string;
}) => {
  const {
    name,
    email,
    company,
    companyType,
    eventPlanningProblem,
    resendFrom,
  } = data;

  // Send admin notification email
  await resend.emails.send({
    from: resendFrom,
    to: resendFrom,
    subject: 'New EventDesk Early Access Request',
    html: `
      <h2>New Early Access Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Company Type:</strong> ${companyType}</p>
      <p><strong>Problem Description:</strong></p>
      <p>${eventPlanningProblem}</p>
      <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
    `,
  });

  // Send welcome email to subscriber
  await resend.emails.send({
    from: resendFrom,
    to: email,
    subject: 'Welcome to EventDesk Early Access!',
    react: EarlyAccessWelcomeTemplate({
      name,
    }),
  });
};
