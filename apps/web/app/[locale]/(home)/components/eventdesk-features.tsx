'use client';

import { Card, CardContent } from '@repo/design-system/components/ui/card';
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Shield,
  Users,
  Zap,
} from 'lucide-react';

const getFeatureIcons = () => [
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  Clock,
  CheckCircle,
  BarChart3,
  Zap,
  Shield,
];

import type { Dictionary } from '@repo/internationalization';

interface EventDeskFeaturesProps {
  dictionary: Dictionary;
}

export const EventDeskFeatures = ({ dictionary }: EventDeskFeaturesProps) => {
  const featureIcons = getFeatureIcons();

  // Defensive check for dictionary structure
  const eventdeskData = dictionary?.web?.home?.eventdesk?.features;
  if (!eventdeskData) {
    console.error('EventDesk features dictionary data not found:', dictionary);
    return <div>Loading features...</div>;
  }

  const features = eventdeskData.items;

  return (
    <section className="w-full bg-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-16">
          {/* Section Header */}
          <div className="space-y-4 text-center">
            <h2 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
              {dictionary.web.home.eventdesk.features.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {dictionary.web.home.eventdesk.features.subtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = featureIcons[index] || Calendar;
              const isHighlight = index % 3 === 0; // Highlight every 3rd item
              return (
                <Card
                  key={index}
                  className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    isHighlight
                      ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10'
                      : 'hover:border-primary/20'
                  }`}
                >
                  <CardContent className="space-y-4 p-6">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${
                        isHighlight
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      } transition-colors duration-300`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-xl tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>

                  {isHighlight && (
                    <div className="absolute top-4 right-4">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-muted-foreground text-xl">
              Ready to streamline your event management?
            </h3>
            <p className="mx-auto max-w-md text-muted-foreground text-sm">
              Join hundreds of event professionals who have already simplified
              their workflow with EventDesk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
