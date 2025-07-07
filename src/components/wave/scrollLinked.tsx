"use client";

import { useEffect } from "react";
import { motion, useScroll } from "motion/react";

const ScrollLinked = () => {
    const { scrollYProgress } = useScroll();


    useEffect(() => {
        // Optional: add logging or styling behavior
        // console.log("Scroll progress bound");
    }, []);

    return (
        <>
            <motion.div
                id="scroll-indicator"
                style={{
                    scaleX: scrollYProgress,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 8,
                    originX: 0,
                    backgroundImage: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    zIndex: 50,
                }}
            />


        </>
    );

};

export default ScrollLinked;
