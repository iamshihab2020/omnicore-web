"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export function AnimatedStatsSection() {
  const stats = [
    {
      value: 1000,
      prefix: "+",
      label: "Restaurants Served",
      description: "Trusted by restaurants worldwide",
    },
    {
      value: 25,
      suffix: "%",
      label: "Increase in Efficiency",
      description: "Average improvement reported by users",
    },
    {
      value: 15,
      suffix: "M",
      label: "Orders Processed",
      description: "And growing every day",
    },
    {
      value: 99.9,
      suffix: "%",
      label: "System Uptime",
      description: "Reliable service you can count on",
    },
  ];

  return (
    <section className="w-full  px-2 lg:px-10 py-16 md:py-24 lg:py-32 bg-primary/5 relative overflow-hidden">
      {/* Animated patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0 opacity-[0.03]"
        >
          <pattern
            id="gridPattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        </svg>

        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">
            OmniCore by the Numbers
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Our platform is making a real difference for restaurants around the
            world.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-background/80 backdrop-blur-sm border shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
              >
                {stat.prefix && <span>{stat.prefix}</span>}
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                  enableScrollSpy
                  scrollSpyOnce
                />
                {stat.suffix && <span>{stat.suffix}</span>}
              </motion.div>
              <h3 className="text-xl font-semibold mb-1">{stat.label}</h3>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
