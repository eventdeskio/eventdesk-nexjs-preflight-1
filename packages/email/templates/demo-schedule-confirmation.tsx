import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type DemoScheduleConfirmationTemplateProps = {
  readonly name: string;
  readonly scheduledDate: string;
  readonly scheduledTime: string;
};

export const DemoScheduleConfirmationTemplate = ({
  name,
  scheduledDate,
  scheduledTime,
}: DemoScheduleConfirmationTemplateProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Demo request confirmed - EventDesk</Preview>
      <Body className="bg-zinc-50 font-sans">
        <Container className="mx-auto py-12">
          <Section className="mt-8 rounded-md bg-zinc-200 p-px">
            <Section className="rounded-[5px] bg-white p-8">
              <Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
                Demo Request Confirmed - EventDesk
              </Text>
              <Text className="m-0 mb-4 text-zinc-500">Hi {name},</Text>
              <Text className="m-0 mb-4 text-zinc-500">
                Thank you for your interest in EventDesk! Your demo request has
                been filled and you will soon receive a meeting invite from our
                team.
              </Text>
              <Hr className="my-4" />
              <Text className="m-0 mb-2 font-semibold text-zinc-950">
                Requested Schedule:
              </Text>
              <Text className="m-0 mb-1 text-zinc-500">
                <strong>Date:</strong> {scheduledDate}
              </Text>
              <Text className="m-0 mb-4 text-zinc-500">
                <strong>Time:</strong> {scheduledTime}
              </Text>
              <Hr className="my-4" />
              <Text className="m-0 mb-4 text-zinc-500">
                We're excited to show you how EventDesk can simplify your event
                planning process. Our team will reach out shortly to confirm the
                meeting details and send you a calendar invite.
              </Text>
              <Text className="m-0 text-sm text-zinc-400">
                Best regards,
                <br />
                The EventDesk Team
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

DemoScheduleConfirmationTemplate.PreviewProps = {
  name: 'John Doe',
  scheduledDate: 'January 15, 2025',
  scheduledTime: '2:00 PM',
};

export default DemoScheduleConfirmationTemplate;
