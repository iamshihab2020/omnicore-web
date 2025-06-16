"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Set Up Your Restaurant Profile",
      description:
        "Create your restaurant profile, customize settings, and add your branding. Set up your multi-tenant environment if you manage multiple locations.",
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
          className="h-10 w-10"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      title: "Configure Your Menu",
      description:
        "Add your menu items, organize them into categories, set prices, and upload images. Easily manage specials and update your offerings anytime.",
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
          className="h-10 w-10"
        >
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
          <line x1="6" x2="18" y1="17" y2="17"></line>
        </svg>
      ),
    },
    {
      title: "Set Up Tables & POS",
      description:
        "Configure your restaurant floor plan, define your tables, and set up your point of sale system to start taking orders and processing payments.",
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
          className="h-10 w-10"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
      ),
    },
    {
      title: "Start Taking Orders",
      description:
        "Begin accepting and managing orders through the POS system. Process payments, track sales, and manage your restaurant operations seamlessly.",
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
          className="h-10 w-10"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <path d="M14 2v6h6"></path>
          <path d="M16 13H8"></path>
          <path d="M16 17H8"></path>
          <path d="M10 9H8"></path>
        </svg>
      ),
    },
    {
      title: "Analyze & Optimize",
      description:
        "Review your performance metrics, gain insights from analytics dashboards, and make data-driven decisions to optimize your restaurant operations.",
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
          className="h-10 w-10"
        >
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full  px-2 lg:px-10 py-16 md:py-24 lg:py-32 relative overflow-hidden bg-muted/20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 opacity-5"
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle
            cx="200"
            cy="200"
            r="150"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="10 10"
          />
          <circle
            cx="200"
            cy="200"
            r="100"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
        </svg>
        <svg
          className="absolute bottom-0 right-0 opacity-5"
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle
            cx="200"
            cy="200"
            r="150"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="10 10"
          />
          <circle
            cx="200"
            cy="200"
            r="100"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
        </svg>
      </div>

      <div className="container relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-4 max-w-4xl mx-auto">
            {" "}
            <motion.div
              className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm border border-primary/30 text-primary font-medium relative overflow-hidden"
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
              <span className="relative z-10">Getting Started</span>
            </motion.div>
            <motion.h2
              className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              How OmniCore Works
            </motion.h2>
            <motion.p
              className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Get up and running with our simple step-by-step process. OmniCore
              makes restaurant management easy with an intuitive setup and
              powerful tools.
            </motion.p>
          </div>
        </motion.div>

        {/* Interactive steps */}
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Step navigation */}
          <motion.div
            className="flex flex-col space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex items-start p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  activeStep === index
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-muted/60"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                    activeStep === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span>{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      activeStep === index ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      activeStep === index
                        ? "text-muted-foreground"
                        : "text-muted-foreground/70"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated visual */}
          <div className="relative flex items-center justify-center">
            <div className="w-full h-[350px] rounded-xl bg-gradient-to-br from-muted/60 to-background border relative overflow-hidden shadow-lg">
              {/* Animated dots background */}
              <svg
                className="absolute inset-0 w-full h-full"
                width="100%"
                height="100%"
              >
                <pattern
                  id="step-pattern"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="2"
                    cy="2"
                    r="1"
                    fill="currentColor"
                    className="text-muted-foreground/10"
                  />
                </pattern>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#step-pattern)"
                />
              </svg>

              {/* Center icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                key={activeStep} // Force re-render when step changes
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-32 h-32 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center text-primary p-6">
                  {steps[activeStep].icon}
                </div>
              </motion.div>

              {/* Animated rings */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.2, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-48 h-48 rounded-full border-2 border-dashed border-primary/20" />
              </motion.div>

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1.2, 1.4, 1.2],
                  opacity: [0.4, 0.1, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="w-64 h-64 rounded-full border-2 border-dashed border-primary/10" />
              </motion.div>

              {/* Step label */}
              <motion.div
                className="absolute bottom-8 left-0 right-0 text-center"
                key={`label-${activeStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium">
                  Step {activeStep + 1}: {steps[activeStep].title}
                </span>
              </motion.div>
            </div>

            {/* Navigation buttons */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 -mb-6">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full shadow-lg bg-background"
                onClick={() =>
                  setActiveStep((prev) =>
                    prev > 0 ? prev - 1 : steps.length - 1
                  )
                }
              >
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
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full shadow-lg bg-background"
                onClick={() =>
                  setActiveStep((prev) =>
                    prev < steps.length - 1 ? prev + 1 : 0
                  )
                }
              >
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
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8"
          >
            Start Your Setup Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
