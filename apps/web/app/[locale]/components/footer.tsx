import { legal } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Status } from '@repo/observability/status';
import Link from 'next/link';
import { FooterFeaturesButton } from './footer-features-button';

export const Footer = () => (
  <Feed queries={[legal.postsQuery]}>
    {async ([data]) => {
      'use server';

      const navigationItems = [
        {
          title: 'Home',
          href: '/',
          description: '',
        },
        {
          title: 'Product',
          description: 'Powerful tools for event planning professionals.',
          items: [
            {
              title: 'Features',
              href: '#features',
              isInternal: true,
            },
            {
              title: 'Pricing',
              href: null,
              disabled: true,
            },
          ],
        },
        {
          title: 'Company',
          description: 'Learn more about EventDesk.',
          items: [
            {
              title: 'Blog',
              href: '/en/blog',
              disabled: true,
            },
            {
              title: 'Careers',
              href: null,
              disabled: true,
            },
            {
              title: 'Contact',
              href: null,
              disabled: true,
            },
          ],
        },
        {
          title: 'Support',
          description: 'Get help when you need it.',
          items: [
            {
              title: 'Help Center',
              href: null,
              disabled: true,
            },
            {
              title: 'Community',
              href: null,
              disabled: true,
            },
          ],
        },
        {
          title: 'Legal',
          description: 'We stay on top of the latest legal requirements.',
          items: data.legalPages.items.map((post) => ({
            title: post._title,
            href: `/en/legal/${post._slug}`,
            disabled: true,
          })),
        },
      ];

      // if (env.NEXT_PUBLIC_DOCS_URL) {
      //   navigationItems.at(1)?.items?.push({
      //     title: 'Docs',
      //     href: env.NEXT_PUBLIC_DOCS_URL,
      //     isInternal: false,
      //   });
      // }

      return (
        <section className="dark border-foreground/10 border-t">
          <div className="w-full bg-background py-20 text-foreground lg:py-40">
            <div className="container mx-auto">
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div className="flex flex-col items-start gap-8">
                  <div className="flex flex-col gap-2">
                    <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                      EventDesk
                    </h2>
                    <p className="max-w-lg text-left text-foreground/75 text-lg leading-relaxed tracking-tight">
                      simplifying event planning
                    </p>
                  </div>
                  <Status />
                </div>
                <div className="grid items-start gap-10 lg:grid-cols-3">
                  {navigationItems.map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col items-start gap-1 text-base"
                    >
                      <div className="flex flex-col gap-2">
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="flex items-center justify-between"
                            target={
                              item.href.includes('http') ? '_blank' : undefined
                            }
                            rel={
                              item.href.includes('http')
                                ? 'noopener noreferrer'
                                : undefined
                            }
                          >
                            <span className="text-xl">{item.title}</span>
                          </Link>
                        ) : (
                          <p className="text-xl">{item.title}</p>
                        )}
                        {item.items?.map((subItem) => {
                          if ('disabled' in subItem && subItem.disabled) {
                            return (
                              <span
                                key={subItem.title}
                                className="cursor-not-allowed text-foreground/50"
                              >
                                {subItem.title}
                              </span>
                            );
                          }

                          if ('isInternal' in subItem && subItem.isInternal) {
                            return (
                              <FooterFeaturesButton
                                key={subItem.title}
                                title={subItem.title}
                              />
                            );
                          }

                          if (
                            subItem.href &&
                            typeof subItem.href === 'string'
                          ) {
                            return (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className="flex items-center justify-between transition-colors hover:text-foreground/90"
                                target={
                                  subItem.href.includes('http')
                                    ? '_blank'
                                    : undefined
                                }
                                rel={
                                  subItem.href.includes('http')
                                    ? 'noopener noreferrer'
                                    : undefined
                                }
                              >
                                <span className="text-foreground/75">
                                  {subItem.title}
                                </span>
                              </Link>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }}
  </Feed>
);
