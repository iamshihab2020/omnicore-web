/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small teams just getting started",
    price: "$29",
    billing: "per month",
    features: [
      "Up to 5 team members",
      "10GB storage",
      "Basic analytics",
      "24/7 support",
      "Standard integrations",
    ],
    cta: "Get Started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing teams and businesses",
    price: "$79",
    billing: "per month",
    features: [
      "Up to 20 team members",
      "50GB storage",
      "Advanced analytics",
      "24/7 priority support",
      "All integrations",
      "Custom workflows",
      "API access",
    ],
    cta: "Get Started",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "Advanced features for large organizations",
    price: "$199",
    billing: "per month",
    features: [
      "Unlimited team members",
      "500GB storage",
      "Enterprise analytics",
      "Dedicated support manager",
      "All integrations",
      "Custom workflows",
      "API access",
      "SSO authentication",
      "Advanced security",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="w-full  px-2 lg:px-10 py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4 max-w-4xl mx-auto">
            {" "}
            <motion.div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm border border-primary/30 text-primary relative overflow-hidden">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10">Pricing</span>
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Choose the perfect plan for your team's needs. All plans include a
              14-day free trial.
            </p>
          </div>
        </div>
        <div className="grid max-w-6xl mx-auto gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md",
                plan.highlighted &&
                  "border-primary relative before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-primary before:content-[''] before:z-[-1] before:-m-[2px]"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">
                    {plan.billing}
                  </span>
                </div>
                <ul className="grid gap-3 text-sm my-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
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
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-4">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
