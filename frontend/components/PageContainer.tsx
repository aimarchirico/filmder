import React from 'react';
import PageHeader from './PageHeader';

interface PageContainerProps {
  title: string;
  showBackButton?: boolean;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  showBackButton = false,
  children 
}) => {
  return (
    <div className="bg-black min-h-screen">
      <PageHeader title={title} showBackButton={showBackButton} />
      <div className="pt-5 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;