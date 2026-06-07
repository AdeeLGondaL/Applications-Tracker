import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";

const painPoints = [
  {
    emoji: "🤔",
    problem: "Applied where?",
    detail: "You apply on LinkedIn, receive an interview invite for a different role, and can't remember which company or what you even applied for.",
  },
  {
    emoji: "📬",
    problem: "Inbox chaos",
    detail: "Rejection emails, interview invites, and that one company you meant to follow up with are all buried somewhere in your inbox.",
  },
  {
    emoji: "😔",
    problem: "Missed opportunities",
    detail: "You applied 3 weeks ago to a role that felt like the perfect fit. But you never followed up, and now someone else got it.",
  },
  {
    emoji: "📊",
    problem: "Spreadsheet hell",
    detail: "Tracking everything in Excel feels unprofessional, fragile, and you're constantly losing track of what's been updated.",
  },
];

const features = [
  {
    icon: "layout",
    title: "One central board",
    description: "See your entire job search at a glance. Drag applications from Applied → Interview → Offer. No messy spreadsheets.",
  },
  {
    icon: "bell",
    title: "Smart follow-up reminders",
    description: "Get nudged at the right time (7, 14, 21 days). Most people never follow up. The ones who do are 2-3x more likely to hear back.",
  },
  {
    icon: "trending-up",
    title: "Insights that matter",
    description: "See your response rates, which sources work best, and what timing gets results. Make data-driven decisions.",
  },
  {
    icon: "check-circle",
    title: "Compare offers clearly",
    description: "Rate what matters to you as you go. When decision time comes, the answer is already there. No 2am anxiety.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function LandingPage({ onGetStarted }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = window.location.origin;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {});
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-900/10">
      {/* Scroll Progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <img src="/Logo.png" alt="Applume" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Applume</span>
          </div>
          <Button onClick={onGetStarted} size="md">
            Get Started Free
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Stop tracking applications in spreadsheets
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="mt-6 text-5xl font-black text-gray-900 dark:text-white sm:text-6xl"
            >
              Never miss an opportunity <span className="text-emerald-600">again</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300"
            >
              You're applying to dozens of roles, trying to remember who you heard back from, and hoping you don't forget to follow up. <strong>Applume keeps it all in one calm, clear place.</strong>
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Button onClick={onGetStarted} size="lg" className="text-base px-8 py-3.5">
                Start Tracking Free
              </Button>
              <button
                onClick={handleCopy}
                className={`flex items-center justify-center gap-2 rounded-lg border px-6 py-3 font-semibold transition ${
                  copied
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
                {copied ? "Copied!" : "Copy link"}
              </button>
            </motion.div>

            {/* Stats under hero */}
            <motion.div 
              variants={itemVariants}
              className="mt-16 grid grid-cols-3 gap-4 sm:gap-8"
            >
              <div>
                <p className="text-3xl font-bold text-emerald-600">100%</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Free forever for up to 10 apps</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">2-3x</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">More responses with follow-ups</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">60s</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Setup in one minute</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="border-y border-gray-200 bg-white px-4 py-20 dark:border-gray-800 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              We've all been there
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            >
              Sound familiar? You're not alone. Here's what's broken about the current approach.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2"
          >
            {painPoints.map((point, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{point.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{point.problem}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{point.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              Your command center for job search
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            >
              Everything you need to land the job you want.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-2"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/20">
                  <Icon name={feature.icon} className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="border-y border-gray-200 bg-gray-50 px-4 py-20 dark:border-gray-800 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              Simple, honest pricing
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            >
              Start free. Upgrade when your search gets serious.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              {
                name: "Free",
                price: "$0",
                description: "For casual searches",
                features: ["Up to 10 applications", "Pipeline board view", "Basic stats", "Forever free"],
                cta: "Get started",
              },
              {
                name: "Pro",
                price: "$9.99",
                period: "/mo",
                description: "For active job seekers",
                features: ["Unlimited applications", "Smart follow-up reminders", "Advanced analytics", "Email automation", "Priority support"],
                cta: "Get started",
                popular: true,
              },
              {
                name: "Lifetime",
                price: "$59",
                description: "Pay once, use forever",
                features: ["Everything in Pro", "Lifetime access", "All future updates", "Early access to features"],
                cta: "Get lifetime access",
              },
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`rounded-xl border p-8 ${
                  plan.popular
                    ? "border-emerald-500 bg-white shadow-lg dark:bg-gray-900"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                {plan.popular && (
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Most Popular
                  </span>
                )}
                <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>}
                </div>
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  variant={plan.popular ? "default" : "outline"}
                  className="mt-8 w-full"
                >
                  {plan.cta}
                </Button>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3">
                      <Icon name="check" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              Common questions
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              {
                q: "Is the free plan really free?",
                a: "Yes! 10 active applications, full pipeline board, basic stats, no time limit. If 10 is enough for your search, you'll never pay a cent.",
              },
              {
                q: "Can I export my data?",
                a: "Absolutely. You own your data. Export to CSV anytime, or if you get hired, your history stays safe and you can come back if you search again.",
              },
              {
                q: "How do follow-up reminders work?",
                a: "Applume nudges you at 7, 14, and 21 days after you apply. Most people never follow up – the ones who do are 2-3x more likely to hear back.",
              },
              {
                q: "Will this work for my field?",
                a: "Applume works for any job search: tech, finance, marketing, academia, etc. Add any application type and track however you want.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="font-bold text-gray-900 dark:text-white">{item.q}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{item.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-200 bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-20 dark:border-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white">Your next job is out there</h2>
          <p className="mt-4 text-lg text-emerald-100">Let's find it together. Start tracking for free – no credit card needed.</p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            variant="secondary"
            className="mt-8"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 dark:border-gray-800 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <img src="/Logo.png" alt="Applume" className="h-6 w-6" />
              <span className="font-bold text-gray-900 dark:text-white">Applume</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Applume · Structured application tracking
            </p>
            <a 
              href="/privacy" 
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
