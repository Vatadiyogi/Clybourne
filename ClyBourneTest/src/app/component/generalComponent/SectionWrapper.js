import React from 'react';

export const SectionWrapper = ({ children, customClass = '' }) => {
  return (
    <section
      className={`w-full px-4 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36 py-4 sm:py-12 md:py-16 lg:py-20 ${customClass}`}
    >
      {children}
    </section>
  );
}
