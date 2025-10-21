import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SplitText = ({
  text,
  className = "",
  delay = 0.2, // Default delay বাড়ালাম visibility-এর জন্য
  duration = 1, // Duration বাড়ালাম (আগে 0.6 ছিল, fast)
  ease = "power3.out",
  splitType = "chars", // 'words' or 'chars'
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null); // GSAP animation store করার জন্য cleanup-এ

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = Array.from(containerRef.current.querySelectorAll("span"));
    console.log("Letters found in SplitText:", letters.length, letters); // Debug log: চেক করো console-এ কত letters পাচ্ছে

    if (letters.length === 0) {
      console.warn("No spans found! Check DOM render.");
      return;
    }

    // Previous animation kill করো
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // New animation
    animationRef.current = gsap.fromTo(letters, from, {
      ...to,
      delay,
      duration,
      ease,
      stagger: 0.1, // Stagger বাড়ালাম (আগে 0.05, slow করে visible)
      onComplete: () => {
        console.log("SplitText animation complete!"); // Debug
        if (onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
      },
    });

    // Cleanup on unmount/props change
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [
    text,
    from,
    to,
    delay,
    duration,
    ease,
    splitType,
    onLetterAnimationComplete,
  ]); // Dependencies add করলাম re-trigger-এর জন্য

  const splitText = splitType === "chars" ? text.split("") : text.split(" ");

  return (
    <h2 ref={containerRef} className={className}>
      {splitText.map((char, i) => (
        <span key={i} className="inline-block" style={{ opacity: 0 }}>
          {" "}
          {/* Initial opacity 0 CSS-এ for better control */}
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h2>
  );
};

export default SplitText;
