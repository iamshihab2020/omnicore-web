"use client";

import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      delay: 0.2,
      duration: 0.8,
    },
  },
};

// Wave animation for the SVG paths
const waveVariants: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 0.3,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0.3 },
      opacity: { duration: 0.6 },
    },
  },
};

export default function Login() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Visual/Brand section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary/80 flex-col justify-center items-center text-primary-foreground p-8 relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute inset-0 bg-background/5 z-10"
        ></motion.div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {[...Array(10)].map((_, i) => (
                <motion.path
                  key={i}
                  d={`M${10 * i},100 Q${10 * i + 5},${
                    Math.random() * 50 + 25
                  } ${10 * i + 10},100`}
                  fill="none"
                  stroke="currentColor"
                  className="opacity-30"
                  strokeWidth="0.5"
                  initial="initial"
                  animate="animate"
                  variants={waveVariants}
                  transition={{
                    delay: i * 0.1,
                  }}
                />
              ))}
            </svg>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="z-20 text-center"
        >
          <motion.div
            variants={logoVariants}
            className="mb-8 relative w-48 h-48 mx-auto"
          >
            <Image
              src="/omnicore-icon.svg"
              alt="Omnicore Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold mb-2"
          >
            Omnicore
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-primary-foreground/80 mb-6"
          >
            Your complete business solution
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="hidden lg:block max-w-md text-center"
          >
            <p className="text-sm text-primary-foreground/70">
              Streamline your operations, manage inventory, and boost sales with
              our comprehensive platform.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - Form section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex items-center justify-center bg-background px-6 py-12"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="w-full max-w-md"
        >
          <LoginForm />
        </motion.div>
      </motion.div>
    </div>
  );
}
