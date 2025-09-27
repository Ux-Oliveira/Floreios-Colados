import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function SectionModal({ modalData, setModalData }) {
  if (!modalData) return null;

  return (
    <Modal
      isOpen={!!modalData}
      onRequestClose={() => setModalData(null)}
      overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center"
      className="bg-transparent outline-none"
    >
      <div
        className={`max-w-5xl w-[90vw] mx-auto flex flex-col md:flex-row gap-6 md:gap-10`}
        style={{ flexDirection: modalData.reverse ? "row-reverse" : "row" }}
      >
        <img
          src={modalData.img}
          alt=""
          className="w-full md:w-1/2 max-h-[75vh] object-contain"
        />
        <div className="w-full md:w-1/2 self-center">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 text-white">
            <p className="leading-relaxed">{modalData.desc}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
