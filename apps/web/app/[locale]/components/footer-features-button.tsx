'use client';

type FooterFeaturesButtonProps = {
  title: string;
};

const handleFeaturesNavigation = () => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/' || currentPath.match(/^\/[a-z]{2}$/);

    if (isHomePage) {
      // On home page - use smooth scroll
      const element = document.getElementById('features');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On other pages - redirect to home with hash
      const homeUrl = currentPath.includes('/en') ? '/en' : '/';
      window.location.href = `${homeUrl}#features`;
    }
  }
};

export const FooterFeaturesButton = ({ title }: FooterFeaturesButtonProps) => (
  <button
    type="button"
    onClick={handleFeaturesNavigation}
    className="flex items-center justify-between text-left transition-colors hover:text-foreground/90"
  >
    <span className="text-foreground/75">{title}</span>
  </button>
);
