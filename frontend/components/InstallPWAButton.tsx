'use client';

import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download } from 'lucide-react';

const InstallPWAButton = () => {
  const { isInstalled, platform } = usePWAInstall();

  const handleInstallClick = () => {
    switch (platform) {
      case 'ios':
        alert("To install, tap the Share button and then 'Add to Home Screen'.");
        break;
      case 'android':
        alert("To install, look for an 'Install' or 'Add to Home Screen' option in your browser's menu.");
        break;
      case 'web':
        alert("To install this app, click the 'Install' icon in your browser's address bar or find the option in the menu.");
        break;
    }
  };

  if (isInstalled) {
    return null; // Don't show the button if the app is already installed
  }

  return (
    <button
      onClick={handleInstallClick}
      className="p-2 hover:bg-purple-700 rounded-lg transition"
      aria-label="Install app"
    >
      <Download className="w-12 h-12 text-white" />
    </button>
  );
};

export default InstallPWAButton;
