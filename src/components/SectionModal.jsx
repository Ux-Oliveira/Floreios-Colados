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
      overlayClassName={
        // keep a stable overlay class name so react-modal's overlay click logic works
        "ReactModal__Overlay fixed inset-0 bg-black/70 flex items-center justify-center p-4 overflow-y-auto z-[100]"
      }
      // make modal content wrapper minimal (react-modal will render it centered)
      className="ReactModal__Content bg-transparent outline-none w-full flex justify-center items-start"
    >
      {/* 
        Container:
        - always column on mobile (stacked)
        - on md+ it becomes row or row-reverse depending on modalData.reverse
        - text-center on mobile, left-aligned on md+
      */}
      <div
        className={`w-full max-w-5xl flex flex-col items-center gap-6
                    text-center md:items-start md:text-left
                    ${modalData?.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        {/* DESCRIPTION: appears ABOVE the image on mobile (because of flex-col) */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <div
            className="mx-auto md:mx-0 bg-black/70 backdrop-blur-md rounded-xl p-4 md:p-6 text-sm md:text-base leading-relaxed
                       max-w-[900px]"
            style={{
              // ensure the description box doesn't exceed viewport on very small screens
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <p>{modalData.desc}</p>
          </div>
        </div>

        {/* IMAGE: below the description on mobile, side-by-side on md+ */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src={modalData.img}
            alt=""
            className="w-full md:w-auto max-w-full max-h-[70vh] object-contain rounded-lg"
            // ensure image doesn't capture pointer events that should close overlay when clicking outside
            style={{ pointerEvents: "auto" }}
          />
        </div>
      </div>
    </Modal>
  );
}
