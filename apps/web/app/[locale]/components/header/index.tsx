'use client';

import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { Button } from '@repo/design-system/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@repo/design-system/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { Dictionary } from '@repo/internationalization';
import { EarlyAccessModal } from '../../(home)/components/early-access-modal';
import { LanguageSwitcher } from './language-switcher';

type HeaderProps = {
  dictionary: Dictionary;
};

const handleNavigation = (sectionId: string) => {
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === '/' || currentPath.match(/^\/[a-z]{2}$/);

  if (isHomePage) {
    // On home page - use smooth scroll
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // On other pages - redirect to home with hash
    const homeUrl = currentPath.includes('/en') ? '/en' : '/';
    window.location.href = `${homeUrl}#${sectionId}`;
  }
};

export const Header = ({ dictionary }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);

  const navigationItems = [
    {
      title: dictionary.web.header.navigation.about,
      href: '#hero',
      description: '',
    },
    {
      title: dictionary.web.header.navigation.features,
      href: '#features',
      description: '',
    },
    {
      title: dictionary.web.header.navigation.faq,
      href: '#faq',
      description: '',
    },
    {
      title: dictionary.web.header.navigation.contact,
      href: '#cta',
      description: '',
    },
  ];

  return (
    <header className="sticky top-0 left-0 z-40 w-full border-b bg-background">
      <div className="container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
        {/* Left: Navigation Menu (Desktop) */}
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
          <NavigationMenu className="flex items-start justify-start">
            <NavigationMenuList className="flex flex-row justify-start gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink asChild>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        handleNavigation(item.href.replace('#', ''))
                      }
                      className="cursor-pointer"
                    >
                      {item.title}
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Center: EventDesk Logo */}
        <div className="flex items-center justify-center lg:justify-center">
          <Link
            href="/#hero"
            className="font-bold text-2xl text-foreground tracking-tight transition-colors duration-200 hover:text-foreground/80"
            onClick={() => handleNavigation('hero')}
          >
            EventDesk
          </Link>
        </div>

        {/* Right: Controls */}
        <div className="flex w-full justify-end gap-4">
          <div className="hidden border-r md:inline" />
          <div className="hidden md:inline">
            <LanguageSwitcher />
          </div>
          <div className="hidden md:inline">
            <ModeToggle />
          </div>
          <Button onClick={() => setIsEarlyAccessOpen(true)}>
            Get Early Access
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex w-12 shrink items-end justify-end lg:hidden">
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          {isOpen && (
            <div className="container absolute top-20 right-0 flex w-full flex-col gap-8 border-t bg-background py-4 shadow-lg">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleNavigation(item.href.replace('#', ''));
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-start text-lg"
                    >
                      {item.title}
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-4 border-t pt-4">
                <div className="flex items-center gap-4">
                  <LanguageSwitcher />
                  <ModeToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Early Access Modal */}
      <EarlyAccessModal
        isOpen={isEarlyAccessOpen}
        onClose={() => setIsEarlyAccessOpen(false)}
      />
    </header>
  );
};
