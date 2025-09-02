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

type DemoScheduleAdminTemplateProps = {
  readonly name: string;
  readonly email: string;
  readonly scheduledDate: string;
  readonly scheduledTime: string;
};

export const DemoScheduleAdminTemplate = ({
  name,
  email,
  scheduledDate,
  scheduledTime,
}: DemoScheduleAdminTemplateProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>New demo request from {name}</Preview>
      <Body className="bg-zinc-50 font-sans">
        <Container className="mx-auto py-12">
          <Section className="mt-8 rounded-md bg-zinc-200 p-px">
            <Section className="rounded-[5px] bg-white p-8">
              <Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
                New Demo Request - EventDesk
              </Text>
              <Text className="m-0 text-zinc-500">
                A new demo has been scheduled with the following details:
              </Text>
              <Hr className="my-4" />
              <Text className="m-0 mb-2 font-semibold text-zinc-950">
                Contact Information:
              </Text>
              <Text className="m-0 mb-1 text-zinc-500">
                <strong>Name:</strong> {name}
              </Text>
              <Text className="m-0 mb-4 text-zinc-500">
                <strong>Email:</strong> {email}
              </Text>
              <Text className="m-0 mb-2 font-semibold text-zinc-950">
                Requested Schedule:
              </Text>
              <Text className="m-0 mb-1 text-zinc-500">
                <strong>Date:</strong> {scheduledDate}
              </Text>
              <Text className="m-0 text-zinc-500">
                <strong>Time:</strong> {scheduledTime}
              </Text>
              <Hr className="my-4" />
              <Text className="m-0 text-sm text-zinc-400">
                Please reach out to schedule the meeting and send a calendar
                invite.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

DemoScheduleAdminTemplate.PreviewProps = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  scheduledDate: 'January 15, 2025',
  scheduledTime: '2:00 PM',
};

export default DemoScheduleAdminTemplate;
