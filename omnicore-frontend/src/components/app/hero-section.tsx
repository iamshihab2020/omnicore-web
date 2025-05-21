"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
      <div className="container">
        <div className="flex flex-col items-center space-y-6 text-center">
          {" "}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Supercharge Your Business with OmniCore
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              The all-in-one SaaS platform that helps you manage, analyze, and
              grow your business effortlessly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 py-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>
          <div className="grid max-w-6xl w-full items-center gap-6 py-12 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
              <div className="rounded-full border p-2 bg-primary-foreground">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground text-center">
                Get actionable insights with our powerful analytics dashboard.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
              <div className="rounded-full border p-2 bg-primary-foreground">
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
                  className="h-6 w-6 text-primary"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Advanced Security</h3>
              <p className="text-sm text-muted-foreground text-center">
                Your data is protected with enterprise-grade security measures.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
              <div className="rounded-full border p-2 bg-primary-foreground">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Seamless Integration</h3>
              <p className="text-sm text-muted-foreground text-center">
                Connects with all your favorite tools and services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
