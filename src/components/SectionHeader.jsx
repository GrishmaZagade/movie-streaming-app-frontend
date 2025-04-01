import React from 'react';

/**
 * Reusable section header component
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {ReactNode} props.children - Content below the header
 * @param {string} [props.className] - Additional CSS classes
 */
const SectionHeader = ({ title, children, className = '' }) => {
  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="text-xl font-bold mb-6 text-white">
        {title}
      </h2>
      {children}
    </section>
  );
};

export default SectionHeader;