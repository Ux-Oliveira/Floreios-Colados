import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";

const items = [
  { to: "home", label: "home" },
  { to: "gallery", label: "galery" }, // spelling kept as you wrote
  { to: "meet", label: "meet the artist" },
  { to: "more", label: "more to see" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false); // close dropdown on link click
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur z-50 flex items-center justify-between px-6">
      {/* Brand or Logo */}
      <div className="hidden md:block font-serif font-bold text-xl">
        Collages by <span style={{ color: "#18AFD7" }}>Lethicia</span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-6">
        {items.map((item) => (
          <ScrollLink
            key={item.to}
            to={item.to}
            smooth={true}
            duration={600}
            offset={-64}
            className="cursor-pointer font-serif text-sm md:text-base uppercase tracking-wide hover:underline"
          >
            {item.label}
          </ScrollLink>
        ))}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden relative ml-auto">
        <button onClick={() => setOpen(!open)}>
          <img src="/icon.png" alt="menu" className="w-8 h-8" />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg flex flex-col py-2 z-50">
            {items.map((item) => (
              <ScrollLink
                key={item.to}
                to={item.to}
                smooth={true}
                duration={600}
                offset={-64}
                onClick={handleLinkClick}
                className="cursor-pointer font-serif px-4 py-2 uppercase text-sm hover:bg-gray-100"
              >
                {item.label}
              </ScrollLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
