'use client';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import type { Dictionary } from '@repo/internationalization';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { ScheduleDemoModal } from './schedule-demo-modal';

interface EventDeskFAQProps {
  dictionary: Dictionary;
}

export const EventDeskFAQ = ({ dictionary }: EventDeskFAQProps) => {
  const faqData = dictionary.web.home.eventdesk.faq;
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);

  // Group FAQ items by category
  const faqByCategory = faqData.items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof faqData.items>
  );

  const categories = [
    { key: 'general', label: 'General' },
    { key: 'features', label: 'Features' },
    { key: 'technical', label: 'Technical' },
    { key: 'pricing', label: 'Pricing' },
  ];

  return (
    <section className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12">
          {/* Section Header */}
          <div className="space-y-4 text-center">
            <h2 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
              {faqData.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {faqData.subtitle}
            </p>
          </div>

          {/* FAQ Tabs */}
          <div className="mx-auto w-full max-w-4xl">
            <Tabs defaultValue="general" className="w-full">
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.key}
                    value={category.key}
                    className="text-sm"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent
                  key={category.key}
                  value={category.key}
                  className="space-y-4"
                >
                  {faqByCategory[category.key]?.map((item, index) => (
                    <Collapsible key={item.id || index}>
                      <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg border border-border/20 bg-card/30 px-6 py-4 text-left transition-colors duration-200 hover:bg-card/50">
                        <h3 className="font-semibold text-base text-foreground transition-colors duration-200 group-hover:text-primary md:text-lg">
                          {item.question}
                        </h3>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-6 pt-2 pb-4">
                        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                          {item.answer}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* CTA Section */}
          <div className="space-y-4 border-border/50 border-t pt-8 text-center">
            <p className="font-medium text-foreground text-lg">
              {faqData.cta.title}
            </p>
            <p className="mx-auto max-w-md text-muted-foreground">
              {faqData.cta.subtitle}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={() => setIsDemoModalOpen(true)}>
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* modals*/}
      <ScheduleDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </section>
  );
};
