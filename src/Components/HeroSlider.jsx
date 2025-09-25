import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slides } from "../assets/assests";
import { useNavigate } from "react-router-dom";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slideCount = useMemo(() => slides.length, []);
  const autoplayRef = useRef(null);
  const navigate = useNavigate();


  // Auto play
  useEffect(() => {
    if (!isAutoPlaying) return;

    autoplayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 6000);

    return () => clearInterval(autoplayRef.current);
  }, [isAutoPlaying, slideCount]);

  const restartAutoPlay = () => {
    setIsAutoPlaying(false);
    clearInterval(autoplayRef.current);
    setTimeout(() => setIsAutoPlaying(true), 7000);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
    restartAutoPlay();
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
    restartAutoPlay();
  }, [slideCount]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    restartAutoPlay();
  }, []);

  // ✅ Preload next & previous slides
  useEffect(() => {
    const preloadNext = new Image();
    preloadNext.src = slides[(currentSlide + 1) % slideCount].image;
    const preloadPrev = new Image();
    preloadPrev.src = slides[(currentSlide - 1 + slideCount) % slideCount].image;
  }, [currentSlide, slideCount]);

  return (
    <div className="relative w-full h-screen overflow-hidden group">
      {/* Slides */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            loading={currentSlide === 0 ? "eager" : "lazy"} // ✅ eager load first
            decoding="async"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end-safe pb-20 sm:items-center justify-start z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-400 text-sm sm:text-base font-medium uppercase tracking-wide">
              {slides[currentSlide].subtitle}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-8xl font-bold text-white mb-4 drop-shadow-lg">
              {slides[currentSlide].title}
            </h1>
            <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl mb-6 leading-relaxed">
              {slides[currentSlide].description}
            </p>
            <button
              onClick={() => navigate("/rooms")}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-semibold text-base shadow-lg transition-colors duration-300">
              Book Your Stay
            </button>

          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentSlide
                ? "w-10 h-2 bg-amber-500"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
