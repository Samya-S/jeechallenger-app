import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ crumbs, hasBanner = false, className = '' }) {
  // If no crumbs are passed, don't render anything
  if (!crumbs || crumbs.length === 0) return null;

  return hasBanner 
    ? <BannerBreadcrumbs crumbs={crumbs} className={className} /> 
    : <StandardBreadcrumbs crumbs={crumbs} className={className} />;
}

const StandardBreadcrumbs = ({ crumbs, className }) => (
  <nav aria-label="breadcrumb" className={className}>
    <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-hide">
      
      {/* Always include a Home link */}
      <li>
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <Home className="w-4 h-4" />
          <span className="sr-only">Home</span>
        </Link>
      </li>

      {/* Map through explicitly provided crumbs */}
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
            <li>
              {isLast ? (
                <span className="text-gray-900 dark:text-gray-100" aria-current="page">
                  {crumb.label}
                </span>
              ) : !crumb.href ? (
                <span>{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  </nav>
);


const BannerBreadcrumbs = ({ crumbs, className }) => (
  <nav aria-label="breadcrumb" className={className}>
    <ol className="flex items-center space-x-2 text-sm text-blue-100 ml-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
      
      {/* Always include a Home link */}
      <li>
        <Link href="/" className="flex items-center hover:text-white transition-colors">
          <Home className="w-4 h-4" />
          <span className="sr-only">Home</span>
        </Link>
      </li>

      {/* Map through explicitly provided crumbs */}
      {crumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 shrink-0 text-blue-200/70" />
          <li>
            {(index === crumbs.length - 1) ? (
              <span className="text-white" aria-current="page">{crumb.label}</span>
            ) : !crumb.href ? (
              <span>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
            )}
          </li>
        </React.Fragment>
      ))}
    </ol>
  </nav>
);
