import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function SectionModal({ modalData, setModalData }) {
  if (!modalData) return null;

  return (
    <Modal
      isOpen={!!modalData}
      onRequestClose={() => setModalData(null)}
      shouldCloseOnOverlayClick={true}
      onAfterOpen={() => document.body.classList.add("no-scroll")}
      onAfterClose={() => document.body.classList.remove("no-scroll")}
      // Overlay covers entire viewport and has a very high z-index
      overlayClassName={
        "fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      }
      // Content has its own z-index and is centered by the overlay
      className={
        "relative outline-none w-full max-w-5xl mx-auto flex justify-center items-start pointer-events-none"
      }
    >
      {/* 
        Inner wrapper receives pointer events (so overlay clicks register outside this wrapper).
        - pointer-events: auto ensures clicks inside do not fall through to overlay.
        - flex-col on mobile (stacked): description above image
        - md:flex-row or md:flex-row-reverse on desktop to keep alternating
      */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`pointer-events-auto w-full max-w-5xl flex flex-col items-center gap-6
                    text-center md:text-left
                    ${modalData?.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        {/* Description: appears ABOVE the image on mobile due to flex-col */}
        <div className="w-full md:w-1/2 flex-shrink-0 order-1 md:order-none">
          <div
            className="mx-auto md:mx-0 bg-black/80 backdrop-blur-md rounded-xl p-4 md:p-6 text-sm md:text-base leading-relaxed text-white"
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              // limit width so it centers nicely on mobile
              maxWidth: "900px",
            }}
          >
            <p>{modalData.desc}</p>
          </div>
        </div>

        {/* Image: below the description on mobile, side-by-side on md+ */}
        <div className="w-full md:w-1/2 flex items-center justify-center order-2 md:order-none">
          <img
            src={modalData.img}
            alt=""
            className="w-full md:w-auto max-w-full max-h-[70vh] object-contain rounded-lg"
            style={{
              // image shouldn't block overlay clicks outside its bounding box
              pointerEvents: "auto",
              display: "block",
            }}
          />
        </div>

        {/* Small accessible close button (helps users who can't tap outside) */}
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
