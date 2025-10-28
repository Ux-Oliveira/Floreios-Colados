import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function SectionModal({ modalData, setModalData }) {
  if (!modalData) return null;

  const handleOverlayClick = (e) => {
    // Close only when clicking directly on the overlay (not the content)
    if (e.target.classList.contains("ReactModal__Overlay")) {
      setModalData(null);
    }
  };

  return (
    <Modal
      isOpen={!!modalData}
      onRequestClose={() => setModalData(null)}
      onAfterOpen={() => document.body.classList.add("no-scroll")}
      onAfterClose={() => document.body.classList.remove("no-scroll")}
      overlayClassName="ReactModal__Overlay fixed inset-0 bg-black/70 flex items-center justify-center p-4 overflow-y-auto z-[100]"
      className="bg-transparent outline-none w-full flex justify-center"
      shouldCloseOnOverlayClick={true}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-transparent flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-5xl items-center justify-center text-center md:text-left`}
        style={{ flexDirection: modalData.reverse ? "row-reverse" : "row" }}
      >
        {/* Description ABOVE image on mobile */}
        <div className="w-full md:w-1/2 text-white order-1 md:order-none">
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 md:p-6 text-sm md:text-base leading-relaxed">
            <p>{modalData.desc}</p>
          </div>
        </div>

        {/* Image BELOW description on mobile */}
        <img
          src={modalData.img}
          alt=""
          className="w-full md:w-1/2 max-h-[70vh] md:max-h-[75vh] object-contain rounded-lg cursor-default order-2 md:order-none"
        />
      </div>
    </Modal>
  );
}
