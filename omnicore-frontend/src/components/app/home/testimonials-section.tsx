"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "OmniCore has completely transformed how we manage our team projects. The analytics dashboard is a game-changer!",
    author: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    avatar: "/avatars/avatar-1.png",
  },
  {
    quote:
      "We've been able to cut our project completion time by 40% since implementing OmniCore across our organization.",
    author: "Michael Chen",
    role: "CTO, GrowthWave",
    avatar: "/avatars/avatar-2.png",
  },
  {
    quote:
      "The customer support team is exceptional. They've been responsive and helpful at every step of our journey.",
    author: "Emily Rodriguez",
    role: "Operations Director, Elevate Solutions",
    avatar: "/avatars/avatar-3.png",
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full  px-2 lg:px-10 py-12 md:py-24 lg:py-32">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm border border-primary/30 text-primary relative overflow-hidden">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span className="relative z-10">Testimonials</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Trusted by innovators worldwide
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              See what our customers are saying about their experience with
              OmniCore.
            </p>
          </div>
        </div>
        <div className="grid max-w-6xl mx-auto gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 fill-primary text-primary"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>{" "}
                <blockquote className="text-lg font-semibold leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
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
                    className="h-6 w-6 text-foreground"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <div className="grid gap-0.5 text-sm">
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
