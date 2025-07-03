"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function AnimatedHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  // Track mouse movement for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = clientX / window.innerWidth - 0.5;
      const moveY = clientY / window.innerHeight - 0.5;
      setMousePosition({ x: moveX, y: moveY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Core features with modern icons
  const coreFeatures = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M3 3h18v18H3z"></path>
          <path d="M3 9h18"></path>
          <path d="M9 21V9"></path>
          <circle cx="5" cy="6" r="1"></circle>
          <circle cx="12" cy="6" r="1"></circle>
        </svg>
      ),
      title: "POS System",
      description:
        "Intuitive point-of-sale with fast checkout and payment processing",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
        </svg>
      ),
      title: "Menu Management",
      description:
        "Create and customize menus with dynamic pricing and categories",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: "Multi-Tenant",
      description:
        "Manage multiple locations from a single dashboard with role-based access",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      ),
      title: "Analytics",
      description:
        "Real-time sales data and performance insights with customizable reports",
    },
  ];

  // Floating elements that follow cursor
  const floatingElements = [
    { icon: "🍽️", x: -200, y: -100, delay: 0.1, scale: 1.2 },
    { icon: "📊", x: 200, y: -150, delay: 0.2, scale: 1.1 },
    { icon: "�", x: -150, y: 150, delay: 0.3, scale: 1 },
    { icon: "�", x: 180, y: 100, delay: 0.4, scale: 0.9 },
    { icon: "🍕", x: -50, y: -180, delay: 0.5, scale: 1.3 },
    { icon: "☕", x: 100, y: 180, delay: 0.6, scale: 1 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-background/95"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-20"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, var(--color-primary) 0%, transparent 50%)",
            }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Abstract shapes */}
        <motion.div
          className="absolute top-[10%] right-[15%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[10%] w-72 h-72 rounded-full bg-secondary/5 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMTEiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXY0aC0xdi00em0yIDBIMzRoMXYxaC0xdi0xem0tMi0yaDF2MWgtMXYtMXptNCAwSDMzdjFoMXYtMXptMCAySDMzdjRoMXYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]" />

        {/* Floating icons */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full flex items-center justify-center bg-background/80 backdrop-blur-sm border border-primary/10 shadow-lg p-2 text-2xl"
            initial={{
              x: element.x,
              y: element.y,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: element.x + mousePosition.x * 40,
              y: element.y + mousePosition.y * 40,
              opacity: 0.8,
              scale: element.scale,
            }}
            transition={{
              x: { duration: 1, ease: "easeOut" },
              y: { duration: 1, ease: "easeOut" },
              opacity: { delay: element.delay, duration: 0.8 },
              scale: { delay: element.delay, duration: 0.8 },
            }}
          >
            {element.icon}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20 pb-32">
        <motion.div
          className="flex flex-col items-center text-center"
          style={{
            opacity: headerOpacity,
            y: headerY,
          }}
        >
          {/* Highlight badge */}
          <motion.div
            className="inline-flex items-center mb-6 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="font-medium text-sm relative z-10">
              Future of Restaurant Management
            </span>
          </motion.div>

          {/* Main heading with animated gradient */}
          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
                  OmniCore
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </h1>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Complete Restaurant Management Solution
          </motion.h2>

          <motion.p
            className="max-w-3xl text-lg md:text-xl text-muted-foreground mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Transform your restaurant operations with our all-in-one platform
            that streamlines orders, payments, inventory, and analytics in a
            unified modern interface.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg rounded-xl"
              asChild
            >
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/20 hover:border-primary/40 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg rounded-xl"
              asChild
            >
              <Link href="/demo">Request Demo</Link>
            </Button>
          </motion.div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-background/60 backdrop-blur-md border border-border/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  borderColor: "var(--color-primary)",
                }}
              >
                <div className="bg-primary/10 rounded-lg w-14 h-14 flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mock UI visualization */}
        <motion.div
          className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-5xl mx-auto pointer-events-none"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <div className="relative rounded-t-3xl overflow-hidden shadow-2xl border border-border/40 backdrop-blur-xl">
            <div className="h-8 bg-background/80 border-b border-border/40 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="h-[300px] bg-background/50 backdrop-blur-xl">
              <div className="grid grid-cols-3 h-full">
                <div className="col-span-1 border-r border-border/40">
                  {/* Sidebar mock */}
                  <div className="p-4 border-b border-border/40">
                    <div className="h-8 bg-primary/10 rounded w-3/4"></div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="h-5 bg-primary/5 rounded w-full"></div>
                      <div className="h-5 bg-primary/10 rounded w-full"></div>
                      <div className="h-5 bg-primary/5 rounded w-full"></div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  {/* Main content mock */}
                  <div className="p-4 border-b border-border/40 flex items-center justify-between">
                    <div className="h-6 bg-primary/10 rounded w-1/3"></div>
                    <div className="h-8 bg-primary/20 rounded-lg w-24"></div>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-20 bg-primary/5 rounded"></div>
                      <div className="h-4 bg-primary/10 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-20 bg-secondary/5 rounded"></div>
                      <div className="h-4 bg-secondary/10 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
