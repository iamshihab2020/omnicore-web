"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function AnimatedHeroSectionNew() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full min-h-[90vh] overflow-hidden bg-gradient-to-b from-background via-background to-background/95 px-2 lg:px-10">
      {/* Abstract animated patterns - moved to lower z-index to ensure dashboard is visible */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
        <svg
          className="absolute w-full h-full opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 Q25,30 50,50 Q75,70 100,50 L100,100 L0,100 Z"
            fill="url(#gradient1)"
            initial={{ y: 20, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 0.3 } : { y: 20, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
        </svg>

        <motion.div
          className="absolute inset-0 mix-blend-overlay opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "30px 30px",
          }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={
            isLoaded ? { scale: 1, opacity: 0.2 } : { scale: 1.1, opacity: 0 }
          }
          transition={{ duration: 2 }}
        />
      </div>
      {/* Main content */}{" "}
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center min-h-[90vh] py-20">
          {/* Left side: Hero content */}
          <motion.div
            className="flex-1 lg:pr-12 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4 text-primary text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Restaurant Management Reimagined
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-7xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="block text-foreground">Introducing</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  OmniCore
                </span>
              </motion.h1>
              <motion.p
                className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                A unified platform that revolutionizes how restaurants operate,
                from point-of-sale to inventory, analytics, and multi-location
                management.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {" "}
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/80 text-primary-foreground font-medium px-8 py-6 rounded-xl text-lg"
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:border-primary text-muted-foreground hover:text-foreground font-medium px-8 py-6 rounded-xl text-lg"
                >
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {" "}
                {[
                  { value: "95%", label: "Faster Orders" },
                  { value: "+2.5x", label: "Revenue Growth" },
                  { value: "24/7", label: "Support" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right side: Interactive 3D dashboard visualization */}
          <motion.div
            className="flex-1 mt-12 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative">
              {" "}
              {/* Main dashboard display */}
              <motion.div
                className="relative z-10 bg-card/80 backdrop-blur-lg border border-border rounded-xl shadow-2xl overflow-hidden"
                initial={{ y: 20 }}
                animate={isLoaded ? { y: 0 } : { y: 20 }}
                transition={{ duration: 0.8 }}
              >
                {" "}
                {/* Dashboard header */}
                <div className="px-4 py-3 bg-card/90 border-b border-border flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    OmniCore Dashboard
                  </div>
                </div>
                {/* Dashboard content */}
                <div className="p-4">
                  {" "}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 rounded-lg bg-muted/30 border border-border flex items-center justify-center p-2 shadow-md"
                      >
                        <div className="w-full space-y-2">
                          <div className="h-2 rounded-full bg-primary/40 w-1/3"></div>
                          <div className="h-3 rounded-full bg-primary/50 w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Middle section - charts */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="h-36 rounded-lg bg-muted/30 border border-border p-3 shadow-md">
                      <div className="mb-2 h-2 w-1/4 bg-muted-foreground/50 rounded-full"></div>
                      <div className="h-full flex items-end justify-between pt-6">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-5 rounded-t-sm bg-chart-${
                              (i % 5) + 1
                            } ${
                              i % 3 === 0
                                ? "h-1/3"
                                : i % 3 === 1
                                ? "h-1/2"
                                : "h-2/3"
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="h-36 rounded-lg bg-muted/30 border border-border p-3 flex items-center justify-center shadow-md">
                      <div className="w-24 h-24 rounded-full border-8 border-primary/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-8 border-primary clip-path-70-percent"></div>
                        <div className="text-xl font-bold text-foreground">
                          70%
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Bottom section - table */}
                  <div className="rounded-lg bg-muted/30 border border-border p-3 shadow-md">
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-muted"></div>
                            <div className="h-2 w-20 bg-muted-foreground/50 rounded-full"></div>
                          </div>
                          <div className="h-2 w-10 bg-primary/60 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Decorative elements - improved visibility with higher z-index */}
              <motion.div
                className="absolute z-[-5] top-10 -left-10 w-full h-full rounded-full bg-primary/20 blur-3xl"
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 0.25 } : { opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.2 }}
              />
              <motion.div
                className="absolute z-[-5] -bottom-10 -right-10 w-3/4 h-3/4 rounded-full bg-secondary/20 blur-3xl"
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 0.25 } : { opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.4 }}
              />
              <motion.div
                className="absolute z-[-4] bottom-0 left-[25%] w-1/2 h-1/2 rounded-full bg-accent/20 blur-3xl"
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 0.3 } : { opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.6 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
      {/* Feature highlight section */}
      <div className="relative z-10 container mx-auto px-4 pb-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              ),
              title: "Smart POS",
              description:
                "Streamlined order processing with intuitive interfaces and quick payment options.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                  />
                </svg>
              ),
              title: "Inventory Control",
              description:
                "Real-time inventory tracking with automated alerts and reordering suggestions.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                  />
                </svg>
              ),
              title: "Advanced Analytics",
              description:
                "Comprehensive data insights to optimize menu performance and customer preferences.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              ),
              title: "Multi-Tenant",
              description:
                "Manage multiple locations with centralized control and individual customization.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Trusted by section */}
      <motion.div
        className="relative z-10 pb-20 container mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        {" "}
        <p className="text-muted-foreground uppercase text-sm font-medium tracking-wider mb-6">
          Trusted by leading restaurant brands
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-32 bg-muted/50 rounded shadow-sm"
            ></div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
