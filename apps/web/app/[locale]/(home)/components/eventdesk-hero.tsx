'use client';

import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import type { Dictionary } from '@repo/internationalization';
import {
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  LayoutDashboard,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { EarlyAccessModal } from './early-access-modal';
import { ScheduleDemoModal } from './schedule-demo-modal';

interface EventDeskHeroProps {
  dictionary: Dictionary;
}

export const EventDeskHero = ({ dictionary }: EventDeskHeroProps) => {
  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] = useState(false);
  const [isScheduleDemoModalOpen, setIsScheduleDemoModalOpen] = useState(false);

  // Defensive check for dictionary structure
  const eventdeskData = dictionary?.web?.home?.eventdesk;
  if (!eventdeskData) {
    console.error('EventDesk dictionary data not found:', dictionary);
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[size:50px_50px] bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="container relative mx-auto px-4 py-20 lg:py-32">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* Early Access Badge */}
          <div className="animate-fade-in">
            <Badge
              variant="secondary"
              className="gap-2 px-4 py-2 font-medium text-sm"
            >
              <Sparkles className="h-4 w-4" />
              {dictionary.web.home.eventdesk.hero.badge}
            </Badge>
          </div>

          {/* Main Headline */}
          <div
            className="animate-fade-in-up space-y-6"
            style={{ animationDelay: '0.1s' }}
          >
            <h1 className="max-w-4xl font-bold text-4xl text-foreground tracking-tight md:text-6xl lg:text-7xl">
              {dictionary.web.home.eventdesk.hero.title}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {' '}
                {dictionary.web.home.eventdesk.hero.titleHighlight}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-center text-lg text-muted-foreground leading-relaxed md:text-xl">
              {dictionary.web.home.eventdesk.hero.description}
            </p>
          </div>

          {/* Feature Icons */}
          <div
            className="grid max-w-4xl animate-fade-in-up grid-cols-2 gap-4 text-muted-foreground md:grid-cols-3 md:gap-6 lg:grid-cols-6"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium text-sm">
                {dictionary.web.home.eventdesk.hero.features.dashboard}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <UserCheck className="h-5 w-5" />
              <span className="font-medium text-sm">
                {dictionary.web.home.eventdesk.hero.features.rsvp}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <DollarSign className="h-5 w-5" />
              <span className="font-medium text-sm">
                {dictionary.web.home.eventdesk.hero.features.budget}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Clock className="h-5 w-5" />
              <span className="font-medium text-sm">
                {dictionary.web.home.eventdesk.hero.features.timeline}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <CreditCard className="h-5 w-5" />
              <span className="font-medium text-sm">
                {dictionary.web.home.eventdesk.hero.features.payments}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Globe className="h-5 w-5" />
              <span className="font-medium text-sm">
                {dictionary.web.home.eventdesk.hero.features.portal}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex animate-fade-in-up flex-col gap-4 sm:flex-row"
            style={{ animationDelay: '0.3s' }}
          >
            <Button
              size="lg"
              // className="gap-2 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              className="min-w-[200px]"
              onClick={() => setIsEarlyAccessModalOpen(true)}
            >
              {dictionary.web.home.eventdesk.hero.cta.primary}
            </Button>
            <Button
              size="lg"
              variant="outline"
              // className="gap-2 px-8 py-6 text-lg font-semibold border-2 hover:bg-muted/50 transition-all duration-300"
              className="min-w-[200px]"
              onClick={() => setIsScheduleDemoModalOpen(true)}
            >
              {dictionary.web.home.eventdesk.hero.cta.secondary}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div
            className="mt-8 animate-fade-in-up text-center"
            style={{ animationDelay: '0.4s' }}
          >
            <p className="mb-4 text-muted-foreground text-sm">
              {dictionary.web.home.eventdesk.hero.trust.text}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {dictionary.web.home.eventdesk.hero.trust.types.map(
                (type, index) => (
                  <div key={type} className="flex items-center gap-8">
                    <div className="font-medium text-xs uppercase tracking-wider">
                      {type}
                    </div>
                    {index <
                      dictionary.web.home.eventdesk.hero.trust.types.length -
                        1 && <div className="h-4 w-px bg-border" />}
                  </div>
                )
              )}
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};
