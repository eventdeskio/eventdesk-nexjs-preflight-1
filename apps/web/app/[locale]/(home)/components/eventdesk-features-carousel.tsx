'use client';

import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/design-system/components/ui/carousel';
import type { Dictionary } from '@repo/internationalization';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { EarlyAccessModal } from './early-access-modal';
import { ScheduleDemoModal } from './schedule-demo-modal';

interface EventDeskFeaturesCarouselProps {
  dictionary: Dictionary;
}

export const EventDeskFeaturesCarousel = ({
  dictionary,
}: EventDeskFeaturesCarouselProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] =
    React.useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);

  // Defensive check for dictionary structure
  const carouselData = dictionary?.web?.home?.eventdesk?.features?.carousel;
  if (!carouselData) {
    console.error(
      'EventDesk features carousel dictionary data not found:',
      dictionary
    );
    return <div>Loading features...</div>;
  }

  const { title, subtitle, items, navigation } = carouselData;

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Handle slide indicator clicks
  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section className="w-full bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-16">
          {/* Section Header */}
          <div className="space-y-4 text-center">
            <h2 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <Carousel
              setApi={setApi}
              className="w-full"
              opts={{
                align: 'start',
                loop: true,
                skipSnaps: false,
                dragFree: false,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {items.map((feature, index) => (
                  <CarouselItem
                    key={feature.id}
                    className="basis-full pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
                  >
                    <Card className="group h-full border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-xl">
                      <CardHeader className="pb-4">
                        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-muted/30">
                          <Image
                            src={feature.image}
                            alt={feature.alt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 3}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <CardTitle className="font-semibold text-xl tracking-tight">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Problem Statement */}
                        <div className="space-y-2">
                          <Badge
                            variant="secondary"
                            className="font-medium text-xs"
                          >
                            Problem
                          </Badge>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {feature.problem}
                          </p>
                        </div>

                        {/* Solution */}
                        <div className="space-y-2">
                          <Badge
                            variant="default"
                            className="font-medium text-xs"
                          >
                            Solution
                          </Badge>
                          <p className="font-medium text-sm leading-relaxed">
                            {feature.solution}
                          </p>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                            Key Benefits
                          </h4>
                          <ul className="space-y-2">
                            {feature.benefits.map((benefit, benefitIndex) => (
                              <li
                                key={benefitIndex}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                <span className="leading-relaxed">
                                  {benefit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Buttons */}
              <div className="hidden md:block">
                <CarouselPrevious
                  className="left-4 border-border/50 bg-background/80 backdrop-blur-sm transition-all duration-200 hover:border-border hover:bg-background lg:left-8"
                  aria-label={navigation.previous}
                />
                <CarouselNext
                  className="right-4 border-border/50 bg-background/80 backdrop-blur-sm transition-all duration-200 hover:border-border hover:bg-background lg:right-8"
                  aria-label={navigation.next}
                />
              </div>
            </Carousel>

            {/* Mobile Navigation Buttons */}
            <div className="mt-6 flex justify-center gap-2 md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollPrev()}
                disabled={!api?.canScrollPrev()}
                aria-label={navigation.previous}
                className="h-10 w-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollNext()}
                disabled={!api?.canScrollNext()}
                aria-label={navigation.next}
                className="h-10 w-10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Slide Indicators */}
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: count }, (_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current - 1
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={navigation.slideIndicator.replace(
                    '{number}',
                    (index + 1).toString()
                  )}
                />
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="font-semibold text-2xl">
                Ready to Transform Your Event Planning?
              </h3>
              <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
                Join thousands of event professionals who have streamlined their
                workflow with EventDesk's powerful features.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="min-w-[200px]"
                onClick={() => setIsEarlyAccessModalOpen(true)}
              >
                Get Early Access
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px]"
                onClick={() => setIsDemoModalOpen(true)}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'EventDesk',
            applicationCategory: 'BusinessApplication',
            description: subtitle,
            featureList: items.map((item) => item.title),
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/PreOrder',
              description:
                'Early access to EventDesk event management platform',
            },
            screenshot: items.map((item) => ({
              '@type': 'ImageObject',
              url: item.image,
              description: item.alt,
            })),
          }),
        }}
      />

      {/* Modals */}
      <EarlyAccessModal
        isOpen={isEarlyAccessModalOpen}
        onClose={() => setIsEarlyAccessModalOpen(false)}
      />
      <ScheduleDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </section>
  );
};
