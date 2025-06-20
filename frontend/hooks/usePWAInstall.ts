import { useState, useEffect } from 'react';

type Platform = 'ios' | 'android' | 'web';

export const usePWAInstall = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>('web');

  useEffect(() => {
    // Check if the app is running in standalone mode (already installed)
    const runningStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(runningStandalone);

    // Detect platform
    const userAgent = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform('ios');
    } else if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('web'); // Desktop or other mobile
    }
  }, []);

  return { isInstalled, platform };
};