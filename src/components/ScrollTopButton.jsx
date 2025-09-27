import React from "react";
import { animateScroll as scroll } from "react-scroll";

export default function ScrollTopButton() {
  return (
    <button
      onClick={() => scroll.scrollToTop({ duration: 600 })}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-neutral-900 text-white
                 flex items-center justify-center hover:opacity-90 transition z-50"
      title="Back to top"
    >
      ↑
    </button>
  );
}
