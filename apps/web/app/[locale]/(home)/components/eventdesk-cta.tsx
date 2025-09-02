'use client';

import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import type { Dictionary } from '@repo/internationalization';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { EarlyAccessModal } from './early-access-modal';
import { ScheduleDemoModal } from './schedule-demo-modal';

interface EventDeskCTAProps {
  dictionary: Dictionary;
}

export const EventDeskCTA = ({ dictionary }: EventDeskCTAProps) => {
  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] = useState(false);
  const [isScheduleDemoModalOpen, setIsScheduleDemoModalOpen] = useState(false);

  return (
    <section className="w-full bg-gradient-to-br from-background via-muted/20 to-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Header */}
          <div className="space-y-6">
            <Badge
              variant="secondary"
              className="px-4 py-2 font-medium text-sm"
            >
              <Sparkles className="h-4 w-4" />
              Limited Early Access
            </Badge>

            <h2 className="max-w-3xl font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
              {dictionary.web.home.eventdesk.cta.title}
            </h2>

            {/* <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {dictionary.web.home.eventdesk.cta.subtitle}
            </p> */}
          </div>

          {/* Exclusive Early Access Card */}
          <div
            className="w-full max-w-4xl animate-fade-in-up rounded-lg border border-border bg-card p-8"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="space-y-4">
              <h3 className="font-semibold text-xl">
                {dictionary.web.home.eventdesk.cta.exclusiveCard.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {dictionary.web.home.eventdesk.cta.exclusiveCard.description}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex animate-fade-in-up flex-col gap-4 sm:flex-row"
            style={{ animationDelay: '0.3s' }}
          >
            <Button
              size="lg"
              className="min-w-[200px]"
              onClick={() => setIsEarlyAccessModalOpen(true)}
            >
              {dictionary.web.home.eventdesk.hero.cta.primary}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[200px] bg-background hover:bg-muted"
              onClick={() => setIsScheduleDemoModalOpen(true)}
            >
              {dictionary.web.home.eventdesk.hero.cta.secondary}
            </Button>
          </div>

          {/* Disclaimer, Social Proof, and Promise - Grouped with smaller gaps */}
          <div className="space-y-4">
            {/* Disclaimer */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <p className="text-muted-foreground text-sm">
                {dictionary.web.home.eventdesk.cta.disclaimer}
              </p>
            </div>

            {/* Social Proof
            <div 
              className="animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <p className="text-sm text-muted-foreground">
                {dictionary.web.home.eventdesk.cta.socialProof}
              </p>
            </div> */}

            {/* Guarantee */}
            <div
              className="mx-auto max-w-md animate-fade-in-up rounded-lg border border-border/50 bg-muted/30 p-4"
              style={{ animationDelay: '0.6s' }}
            >
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold text-foreground">
                  Early Access Promise:
                </span>{' '}
                Get exclusive access to new features, priority support, and
                special pricing when we launch.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Early Access Modal */}
      <EarlyAccessModal
        isOpen={isEarlyAccessModalOpen}
        onClose={() => setIsEarlyAccessModalOpen(false)}
      />

      {/* Schedule Demo Modal */}
      <ScheduleDemoModal
        isOpen={isScheduleDemoModalOpen}
        onClose={() => setIsScheduleDemoModalOpen(false)}
      />
    </section>
  );
};
