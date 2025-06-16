"use client";

import {
  motion,
  useMotionValue,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function TechStackSection() {
  const [activeStack, setActiveStack] = useState<number | null>(null);
  const [expandedStack, setExpandedStack] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse position tracking for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Transform mouse position for 3D rotation effect
  const rotateX = useTransform(smoothY, [0, 300], [5, -5]);
  const rotateY = useTransform(smoothX, [0, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Handle scrolling expanded card into view
  useEffect(() => {
    if (expandedStack !== null && sectionRef.current) {
      const yOffset = -100;
      const element = sectionRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [expandedStack]);

  const techStacks = [
    {
      name: "Modern Frontend",
      description:
        "Built with Next.js, React, TypeScript, and Tailwind CSS for a responsive and performant user experience.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 16 4-4-4-4"></path>
          <path d="m6 8-4 4 4 4"></path>
          <path d="m14.5 4-5 16"></path>
        </svg>
      ),
      color: "from-blue-500 to-cyan-500",
      items: [
        {
          name: "Next.js",
          description: "React framework for production-ready applications",
        },
        {
          name: "React",
          description: "JavaScript library for building user interfaces",
        },
        {
          name: "TypeScript",
          description: "Strongly typed programming language",
        },
        {
          name: "Tailwind CSS",
          description: "Utility-first CSS framework",
        },
        {
          name: "Framer Motion",
          description: "Production-ready animation library",
        },
      ],
      additionalInfo:
        "Our frontend technology stack is carefully selected to provide the best developer experience while ensuring high performance and accessibility for end users.",
    },
    {
      name: "Robust Backend",
      description:
        "Powered by Django REST Framework for a scalable, secure and maintainable API architecture.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" x2="6.01" y1="6" y2="6"></line>
          <line x1="6" x2="6.01" y1="18" y2="18"></line>
        </svg>
      ),
      color: "from-green-500 to-emerald-500",
      items: [
        {
          name: "Django",
          description: "High-level Python web framework",
        },
        {
          name: "Python",
          description: "Versatile programming language",
        },
        {
          name: "REST API",
          description: "RESTful architecture for API design",
        },
        {
          name: "PostgreSQL",
          description: "Advanced open source database",
        },
        {
          name: "Redis",
          description: "In-memory data structure store",
        },
      ],
      additionalInfo:
        "Our backend architecture is designed for scalability and security, handling high loads while maintaining data integrity and fast response times.",
    },
    {
      name: "Advanced Security",
      description:
        "Comprehensive security with JWT authentication, role-based access control, and data encryption.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      color: "from-red-500 to-orange-500",
      items: [
        {
          name: "JWT Authentication",
          description: "Secure token-based authentication",
        },
        {
          name: "Role-Based Access",
          description: "Granular permission control system",
        },
        {
          name: "Data Encryption",
          description: "End-to-end encryption for sensitive data",
        },
        {
          name: "HTTPS",
          description: "Secure communication protocol",
        },
        {
          name: "CORS Protection",
          description: "Cross-origin resource sharing security",
        },
      ],
      additionalInfo:
        "Security is at the core of OmniCore. Our multi-layered approach ensures data protection, user privacy, and compliance with industry standards.",
    },
    {
      name: "Infrastructure",
      description:
        "Deployed on reliable cloud infrastructure with containerization for consistent environments.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
          <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"></path>
          <path d="M9 3v4"></path>
          <path d="M15 3v4"></path>
        </svg>
      ),
      color: "from-purple-500 to-violet-500",
      items: [
        {
          name: "Docker",
          description: "Containerization platform",
        },
        {
          name: "Kubernetes",
          description: "Container orchestration system",
        },
        {
          name: "CI/CD Pipeline",
          description: "Automated testing and deployment",
        },
        {
          name: "Cloud Hosting",
          description: "Scalable cloud infrastructure",
        },
        {
          name: "Microservices",
          description: "Modular service architecture",
        },
      ],
      additionalInfo:
        "Our infrastructure is built for reliability, scalability, and ease of maintenance, ensuring high availability and performance for all our customers.",
    },
  ];
  return (
    <section
      className="w-full  px-2 lg:px-10 py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 8 0 L 0 0 0 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
              <linearGradient
                id="techGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-primary)"
                  stopOpacity="0.1"
                />
                <stop
                  offset="50%"
                  stopColor="var(--color-secondary)"
                  stopOpacity="0.05"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity="0.1"
                />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>{" "}
        {/* Animated floating orbs */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Additional animated elements */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container relative z-10">
        {" "}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Enhanced badge */}
          <motion.div
            className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm border border-primary/30 text-primary font-medium mb-4 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10">Technology Stack</span>
          </motion.div>

          {/* Animated heading */}
          <motion.h2
            className="text-3xl font-bold tracking-tighter md:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Built with Modern Technology
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            OmniCore is powered by the latest technologies to provide a robust,
            secure, and scalable solution. Explore our tech stack below.
          </motion.p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {techStacks.map((stack, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onMouseEnter={() => setActiveStack(index)}
              onMouseLeave={() => setActiveStack(null)}
              onMouseMove={handleMouseMove}
            >
              <motion.div
                className={`rounded-xl border bg-background/30 backdrop-blur-sm p-6 flex flex-col relative z-10 overflow-hidden transition-all duration-300 ${
                  activeStack === index ? "shadow-lg border-primary/20" : ""
                } ${
                  expandedStack === index
                    ? "absolute inset-x-0 z-50 shadow-2xl border-primary/30"
                    : "h-[250px]"
                }`}
                layoutId={`tech-card-${index}`}
                whileHover={{
                  y: expandedStack === index ? 0 : -5,
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  transition: { duration: 0.3 },
                }}
                style={{
                  rotateX: expandedStack === index ? 0 : rotateX,
                  rotateY: expandedStack === index ? 0 : rotateY,
                  transformPerspective: 1000,
                }}
                onClick={() =>
                  setExpandedStack(expandedStack === index ? null : index)
                }
              >
                {" "}
                {/* Enhanced background gradient with animation */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br opacity-0 ${stack.color}`}
                  animate={{
                    opacity:
                      activeStack === index || expandedStack === index
                        ? 0.15
                        : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                {/* Animated pattern background */}
                {(activeStack === index || expandedStack === index) && (
                  <motion.div
                    className="absolute inset-0 opacity-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.05 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <pattern
                        id={`tech-pattern-${index}`}
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                      </pattern>
                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill={`url(#tech-pattern-${index})`}
                      />
                    </svg>
                  </motion.div>
                )}
                <div className="flex items-center justify-between mb-4">
                  {" "}
                  {/* Enhanced animated icon */}
                  <motion.div
                    className={`p-3 rounded-lg bg-primary/10 w-fit relative overflow-hidden`}
                    whileHover={{
                      scale: 1.05,
                    }}
                    animate={{
                      boxShadow:
                        expandedStack === index
                          ? [
                              "0 0 0 rgba(0,0,0,0)",
                              "0 0 20px rgba(var(--color-primary-rgb), 0.3)",
                              "0 0 0 rgba(0,0,0,0)",
                            ]
                          : "none",
                    }}
                    transition={{
                      repeat: expandedStack === index ? Infinity : 0,
                      duration: 2,
                    }}
                  >
                    {/* Glow effect behind icon */}
                    {(activeStack === index || expandedStack === index) && (
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.2, 0.3, 0.2],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    <motion.div
                      className="w-8 h-8 text-primary relative z-10"
                      animate={{
                        rotate: expandedStack === index ? [0, 5, 0, -5, 0] : 0,
                      }}
                      transition={{
                        repeat: expandedStack === index ? Infinity : 0,
                        duration: 5,
                        ease: "easeInOut",
                      }}
                    >
                      {stack.icon}
                    </motion.div>
                  </motion.div>
                  {/* Expand/collapse button */}
                  {expandedStack === index ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedStack(null);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m5 11 7-7 7 7M5 19l7-7 7 7" />
                      </svg>
                      <span className="sr-only">Collapse</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedStack(index);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 20h10M7 4h10M4 12h7m6 0h3" />
                      </svg>
                      <span className="sr-only">Expand</span>
                    </Button>
                  )}
                </div>
                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{stack.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {stack.description}
                </p>
                {/* Tech items */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {expandedStack !== index
                    ? stack.items.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-full border ${
                            activeStack === index
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "bg-muted/50 border-muted text-muted-foreground"
                          }`}
                        >
                          {item.name}
                        </span>
                      ))
                    : null}

                  {expandedStack === index && (
                    <motion.div
                      className="w-full pt-4 space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {" "}
                      {stack.items.map((item, idx) => (
                        <motion.div
                          key={idx}
                          className="border-b border-muted pb-3 last:border-0 hover:bg-muted/30 rounded-md p-2 -mx-2 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          onMouseEnter={() => setHoveredItem(item.name)}
                          onMouseLeave={() => setHoveredItem(null)}
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <motion.div className="flex items-center gap-2">
                            <motion.div
                              className="h-2 w-2 rounded-full bg-primary"
                              animate={{
                                scale:
                                  hoveredItem === item.name ? [1, 1.5, 1] : 1,
                              }}
                              transition={{
                                repeat:
                                  hoveredItem === item.name ? Infinity : 0,
                                duration: 1.5,
                              }}
                            />
                            <h4 className="font-medium text-primary">
                              {item.name}
                            </h4>
                          </motion.div>
                          <p className="text-sm text-muted-foreground mt-1 ml-4">
                            {item.description}
                          </p>
                        </motion.div>
                      ))}
                      <motion.div
                        className="mt-6 pt-4 border-t border-muted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <p className="text-sm text-muted-foreground">
                          {stack.additionalInfo}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}

                  {expandedStack !== index && stack.items.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full border bg-muted/50 border-muted text-muted-foreground">
                      +{stack.items.length - 3} more
                    </span>
                  )}
                </div>
                {/* Animated spotlight effect */}
                <AnimatePresence>
                  {(activeStack === index || expandedStack === index) && (
                    <motion.div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: `radial-gradient(circle at 50% 50%, var(--color-primary), transparent 40%)`,
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Card reflection effect */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent opacity-0 z-0 transform scale-y-[0.3] translate-y-1 filter blur-md"
                animate={{ opacity: activeStack === index ? 0.1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>{" "}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button variant="outline" className="group relative overflow-hidden">
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-0 group-hover:opacity-100"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />

            {/* Animated dots showing progress */}
            <motion.div className="absolute -bottom-1 left-0 right-0 flex justify-center space-x-1.5 pointer-events-none">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="w-1.5 h-1.5 rounded-full bg-primary/60"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: dot * 0.3,
                  }}
                />
              ))}
            </motion.div>

            <span className="relative z-10">
              Learn more about our technology
            </span>
            <motion.span
              className="inline-block ml-2 relative z-10"
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              &rarr;
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
