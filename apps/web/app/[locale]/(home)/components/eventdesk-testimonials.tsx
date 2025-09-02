'use client';

import {
  Avatar,
  AvatarFallback,
} from '@repo/design-system/components/ui/avatar';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Card, CardContent } from '@repo/design-system/components/ui/card';
import { Quote, Star } from 'lucide-react';

const typeColors = {
  Corporate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  Freelancer:
    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  Agency:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  SME: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
};

import type { Dictionary } from '@repo/internationalization';

interface EventDeskTestimonialsProps {
  dictionary: Dictionary;
}

export const EventDeskTestimonials = ({
  dictionary,
}: EventDeskTestimonialsProps) => {
  return (
    <section className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-16">
          {/* Section Header */}
          <div className="space-y-4 text-center">
            <h2 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
              {dictionary.web.home.eventdesk.testimonials.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {dictionary.web.home.eventdesk.testimonials.subtitle}
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dictionary.web.home.eventdesk.testimonials.items.map(
              (testimonial, index) => {
                const initials = testimonial.author
                  .split(' ')
                  .map((n) => n[0])
                  .join('');
                const companyType =
                  index % 4 === 0
                    ? 'Corporate'
                    : index % 4 === 1
                      ? 'Freelancer'
                      : index % 4 === 2
                        ? 'Agency'
                        : 'SME';

                return (
                  <Card
                    key={index}
                    className="group relative overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                  >
                    <CardContent className="space-y-4 p-6">
                      {/* Quote Icon */}
                      <div className="flex items-start justify-between">
                        <Quote className="h-8 w-8 text-primary/20 transition-colors duration-300 group-hover:text-primary/40" />
                        <Badge
                          variant="secondary"
                          className={`text-xs ${typeColors[companyType as keyof typeof typeColors]}`}
                        >
                          {companyType}
                        </Badge>
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <blockquote className="text-muted-foreground leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-center gap-3 border-border/50 border-t pt-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-sm">
                            {testimonial.author}
                          </p>
                          <p className="truncate text-muted-foreground text-xs">
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>

          {/* Stats Section */}
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div className="space-y-2">
              <div className="font-bold text-3xl text-primary">10,000+</div>
              <div className="text-muted-foreground text-sm">
                {dictionary.web.home.eventdesk.testimonials.stats.events}
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-3xl text-primary">2,500+</div>
              <div className="text-muted-foreground text-sm">
                {dictionary.web.home.eventdesk.testimonials.stats.professionals}
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-3xl text-primary">98%</div>
              <div className="text-muted-foreground text-sm">
                {dictionary.web.home.eventdesk.testimonials.stats.satisfaction}
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-3xl text-primary">40%</div>
              <div className="text-muted-foreground text-sm">
                {dictionary.web.home.eventdesk.testimonials.stats.time}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
