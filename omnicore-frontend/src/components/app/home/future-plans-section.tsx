"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const futurePlans = [
  {
    title: "Advanced AI-Powered Analytics",
    description:
      "Gain deeper insights into your restaurant's performance with our upcoming AI-driven analytics tools. Predict sales trends, optimize inventory, and receive actionable recommendations.",
    longDescription:
      "Our AI analytics engine will transform your restaurant data into actionable business intelligence. From predicting peak hours and seasonal trends to optimizing inventory and reducing waste, this system delivers insights that directly impact your bottom line. Features include customizable dashboards, automated reports, and real-time alerts when metrics deviate from expected patterns.",
    keyFeatures: [
      "Predictive sales forecasting",
      "Inventory optimization",
      "Staff scheduling recommendations",
      "Menu performance analysis",
      "Customer behavior patterns",
    ],
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
        className="w-10 h-10"
      >
        <path d="M12 2v8"></path>
        <path d="M12 18v4"></path>
        <path d="M4.93 10.93 2 8l2.93-2.93"></path>
        <path d="M19.07 10.93 22 8l-2.93-2.93"></path>
        <path d="M22 16.93 19.07 14l-2.93 2.93"></path>
        <path d="M4.93 14 2 16.93 4.93 19.86"></path>
        <path d="M10.93 21.07 14 24l2.93-2.93"></path>
        <path d="M18 12a6 6 0 0 0-6-6"></path>
      </svg>
    ),
    color: "from-blue-600 to-cyan-500",
    estimatedRelease: "Q3 2025",
    featured: true,
    progress: 35,
    status: "In Development",
  },
  {
    title: "Enhanced Customer Relationship Management (CRM)",
    description:
      "Build stronger customer loyalty with new CRM features, including targeted marketing, personalized offers, and customer feedback analytics.",
    longDescription:
      "Our enhanced CRM system will help you build stronger relationships with your customers through personalized experiences and data-driven insights. Track customer preferences, purchase history, and feedback to create targeted marketing campaigns that drive repeat business and increase customer lifetime value.",
    keyFeatures: [
      "Customer segmentation",
      "Loyalty program management",
      "Automated marketing campaigns",
      "Feedback collection and analysis",
      "Personalized recommendations",
    ],
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
        className="w-10 h-10"
      >
        <path d="M17 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12Z"></path>
        <path d="M12 9h.01"></path>
        <path d="M12 13h.01"></path>
        <path d="M2.5 6.5C4.5 8.5 9 12 9 12"></path>
        <path d="M21.5 6.5C19.5 8.5 15 12 15 12"></path>
      </svg>
    ),
    color: "from-purple-600 to-blue-500",
    estimatedRelease: "Q4 2025",
    progress: 20,
    status: "Planning Phase",
  },
  {
    title: "Expanded Integrations Ecosystem",
    description:
      "Connect Omnicore with more of your favorite tools and services for a seamless workflow. New integrations with accounting, delivery, and supply chain platforms.",
    longDescription:
      "Our expanded integrations ecosystem will connect OmniCore with the best tools in the industry, creating a seamless workflow across your entire operations. From accounting software and delivery platforms to supply chain management and HR systems, these integrations will eliminate data silos and manual transfers, saving time and reducing errors.",
    keyFeatures: [
      "QuickBooks & Xero accounting integration",
      "Major delivery platform connections",
      "Supply chain management tools",
      "HR and payroll system integration",
      "Custom API access",
    ],
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
        className="w-10 h-10"
      >
        <path d="M12 3v12"></path>
        <path d="m8 11 4 4 4-4"></path>
        <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
      </svg>
    ),
    color: "from-emerald-600 to-green-500",
    estimatedRelease: "Q1 2026",
    progress: 15,
    status: "Research",
  },
  {
    title: "Mobile App for Owners and Managers",
    description:
      "Manage your restaurant on the go with a dedicated mobile application. Monitor performance, approve orders, and respond to alerts from anywhere.",
    longDescription:
      "Our mobile application will put the power of OmniCore in your pocket, allowing you to manage your restaurant from anywhere at any time. Get real-time alerts, approve orders, view reports, and make critical decisions on the go. Available for iOS and Android, the app will feature an intuitive interface designed specifically for restaurant owners and managers.",
    keyFeatures: [
      "Real-time sales dashboard",
      "Inventory alerts",
      "Staff management",
      "Order approvals",
      "Performance analytics",
    ],
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
        className="w-10 h-10"
      >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
        <path d="M12 18h.01"></path>
      </svg>
    ),
    color: "from-orange-600 to-amber-500",
    estimatedRelease: "Q2 2026",
    featured: true,
    progress: 10,
    status: "Concept",
  },
  {
    title: "Smart Inventory Management",
    description:
      "Utilize IoT sensors and predictive analytics to automate inventory tracking and reduce waste with real-time monitoring and alerts.",
    longDescription:
      "Our Smart Inventory Management system will revolutionize how restaurants track and manage their stock. Using IoT sensors, weight platforms, and computer vision, the system automatically tracks inventory levels in real-time, predicts when items need to be reordered, and helps reduce waste through advanced shelf-life tracking and usage pattern analysis.",
    keyFeatures: [
      "Automated stock counting",
      "Predictive purchasing",
      "Waste reduction tools",
      "Supplier management portal",
      "Expiration date tracking",
    ],
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
        className="w-10 h-10"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 4v16" />
        <path d="M2 12h20" />
      </svg>
    ),
    color: "from-teal-600 to-emerald-500",
    estimatedRelease: "Q3 2026",
    progress: 5,
    status: "Research",
  },
];

export function FuturePlansSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [animatingGrid, setAnimatingGrid] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX);
    y.set(mouseY);
  };

  const rotateX = useTransform(y, [0, 300], [2, -2]);
  const rotateY = useTransform(x, [0, 300], [-2, 2]);

  // Function to handle card expansion
  const handleCardClick = (index: number) => {
    if (expandedCard === index) {
      setExpandedCard(null);
      setTimeout(() => setAnimatingGrid(false), 300);
    } else {
      setAnimatingGrid(true);
      setExpandedCard(index);
    }
  };

  useEffect(() => {
    // When a card is expanded, scroll it into view
    if (expandedCard !== null && sectionRef.current) {
      const yOffset = -100;
      const element = sectionRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [expandedCard]);

  // Determine grid columns based on expanded state
  const gridColsClass =
    expandedCard !== null
      ? "grid-cols-1"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

  return (
    <section
      className="py-16 md:py-24  px-2 lg:px-10 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 right-0 w-1/4 h-1/3 bg-gradient-to-br from-primary/10 to-transparent blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-gradient-to-tr from-secondary/10 to-transparent blur-3xl rounded-full"></div>

      {/* Animated particles for background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 pointer-events-none"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {" "}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10">Interactive Roadmap</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              viewport={{ once: true }}
            >
              Future Plans & Innovations
            </motion.span>
          </h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            viewport={{ once: true }}
          >
            We&apos;re constantly innovating to bring you the best restaurant
            management experience. Explore our roadmap below and click on any
            feature to learn more.
          </motion.p>
        </motion.div>

        <motion.div
          className={`grid ${gridColsClass} gap-8`}
          layout
          transition={{ duration: 0.5 }}
        >
          {futurePlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative ${
                expandedCard !== null && expandedCard !== index ? "hidden" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              layout
              onMouseEnter={() => !animatingGrid && setActiveCard(index)}
              onMouseLeave={() => !animatingGrid && setActiveCard(null)}
              onMouseMove={handleMouseMove}
              onClick={() => !animatingGrid && handleCardClick(index)}
            >
              <motion.div
                className={`h-full rounded-lg border p-6 flex flex-col bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${
                  activeCard === index ? "shadow-lg" : ""
                } ${
                  expandedCard === index ? "cursor-pointer" : "cursor-pointer"
                }`}
                layout
                style={
                  activeCard === index && expandedCard !== index
                    ? {
                        rotateX: rotateX,
                        rotateY: rotateY,
                        transformPerspective: 1000,
                        transformStyle: "preserve-3d",
                      }
                    : {}
                }
                whileHover={{ y: expandedCard === index ? 0 : -5 }}
              >
                {/* Gradient background for hover */}
                <motion.div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-br ${plan.color}`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity:
                      expandedCard === index
                        ? 0.1
                        : activeCard === index
                        ? 0.05
                        : 0,
                  }}
                  layout
                />

                {/* Release and progress indicator */}
                <div className="flex justify-between items-start mb-4">
                  <motion.div
                    className={`p-2 rounded-lg bg-primary/10 ${
                      activeCard === index || expandedCard === index
                        ? "text-primary"
                        : ""
                    }`}
                    animate={{
                      scale:
                        expandedCard === index
                          ? [1, 1.1, 1]
                          : activeCard === index
                          ? [1, 1.05, 1]
                          : 1,
                      transition: {
                        repeat:
                          expandedCard === index || activeCard === index
                            ? Infinity
                            : 0,
                        duration: 2,
                      },
                    }}
                    layout
                  >
                    {plan.icon}
                  </motion.div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-medium rounded-full px-2.5 py-1 border border-muted bg-background/50">
                      {plan.estimatedRelease}
                    </span>
                    {expandedCard === index && (
                      <motion.div
                        className="w-full flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className="text-xs text-muted-foreground">
                          {plan.status}
                        </span>
                        <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${plan.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${plan.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <motion.div className="mb-4" layout>
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="text-xl font-semibold mb-1">{plan.title}</h3>
                    {plan.featured && (
                      <motion.span
                        className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                        }}
                      >
                        Featured
                      </motion.span>
                    )}
                  </div>

                  {expandedCard === index ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-muted-foreground mb-4">
                        {plan.longDescription}
                      </p>
                      <h4 className="font-semibold mb-2 text-sm">
                        Key Features:
                      </h4>{" "}
                      <div className="space-y-2 mb-6">
                        {plan.keyFeatures.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                          >
                            <span className="text-primary">
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
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </span>
                            {feature}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-muted-foreground">{plan.description}</p>
                  )}
                </motion.div>

                <motion.div
                  className="mt-auto flex justify-between items-center"
                  layout
                >
                  <Button
                    variant={expandedCard === index ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(index);
                    }}
                  >
                    {expandedCard === index ? "Close" : "Learn more"}
                    <span className="ml-1">
                      {expandedCard === index ? "×" : "→"}
                    </span>
                  </Button>

                  {expandedCard === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button variant="outline" size="sm" className="text-xs">
                        Request early access
                      </Button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Enhanced spotlight effect */}
                {(activeCard === index || expandedCard === index) && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: expandedCard === index ? 0.15 : 0.1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background:
                        expandedCard === index
                          ? `radial-gradient(circle at 50% 30%, white, transparent 70%)`
                          : `radial-gradient(circle at ${x.get()}px ${y.get()}px, white, transparent 70%)`,
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {expandedCard === null && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button asChild className="group relative overflow-hidden">
              <Link href="/roadmap">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0"
                  animate={{
                    x: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                View Full Product Roadmap
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
