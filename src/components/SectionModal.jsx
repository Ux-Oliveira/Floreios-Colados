import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function SectionModal({ modalData, setModalData }) {
  if (!modalData) return null;

  const handleOverlayClick = (e) => {
    // close only if click is outside modal content
    if (e.target.classList.contains("ReactModal__Overlay")) {
      setModalData(null);
    }
  };

  return (
    <Modal
      isOpen={!!modalData}
      onRequestClose={() => setModalData(null)}
      shouldCloseOnOverlayClick={true}
      onAfterOpen={() => document.body.classList.add("no-scroll")}
      onAfterClose={() => document.body.classList.remove("no-scroll")}
      overlayClassName="ReactModal__Overlay fixed inset-0 bg-black/70 z-[9999] p-4 overflow-y-auto"
      className="relative outline-none w-full max-w-5xl mx-auto flex justify-center items-center"
      onClick={handleOverlayClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`pointer-events-auto w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10
                    ${modalData?.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        {/* On mobile: description appears ABOVE image and centered */}
        <div className="w-full md:w-1/2 order-1 md:order-none flex flex-col items-center text-center md:text-left">
          <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 md:p-6 text-sm md:text-base leading-relaxed text-white max-w-[600px]">
            <p>{modalData.desc}</p>
          </div>
        </div>

        {/* Image (centered under text on mobile) */}
        <div className="w-full md:w-1/2 order-2 md:order-none flex items-center justify-center">
          <img
            src={modalData.img}
            alt=""
            className="w-full max-w-full md:w-auto max-h-[70vh] object-contain rounded-lg"
            style={{ pointerEvents: "auto", display: "block" }}
          />
        </div>

        {/* Close button (desktop + mobile) */}
        <button
          aria-label="Close"
          onClick={() => setModalData(null)}
          className="absolute top-4 right-4 z-[10010] bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/70"
          style={{ pointerEvents: "auto" }}
        >
          ✕
        </button>
      </div>
    </Modal>
  );
}
