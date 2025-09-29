import React, { useState, useEffect, useRef, useCallback, useState as useReactState } from "react";
import Navbar from "./components/Navbar.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";
import SectionModal from "./components/SectionModal.jsx";
import { Element } from "react-scroll";
import { Link } from "react-router-dom";

/** ---------- FIX: robust looping video component with smoother load ---------- **/
function LoopingVideo({ src, poster, className, onClick, variant = 0, preloadMode = "auto" }) {
  const ref = useRef(null);
  const [loading, setLoading] = useReactState(true);

  const forcePlay = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.catch(() => setTimeout(() => v.play().catch(() => {}), 200));
    }
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.load(); // force pre-buffer

    const onCanPlayThrough = () => {
      setLoading(false);
      forcePlay();
    };
    const onEnded = () => v.play();
    const onSuspend = () => forcePlay();
    const onPlaying = () => setLoading(false);

    v.addEventListener("canplaythrough", onCanPlayThrough);
    v.addEventListener("ended", onEnded);
    v.addEventListener("suspend", onSuspend);
    v.addEventListener("playing", onPlaying);

    forcePlay();

    return () => {
      v.removeEventListener("canplaythrough", onCanPlayThrough);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("suspend", onSuspend);
      v.removeEventListener("playing", onPlaying);
    };
  }, [forcePlay]);

  return (
    <div className="relative">
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload={preloadMode}
        disablePictureInPicture
        controls={false}
        className={className}
        onClick={onClick}
        onError={(e) => console.warn("Video error", e?.currentTarget?.error)}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-sm animate-pulse">
          Loading video…
        </div>
      )}
    </div>
  );
}

/** ---------- GALLERY DATA ---------- **/
const galleryImages = [
  { file: "Bixinho.png", desc: "Bixinho (Little Thing) - A floral-bodied portrait ..." },
  { file: "La_fine_fleur.png", desc: "La Fine Fleur (The Finest Flower) ..." },
  { file: "Sobre o desejo.png", desc: "Sobre o Desejo (About the Desire) ..." },
  { file: "Com_que_roupa_vou.png", desc: "Com que roupa vou (With What Outfit Should I Go?) ..." },
  { file: "Seven_Sins.png", desc: "Seven Sins - This is a dense montage ..." },
  { file: "Nesta_Casa.png", desc: "Nesta Casa (In This House) ..." }
];

export default function App() {
  const [modalData, setModalData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileHomeIndex, setMobileHomeIndex] = useState(0);

  // Track window size
  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Mobile home looping alternate every 7 seconds
  useEffect(() => {
    if (windowWidth >= 768) return; // desktop uses 3 videos
    const interval = setInterval(() => {
      setMobileHomeIndex((prev) => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(interval);
  }, [windowWidth]);

  const homeVideos = [
    { src: "/leftcutout.mp4", poster: "/Olhos_em_mim.png", desc: "Olhos em Mim ..." },
    { src: "/cutout1noaudio.mp4", poster: "/Sobre_o_azul.png", desc: "Sobre o Azul ..." },
    { src: "/rightcutout.mp4", poster: "/Rainha_Dragão.png", desc: "Rainha Dragão ..." }
  ];

  return (
    <div className="font-sans">
      <Navbar />

      {/* HOME */}
      <Element name="home" className="min-h-screen bg-black pt-20">
        <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)] flex items-center justify-center gap-4 px-4">
          {windowWidth >= 768 ? (
            <>
              <LoopingVideo
                key="left"
                src={homeVideos[0].src}
                poster={homeVideos[0].poster}
                className="w-1/3 max-h-[70vh] object-cover cursor-pointer"
                onClick={() =>
                  setModalData({ img: homeVideos[0].poster, desc: homeVideos[0].desc })
                }
                preloadMode="auto"
              />
              <LoopingVideo
                key="center"
                src={homeVideos[1].src}
                poster={homeVideos[1].poster}
                className="w-1/3 max-h-[70vh] object-cover cursor-pointer"
                onClick={() =>
                  setModalData({ img: homeVideos[1].poster, desc: homeVideos[1].desc })
                }
                preloadMode="metadata"
              />
              <LoopingVideo
                key="right"
                src={homeVideos[2].src}
                poster={homeVideos[2].poster}
                className="w-1/3 max-h-[70vh] object-cover cursor-pointer"
                onClick={() =>
                  setModalData({ img: homeVideos[2].poster, desc: homeVideos[2].desc })
                }
                preloadMode="metadata"
              />
            </>
          ) : (
            <LoopingVideo
              key={mobileHomeIndex}
              src={homeVideos[mobileHomeIndex].src}
              poster={homeVideos[mobileHomeIndex].poster}
              className="w-full max-h-[60vh] object-cover cursor-pointer"
              onClick={() =>
                setModalData({
                  img: homeVideos[mobileHomeIndex].poster,
                  desc: homeVideos[mobileHomeIndex].desc
                })
              }
              preloadMode="auto"
            />
          )}
        </div>
      </Element>

      {/* GALLERY */}
      <Element name="gallery" className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-10">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((item, idx) => (
              <img
                key={item.file}
                src={`/${item.file}`}
                alt={item.file}
                className="w-full aspect-[4/5] object-cover cursor-pointer hover:opacity-90 transition"
                onClick={() =>
                  setModalData({
                    img: `/${item.file}`,
                    reverse: idx % 3 === 1,
                    desc: item.desc
                  })
                }
              />
            ))}
          </div>
        </div>
      </Element>

      {/* MEET THE ARTIST */}
      <Element name="meet" className="relative min-h-screen bg-black text-white flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-no-repeat bg-cover"
          style={{
            backgroundImage: "url('/background.png')",
            animation: "slideLeft 20s linear infinite"
          }}
        />
        <style>
          {`@keyframes slideLeft {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }`}
        </style>

        <div className="max-w-7xl mx-auto w-full px-6 py-16 flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-full md:w-2/3">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Lethicia</h2>
            <p className="text-lg opacity-90 mb-8">
              A collage artist blending magazine cuts, paintings, and photos into
              rhythmic compositions. This section leads to a dedicated page with
              a deeper story, process notes, and selected works.
            </p>
            <Link to="/meet">
              <button
                className="px-6 py-3 rounded-xl bg-blue-400 text-black font-semibold
                           hover:bg-gray-400 active:bg-white transition-colors duration-200"
              >
                Peek behind the collage
              </button>
            </Link>
          </div>
        </div>
      </Element>

      {/* MORE TO SEE */}
      <Element
        name="more"
        className="min-h-[45vh] flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,200,255,0.85), rgba(255,250,200,0.9))",
        }}
      >
        <div className="text-center px-6 py-16">
          <h3 className="font-serif text-3xl md:text-4xl mb-4">More to see</h3>
          <p className="mb-6">Here you can find more of her work.</p>
          <a
            href="https://www.instagram.com/floreioscolados/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 hover:bg-white transition"
            title="Instagram"
          >
            <span className="text-xl">📷</span>
            <span>@floreioscolados</span>
          </a>
          <a href="https://portfolio-git-main-ricks-projects-08c86335.vercel.app/" target="_blank"><div className="mt-6 text-sm opacity-75">a project by Henrique Oliveira</div></a>
        </div>
      </Element>

      <ScrollTopButton />
      <SectionModal modalData={modalData} setModalData={setModalData} />
    </div>
  );
}
