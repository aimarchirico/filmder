import React from 'react';
import MenuDropdown from './Menu';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showBackButton = false }) => {
  const router = useRouter();
  
  return (
    <div className="py-6 px-4 md:px-8 flex items-center w-full max-w-6xl mx-auto">
      <div className="flex items-center flex-grow">
        {showBackButton && (
          <button 
            onClick={() => router.back()} 
            className="bg-secondary hover:bg-purple-700 text-white p-2 mr-4 rounded-full transition-colors duration-200 flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-4xl md:text-6xl font-bold text-secondary text-left">
          {title}
        </h1>
      </div>
      <div className="ml-auto z-50">
        <MenuDropdown />
      </div>
    </div>
  );
};

export default PageHeader;