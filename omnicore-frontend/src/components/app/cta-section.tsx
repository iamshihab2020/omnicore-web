"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-4xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to transform your business?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Join thousands of companies that trust OmniCore to power their
              operations. Start your free trial today and see the difference.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 py-4">
            <Button size="lg" className="px-8" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  );
}
