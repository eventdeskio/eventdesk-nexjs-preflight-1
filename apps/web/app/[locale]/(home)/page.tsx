import { showBetaFeature } from '@repo/feature-flags';
import { getDictionary } from '@repo/internationalization';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { EventDeskCTA } from './components/eventdesk-cta';
import { EventDeskFAQ } from './components/eventdesk-faq';
import { EventDeskFeaturesCarousel } from './components/eventdesk-features-carousel';
import { EventDeskHero } from './components/eventdesk-hero';

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-primary py-2 text-center text-primary-foreground">
          🎉 EventDesk Early Access Now Available
        </div>
      )}
      <section id="hero">
        <EventDeskHero dictionary={dictionary} />
      </section>
      <section id="features">
        <EventDeskFeaturesCarousel dictionary={dictionary} />
      </section>
      <section id="faq">
        <EventDeskFAQ dictionary={dictionary} />
      </section>
      <section id="cta">
        <EventDeskCTA dictionary={dictionary} />
      </section>
    </>
  );
};

export default Home;
