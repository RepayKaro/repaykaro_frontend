"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// 🟣 Change this to control number of trailing circles
const TRAIL_COUNT = 8;

const MouseCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const mainX = useSpring(mouseX, springConfig);
  const mainY = useSpring(mouseY, springConfig);

  // 🔁 Generate trail springs
  const trailX = Array.from({ length: TRAIL_COUNT }, () =>
    useSpring(mouseX, { damping: 30, stiffness: 100 })
  );
  const trailY = Array.from({ length: TRAIL_COUNT }, () =>
    useSpring(mouseY, { damping: 30, stiffness: 100 })
  );

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 150);
    };

    const bindHoverEvents = () => {
      document.querySelectorAll("a, button, .cursor-hover").forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("mouseup", () => setIsClicked(false));

    bindHoverEvents();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("mouseup", () => setIsClicked(false));
    };
  }, []);

  const cursorSize = isHovered ? 40 : isClicked ? 20 : 20;
  const cursorScale = isHovered ? 1.5 : isClicked ? 0.8 : 1;

  return (
    <>
      {/* Hide system cursor */}
      <style jsx global>{`
        * {
          cursor: none;
        }
      `}</style>

      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ translateX: mainX, translateY: mainY }}
      >
        <motion.div
          className="rounded-full border border-purple-600 bg-white/10 mix-blend-difference"
          animate={{
            width: cursorSize,
            height: cursorSize,
            scale: cursorScale,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      {/* Trailing circles */}
      {trailX.map((x, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 z-[9998] pointer-events-none"
          style={{
            translateX: x,
            translateY: trailY[i],
          }}
        >
          <div
            className="rounded-full bg-purple-500 opacity-20"
            style={{
              width: 10,
              height: 10,
              transform: "translate(-50%, -50%)",
              filter: "blur(2px)",
            }}
          />
        </motion.div>
      ))}
    </>
  );
};

export default MouseCursor;
