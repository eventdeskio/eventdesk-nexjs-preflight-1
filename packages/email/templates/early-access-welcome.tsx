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

type EarlyAccessWelcomeTemplateProps = {
  readonly name: string;
};

export const EarlyAccessWelcomeTemplate = ({
  name,
}: EarlyAccessWelcomeTemplateProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>
        Welcome to EventDesk Early Access - You're part of something special!
      </Preview>
      <Body className="bg-zinc-50 font-sans">
        <Container className="mx-auto py-12">
          <Section className="mt-8 rounded-md bg-zinc-200 p-px">
            <Section className="rounded-[5px] bg-white p-8">
              <Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
                Welcome to EventDesk Early Access!
              </Text>
              <Text className="m-0 mb-4 text-zinc-500">Hi {name},</Text>
              <Text className="m-0 mb-4 text-zinc-500">
                Thank you for joining the EventDesk early access program! We're
                thrilled to have {name} as part of our exclusive community of
                forward-thinking event professionals.
              </Text>

              <Text className="m-0 mb-4 font-semibold text-lg text-zinc-950">
                🚀 You're now part of something special!
              </Text>
              <Text className="m-0 mb-4 text-zinc-500">
                As one of our early access members, you'll be among the first to
                experience EventDesk and help shape the future of event
                management.
              </Text>

              <Text className="m-0 mb-2 font-semibold text-zinc-950">
                What happens next:
              </Text>
              <Text className="m-0 mb-1 text-zinc-500">
                <strong>Development Updates:</strong> We'll keep you informed
                about our progress with exclusive behind-the-scenes updates
              </Text>
              <Text className="m-0 mb-1 text-zinc-500">
                <strong>Beta Access:</strong> You'll receive priority access to
                our beta version when it's ready
              </Text>
              <Text className="m-0 mb-1 text-zinc-500">
                <strong>Special Pricing:</strong> Enjoy grandfathered early
                access pricing when we launch
              </Text>
              <Text className="m-0 mb-1 text-zinc-500">
                <strong>Direct Input:</strong> Your feedback will directly
                influence our product development
              </Text>
              <Text className="m-0 mb-4 text-zinc-500">
                <strong>Priority Support:</strong> Get dedicated support from
                our team
              </Text>

              <Hr className="my-4" />

              <Text className="m-0 mb-4 text-zinc-500">
                We're working hard to build something truly exceptional for
                event managers like you. Our goal is to eliminate the chaos of
                juggling multiple tools and give you a unified platform that
                actually understands how events work.
              </Text>

              <Text className="m-0 mb-4 text-zinc-500">
                Keep an eye on your inbox for updates, and don't hesitate to
                reply to this email if you have any questions or suggestions!
              </Text>

              <Text className="m-0 text-zinc-500">
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

EarlyAccessWelcomeTemplate.PreviewProps = {
  name: 'John Doe',
};

export default EarlyAccessWelcomeTemplate;
