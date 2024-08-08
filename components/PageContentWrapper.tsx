import React, { ReactNode } from "react";

interface PageContentWrapperProps {
  children: ReactNode;
}

const PageContentWrapper: React.FC<PageContentWrapperProps> = ({ children }) => {
  return <div className="px-12 min-h-screen min-w-full">{children}</div>;
};

export default PageContentWrapper;
