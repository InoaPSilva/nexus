"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface StartupAnimationProps {
  onComplete: () => void
}

export default function StartupAnimation({ onComplete }: StartupAnimationProps) {
  const [stage, setStage] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500), // Show logo elements
      setTimeout(() => setStage(2), 1500), // Animate assembly
      setTimeout(() => setStage(3), 2500), // Show text
      setTimeout(() => setStage(4), 3500), // Final pulse
      setTimeout(() => {
        setIsComplete(true)
        setTimeout(onComplete, 800)
      }, 4500),
    ]

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const planetVariants = {
    hidden: { scale: 0, rotate: 0, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  const raysVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3,
      },
    },
    rotate: {
      rotate: 360,
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  const ringVariants = {
    hidden: { scale: 0, rotateX: 90, opacity: 0 },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 0.8,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.6,
      },
    },
    orbit: {
      rotateZ: 360,
      transition: {
        duration: 8,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  const textVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  }

  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      background: [
        "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 1) 70%)",
        "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, rgba(0, 0, 0, 1) 70%)",
        "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 1) 70%)",
      ],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  }

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={backgroundVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="absolute inset-0 bg-black" />

          {/* Animated grid background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              animation: "grid-move 10s linear infinite",
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* Logo Container */}
            <div className="relative w-80 h-80 mb-8">
              {/* Planet Core */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                variants={planetVariants}
                initial="hidden"
                animate={stage >= 1 ? (stage >= 4 ? "pulse" : "visible") : "hidden"}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-white to-gray-300 rounded-full shadow-2xl" />
              </motion.div>

              {/* Rays */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                variants={raysVariants}
                initial="hidden"
                animate={stage >= 2 ? "rotate" : stage >= 1 ? "visible" : "hidden"}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 bg-gradient-to-t from-transparent to-white"
                    style={{
                      height: "60px",
                      left: "50%",
                      top: "-60px",
                      transformOrigin: "50% 60px",
                      transform: `translateX(-50%) rotate(${i * 45}deg)`,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                ))}
              </motion.div>

              {/* Orbital Rings */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                variants={ringVariants}
                initial="hidden"
                animate={stage >= 2 ? "orbit" : stage >= 1 ? "visible" : "hidden"}
              >
                {/* Outer Ring */}
                <div
                  className="absolute border-2 border-white border-opacity-60 rounded-full"
                  style={{
                    width: "200px",
                    height: "80px",
                    left: "-100px",
                    top: "-40px",
                    borderStyle: "solid",
                    borderWidth: "0 0 2px 0",
                    borderRadius: "50%",
                    transform: "rotateX(60deg)",
                  }}
                />

                {/* Inner Ring */}
                <div
                  className="absolute border-2 border-white border-opacity-40 rounded-full"
                  style={{
                    width: "160px",
                    height: "64px",
                    left: "-80px",
                    top: "-32px",
                    borderStyle: "solid",
                    borderWidth: "0 0 2px 0",
                    borderRadius: "50%",
                    transform: "rotateX(60deg)",
                  }}
                />
              </motion.div>

              {/* Orbiting Elements */}
              {stage >= 2 && (
                <>
                  {/* Small moon */}
                  <motion.div
                    className="absolute w-3 h-3 bg-white rounded-full"
                    style={{
                      left: "20px",
                      top: "50%",
                      transformOrigin: "140px 0",
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />

                  {/* Star */}
                  <motion.div
                    className="absolute text-white text-xl"
                    style={{
                      right: "10px",
                      top: "30%",
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    ✦
                  </motion.div>
                </>
              )}
            </div>

            {/* Text */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={stage >= 3 ? "visible" : "hidden"}
              className="flex space-x-2"
            >
              {["N", "E", "X", "U", "S"].map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="text-6xl font-bold text-white tracking-wider"
                  style={{
                    textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            {/* Loading indicator */}
            {stage >= 3 && (
              <motion.div
                className="mt-8 flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex space-x-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                <motion.span
                  className="text-white text-sm ml-4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  Initializing Nexus...
                </motion.span>
              </motion.div>
            )}
          </div>

          <style jsx>{`
            @keyframes grid-move {
              0% { transform: translate(0, 0); }
              100% { transform: translate(50px, 50px); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
