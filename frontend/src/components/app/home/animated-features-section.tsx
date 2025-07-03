"use client";

import { motion } from "framer-motion";

export function AnimatedFeaturesSection() {
  const features = [
    {
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
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
          <path d="M18 14h-8"></path>
          <path d="M15 18h-5"></path>
          <path d="M10 6h8v4h-8V6Z"></path>
        </svg>
      ),
      title: "Advanced Sales Tracking",
      description:
        "Monitor sales in real-time across all locations. Analyze performance metrics, track revenue trends, and identify growth opportunities with intuitive visualizations.",
    },
    {
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
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      ),
      title: "Multi-Tenant Architecture",
      description:
        "Easily manage multiple restaurant locations from a single dashboard. Each tenant gets their own secure environment while sharing the same platform infrastructure.",
    },
    {
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
          <path d="m7.5 4.27 9 5.15"></path>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          <path d="m3.3 7 8.7 5 8.7-5"></path>
          <path d="M12 22V12"></path>
        </svg>
      ),
      title: "Inventory Management",
      description:
        "Keep track of stock levels, get low inventory alerts, and automate reordering. Integrate with your POS system for real-time stock updates as products are sold.",
    },
    {
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
      title: "Table Management",
      description:
        "Visualize your restaurant floor plan, track table status, and optimize seating arrangements. Handle reservations and walk-ins efficiently with our intuitive interface.",
    },
    {
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
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          <path d="M12 5v16"></path>
          <path d="M5 12h14"></path>
        </svg>
      ),
      title: "Integrated POS & Payment",
      description:
        "Process orders and payments seamlessly with our modern POS system. Support multiple payment methods including credit cards, mobile payments, and cash handling.",
    },
    {
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
      title: "Dynamic Menu Management",
      description:
        "Create and update your menus with ease. Organize items into categories, set pricing, add images, and display nutritional information to enhance customer experience.",
    },
  ];

  return (
    <section className="w-full  px-2 lg:px-10 py-16 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent z-0"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
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
              <span className="relative z-10">Core Features</span>
            </motion.div>
            <motion.h2
              className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Powerful Tools for Modern Restaurants
            </motion.h2>
            <motion.p
              className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              OmniCore provides a comprehensive suite of features designed
              specifically for the restaurant industry. From POS and inventory
              to staff management and analytics, we&apos;ve got you covered.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col p-6 space-y-4 rounded-xl border bg-background/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="p-2 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
                whileHover={{
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 },
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
