"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, Wand2 } from "lucide-react";

interface MagicLoadingAnimationProps {
    message?: string;
}

export default function MagicLoadingAnimation({
    message = "Our magic is weaving your adventure...",
}: MagicLoadingAnimationProps) {
    const [dots, setDots] = useState("");

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Colors for the magic particles
    const colors = ["#FF9933", "#66CCFF", "#FF6699", "#99CC33", "#CC99FF"];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-indigo-900/80 to-purple-900/80 backdrop-blur-sm"
        >
            <div className="flex flex-col items-center space-y-8 max-w-md px-6">
                {/* Magic book animation container */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Spinning outer circle */}
                    <motion.div
                        className="absolute w-full h-full rounded-full border-4 border-yellow-300 border-dashed"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* Spinning inner circle (opposite direction) */}
                    <motion.div
                        className="absolute w-3/4 h-3/4 rounded-full border-4 border-pink-400 border-dashed"
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* Book in the center */}
                    <motion.div
                        className="relative bg-blue-100 w-24 h-20 rounded-lg shadow-xl flex items-center justify-center"
                        animate={{
                            scale: [1, 1.1, 1],
                            rotateY: [0, 10, 0, -10, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {/* Book cover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-inner overflow-hidden">
                            <div className="absolute inset-x-0 top-2 h-1 bg-yellow-200 rounded-full mx-2 opacity-70"></div>
                            <div className="absolute inset-x-0 top-5 h-1 bg-yellow-200 rounded-full mx-3 opacity-50"></div>
                            <div className="absolute inset-x-0 top-8 h-1 bg-yellow-200 rounded-full mx-4 opacity-30"></div>
                        </div>

                        {/* Book spine */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 bg-purple-700 rounded-l-lg"></div>

                        {/* Magic wand */}
                        <motion.div
                            className="absolute -right-8 -top-8"
                            animate={{
                                rotate: [0, 15, 0, -15, 0],
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Wand2 className="h-12 w-12 text-yellow-300 drop-shadow-[0_0_8px_rgba(255,255,0,0.7)]" />
                        </motion.div>
                    </motion.div>

                    {/* Floating magic particles */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                backgroundColor: colors[i % colors.length],
                                width: Math.random() * 10 + 5,
                                height: Math.random() * 10 + 5,
                            }}
                            initial={{
                                x: (Math.random() - 0.5) * 100,
                                y: (Math.random() - 0.5) * 100,
                                opacity: 0,
                            }}
                            animate={{
                                x: (Math.random() - 0.5) * 100,
                                y: (Math.random() - 0.5) * 100,
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                            }}
                            transition={{
                                duration: Math.random() * 2 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Sparkles icon that pulses */}
                    <motion.div
                        className="absolute"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Sparkles className="h-12 w-12 text-yellow-200 drop-shadow-[0_0_8px_rgba(255,255,0,0.7)]" />
                    </motion.div>
                </div>

                {/* Loading message with animated dots */}
                <motion.div
                    className="text-center"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <p className="text-2xl font-bold text-white text-center mb-2">
                        {message}
                        {dots}
                    </p>
                    <p className="text-lg text-yellow-200">
                        What Will Happen Next? 🧙‍♂️
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}
