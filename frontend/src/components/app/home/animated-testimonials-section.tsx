"use client";

import { motion } from "framer-motion";

export function AnimatedTestimonialsSection() {
  const testimonials = [
    {
      quote:
        "OmniCore transformed how we manage our restaurant chain. The multi-tenant feature allows us to oversee all locations from one dashboard, saving hours of administrative work.",
      author: "Michael Rodriguez",
      role: "Operations Director, Bistro Group",
      image: "/avatars/testimonial-1.jpg",
    },
    {
      quote:
        "The menu management system is incredibly intuitive. We can update our offerings in seconds, and the changes are reflected immediately across all our digital platforms.",
      author: "Sarah Johnson",
      role: "Restaurant Owner, Flavor Haven",
      image: "/avatars/testimonial-2.jpg",
    },
    {
      quote:
        "The POS and payment processing integration is seamless. We've seen a 30% reduction in checkout time, which means happier customers and more table turnover.",
      author: "David Chen",
      role: "General Manager, Urban Plate",
      image: "/avatars/testimonial-3.jpg",
    },
  ];

  return (
    <section className="w-full  px-2 lg:px-10 py-16 md:py-24 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Quote decorations */}
      <motion.div
        className="absolute top-10 left-10 text-9xl text-primary/10 font-serif"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        &ldquo;
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-9xl text-primary/10 font-serif"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        &rdquo;
      </motion.div>

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {" "}
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
            <span className="relative z-10">Testimonials</span>
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">
            Trusted by Restaurant Professionals
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Hear from the restaurateurs who have transformed their operations
            with OmniCore.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="flex flex-col p-6 rounded-xl bg-background/90 backdrop-blur-sm border shadow-md h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.2, duration: 0.6 }}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="flex-1 mb-6">
                <motion.p
                  className="italic text-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.2, duration: 0.6 }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </motion.p>
              </div>
              <div className="flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full border-2 border-primary/20">
                  <div className="w-full h-full bg-primary/20"></div>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
