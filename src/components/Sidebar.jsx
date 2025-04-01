import React, { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi"; // Hamburger icon

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Toggle Sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close Sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Navigation items data
  const navSections = [
    {
      title: "Terms",
      items: ["Home", "Discovery", "Community", "Coming soon"],
    },
    {
      title: "LIBRARY",
      items: ["Recent", "Bookmarked", "Top rated", "Downloaded", "Settings", "Help"],
    },
    {
      title: "Terms",
      items: ["Logout", "Watches"],
    },
  ];

  return (
    <div>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="text-white bg-gray-800 p-2 rounded-md focus:outline-none fixed top-4 left-4 z-50"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar & Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? "visible bg-black bg-opacity-50" : "invisible"
        }`}
      >
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 border-r border-gray-700 transition-transform duration-300 z-50 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {navSections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-gray-500 uppercase text-xs font-semibold mb-4 tracking-wider">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href="#"
                      className="block py-2 px-4 rounded hover:bg-gray-700 font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
