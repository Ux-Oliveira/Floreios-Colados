import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./components/Navbar.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";
import SectionModal from "./components/SectionModal.jsx";
import { Element } from "react-scroll";
import { Link } from "react-router-dom";

/** ---------- FIX: robust looping video component ---------- **/
function LoopingVideo({ src, poster, className, onClick, variant = 0 }) {
  const ref = useRef(null);

  // helper to retry autoplay
  const forcePlay = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.catch(() => setTimeout(() => v.play().catch(() => {}), 200));
    }
  }, []);

  useEffect(() => {
    if (!ref.current || src.toLowerCase().endsWith(".gif")) return; // skip for gifs

    const v = ref.current;
    const onCanPlay = () => forcePlay();
    const onEnded = () => v.play();
    const onSuspend = () => forcePlay();

    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("ended", onEnded);
    v.addEventListener("suspend", onSuspend);
    forcePlay();

    return () => {
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("suspend", onSuspend);
    };
  }, [forcePlay, src]);

  const uniqueSrc = `${src}?v=${variant}`;

  // ✅ if it's a GIF → render <img>
  if (src.toLowerCase().endsWith(".gif")) {
    return (
      <img
        src={uniqueSrc}
        alt=""
        className={className}
        onClick={onClick}
        style={{ objectFit: "cover" }}
      />
    );
  }

  // otherwise, render <video>
  return (
    <video
      ref={ref}
      src={uniqueSrc}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      className={className}
      onClick={onClick}
      onError={(e) => console.warn("Video error", e?.currentTarget?.error)}
    />
  );
}

/** ---------- GALLERY DATA ---------- **/
const galleryImages = [
  { file: "Bixinho.png", desc: "Bixinho (Little Thing) - A floral-bodied portrait that folds text and orchids into an intimate yet uneasy confession about attachment and desire. The Portuguese text reads: 'I never felt detachment from anyone… with you… I experienced it… I couldn’t resist'. This slight jab goes hand-in-hand with the identity exploration themes. One could read that as a soliloquy, coming from a person who, upon detaching themselves from someone, found themselves attached to and in tune with themselves." },
  { file: "La_fine_fleur.png", desc: "La Fine Fleur (The Finest Flower) - This is perhaps the most fundamental piece from the collection. Because it expands upon all the themes. The womans face is replaced with an exert from a book instead of a flower this time. The headpiece of the flower still grows out of her though, symbolizing transformation. This collage celebrates women as intellectual, natural, and hybrid beings. That are to be cultivated like flowers, but are also rooted in knowledge and ellegance." },
  { file: "Sobre o desejo.png", desc: "Sobre o Desejo (About the Desire) - Some gestures in this composition are open and tender, while others suggest struggle or erotic tension. Maybe her most surreal piece, perhaps expanding upon the disjointment theme of Bixinho. The orchid´s association with sensuality is front and center and fused with the fragmented human limbs. A metaphor for desire as both natural and disjointed sensations, beautiful yet unsettling." },
  { file: "Com_que_roupa_vou.png", desc: "Com que roupa vou (With What Outfit Should I Go?) - Botticelli’s Birth of Venus is present here once again. Her body is about to be dressed by two large manicured hands reaching down with paper-doll formal clothes, a suit and a tie. Fashion cutouts surround her. Although the bright red background suggest a theatrical and playful mood. This masquerades the tool of societal pressure upon women. Venus is forced to fit into a mold. Therefore the orchids are gone. Replaced by the plastic consumerist nature that we often find in the place where, someones identity was supposed to be. While the title suggests the confusion brought by the overwhelming choices of consumerism. There are no orchids present, and as such no identity to be found, no matter what Venus chooses to wear. " },
  { file: "Seven_Sins.png", desc: "Seven Sins - This is a dense montage referencing moral lists and decorative excess where repetition becomes the motif of transgression. The honey flows suggestively, placed close to the body. Sensual and playful, the honey and the text “We can take it slow” are an exploration of indulgence, pleasure, and temptation. Aligning with the idea of “sins” but reframing them as sweet and human." },
  { file: "Nesta_Casa.png", desc: "Nesta Casa (In This House) - From the windows of a baroque-style palace façade emerges human arms, legs, and eyes. As if the house itself is alive. The collage transforms the palace into a surreal body, suggesting memory, surveillance, and the lives hidden inside walls. Rooms and bodies become interchangeable containers of memory. A transitional piece in this gallery that serves as a sneak peak into what other themes the artist wants to explore. While still screaming her central theme: Identity!" }
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
    { src: "/left.gif", poster: "/Olhos_em_mim.png", desc: "“Olhos em Mim” (Eyes on Me) - In this piece the woman sits elegantly in a beige outfit, her head replaced by a slipper orchid. Around her float disembodied eyes, cut out and scattered across the white space. It plays with the themes of gaze, objectification, and power. The subject is both the one looked at and the one controlling the scene." },
    { src: "/center.gif", poster: "/Sobre_o_azul.png", desc: "“Sobre o Azul” (About the Blue/or Over the Blue) — this piece fuses human, botanical, and mythological imagery. It brings up themes of identity in relation to individuality, nature intertwined with culture. The woman with the flowing drapery is a Hora (one of the Goddesses of the seasons) taken from Botticelli's 'The Birth of Venus'. In the painting she rushes to Venus to welcome her into the world of Gods by wrapping her in a richly patterned floral cloak. In this collage she greets an orchid into existence." },
    { src: "/right.gif", poster: "/Rainha_Dragão.png", desc: "“Rainha Dragão” (Dragon Queen) - A hybrid of sexuality and danger. breaking away from the 'flowerly identity' motif, expressed by flowers placed over women´s faces. This piece symbolizes empowerment, rage, and female strength. It is a reclaiming of vulnerability through mythological fire. Interestingly, the orchid present in Sobre o Azul has certain hybrid cultivars that are called Dragon Dance or Krull´s Yellow Dragon. Which enphasizes the exploration of transformation, power and ceremonial identity present in a lot of Lethicia´s work. And suggests the flower motif is still present here." }
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
                variant={0}
                poster={homeVideos[0].poster}
                className="w-1/3 max-h-[70vh] object-cover cursor-pointer"
                onClick={() =>
                  setModalData({ img: homeVideos[0].poster, desc: homeVideos[0].desc })
                }
              />
              <LoopingVideo
                key="center"
                src={homeVideos[1].src}
                variant={1}
                poster={homeVideos[1].poster}
                className="w-1/3 max-h-[70vh] object-cover cursor-pointer"
                onClick={() =>
                  setModalData({ img: homeVideos[1].poster, desc: homeVideos[1].desc })
                }
              />
              <LoopingVideo
                key="right"
                src={homeVideos[2].src}
                variant={2}
                poster={homeVideos[2].poster}
                className="w-1/3 max-h-[70vh] object-cover cursor-pointer"
                onClick={() =>
                  setModalData({ img: homeVideos[2].poster, desc: homeVideos[2].desc })
                }
              />
            </>
          ) : (
            <LoopingVideo
              key={mobileHomeIndex}
              src={homeVideos[mobileHomeIndex].src}
              variant={mobileHomeIndex}
              poster={homeVideos[mobileHomeIndex].poster}
              className="w-full max-h-[60vh] object-cover cursor-pointer"
              onClick={() =>
                setModalData({
                  img: homeVideos[mobileHomeIndex].poster,
                  desc: homeVideos[mobileHomeIndex].desc
                })
              }
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
        {/* Background sliding image */}
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
