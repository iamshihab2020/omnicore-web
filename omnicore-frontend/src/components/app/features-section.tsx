"use client";

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need to succeed
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides all the tools you need to streamline your
              workflow, increase productivity, and grow your business.
            </p>
          </div>
        </div>
        <div className="grid max-w-6xl mx-auto items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="grid gap-6">
            <div className="grid gap-2 p-5 rounded-lg hover:bg-background/60 transition-colors">
              <h3 className="text-xl font-bold">Powerful Analytics</h3>
              <p className="text-muted-foreground">
                Gain actionable insights from your data with our advanced
                analytics tools. Track key metrics, monitor performance, and
                make data-driven decisions.
              </p>
            </div>
            <div className="grid gap-2 p-5 rounded-lg hover:bg-background/60 transition-colors">
              <h3 className="text-xl font-bold">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work seamlessly with your team in real-time. Share files, assign
                tasks, and communicate effectively in one centralized platform.
              </p>
            </div>
            <div className="grid gap-2 p-5 rounded-lg hover:bg-background/60 transition-colors">
              <h3 className="text-xl font-bold">Workflow Automation</h3>
              <p className="text-muted-foreground">
                Automate repetitive tasks and streamline your processes. Create
                custom workflows that save time and reduce errors.
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2 p-5 rounded-lg hover:bg-background/60 transition-colors">
              <h3 className="text-xl font-bold">Seamless Integrations</h3>
              <p className="text-muted-foreground">
                Connect with your favorite tools and services. Our platform
                integrates with over 100+ apps to enhance your productivity.
              </p>
            </div>
            <div className="grid gap-2 p-5 rounded-lg hover:bg-background/60 transition-colors">
              <h3 className="text-xl font-bold">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Protect your data with enterprise-grade security features.
                End-to-end encryption, role-based access control, and compliance
                with industry standards.
              </p>
            </div>
            <div className="grid gap-2 p-5 rounded-lg hover:bg-background/60 transition-colors">
              <h3 className="text-xl font-bold">24/7 Support</h3>
              <p className="text-muted-foreground">
                Get help whenever you need it. Our dedicated support team is
                available 24/7 to answer your questions and resolve issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
