"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, BookOpen, Check, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const updateScrolled = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", updateScrolled)
    return () => window.removeEventListener("scroll", updateScrolled)
  }, [])

  const opacity = useTransform(scrollY, [0, 100], [0, 1])

  return (
    <div className="relative">
      {/* Navigation */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Qisati.png" alt="Qisati Logo" width={120} height={40} />
          </Link>

          <div className="hidden gap-8 md:flex">
            <a href="#features" className="text-lg font-medium text-gray-700 hover:text-primary">
              Features
            </a>
            <a href="#how-it-works" className="text-lg font-medium text-gray-700 hover:text-primary">
              How It Works
            </a>
            <a href="#pricing" className="text-lg font-medium text-gray-700 hover:text-primary">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden rounded-full text-lg font-medium md:block">
              <Link href="/login">Log In</Link>
            </Button>
            <Button size="lg" className="rounded-full bg-primary px-8 text-lg font-bold hover:bg-primary/90" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="section-height relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-primary/5" />
        </div>
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-primary md:text-7xl">
              Where Stories Come Alive!
            </h1>
            <p className="mb-8 text-xl text-gray-700 md:text-2xl">
              Create magical adventures where YOU become the hero. Let AI help you craft unique stories that spark
              imagination!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="rounded-full bg-primary px-8 py-7 text-lg font-bold hover:bg-primary/90"
                  asChild
                >
                  <Link href="/dashboard">
                    Start Your Adventure <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-height bg-primary/5">
        <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-20">
          <h2 className="mb-12 text-center text-4xl font-bold text-primary md:text-5xl">Amazing Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-800">{feature.title}</h3>
                <p className="text-center text-lg text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-height bg-primary/5">
        <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-20">
          <h2 className="mb-12 text-center text-4xl font-bold text-primary md:text-5xl">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-800">{step.title}</h3>
                <p className="text-center text-lg text-gray-600">{step.description}</p>

                {index < steps.length - 1 && (
                  <div
                    className="absolute left-1/2 top-10 hidden h-1 w-full -translate-y-1/2 bg-primary/30 md:block"
                    style={{ left: "55%" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-height bg-primary/5">
        <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-20">
          <h2 className="mb-12 text-center text-4xl font-bold text-primary md:text-5xl">Choose Your Plan</h2>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="relative overflow-hidden rounded-2xl border-2 border-primary/20 p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Free</h3>
                  <p className="text-lg text-gray-600">Perfect for getting started</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">$0</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
                <ul className="mb-8 space-y-4">
                  {freeTierFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-xl border-2 border-primary py-6 text-lg font-bold text-primary hover:bg-primary hover:text-white"
                >
                  Get Started
                </Button>
              </Card>
            </motion.div>

            {/* Premium Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="relative overflow-hidden rounded-2xl border-2 border-primary bg-primary/5 p-8">
                <div className="absolute -right-12 -top-12 h-24 w-24 rotate-12 bg-primary/10" />
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Premium</h3>
                  <p className="text-lg text-gray-600">For the serious storytellers</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">$9.99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
                <ul className="mb-8 space-y-4">
                  {premiumTierFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className="w-full rounded-xl bg-primary py-6 text-lg font-bold text-white hover:bg-primary/90"
                >
                  Upgrade Now
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 text-center shadow-xl md:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">Ready For Your Adventure?</h2>
            <p className="mb-8 text-xl text-gray-600">Join thousands of kids creating their own magical stories!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="rounded-full bg-primary px-8 py-7 text-lg font-bold text-white hover:bg-primary/90"
                asChild
              >
                <Link href="/dashboard/create">
                  Create Your First Story <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F0C04] py-12 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="flex flex-col space-y-4">
            <Image src="/Qisati1.png" alt="Qisati Logo" width={120} height={40} />
            <p className="mt-2 text-gray-400">
              Story adventures for kids that develop their imagination and enhance their linguistic and creative skills
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold border-b border-[#3A2317] pb-2">Quick Links</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Available Stories
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Subscriptions
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold border-b border-[#3A2317] pb-2">Story Categories</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Adventure Stories
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Fantasy Stories
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Educational Stories
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Historical Stories
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Animal Stories
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Hero Stories
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold border-b border-[#3A2317] pb-2">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-gray-400">King Fahd Road, Riyadh, Saudi Arabia</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <p className="text-gray-400">+966 12 345 6789</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <p className="text-gray-400">info@qisati.com</p>
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-2">Subscribe to our newsletter</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-[#3A2317] text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-[#D4A76A]"
                  />
                  <button className="bg-[#D4A76A] text-[#1F0C04] px-4 py-2 rounded-r-md font-medium hover:bg-[#C69C62] transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-6 border-t border-[#3A2317]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Qisati. All rights reserved</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  )
}

const features = [
  {
    title: "AI Story Magic",
    description: "Pick a theme and watch as our AI creates a special story just for you!",
    icon: Sparkles,
  },
  {
    title: "Choose Your Adventure",
    description: "Make choices that change your story - create a different adventure every time!",
    icon: BookOpen,
  },
  {
    title: "Fun For Everyone",
    description: "Stories can be read aloud, have big text, and fun pictures to help all kids enjoy them!",
    icon: Star,
  },
]

const steps = [
  {
    title: "Pick Your Theme",
    description: "Choose from exciting worlds like space, underwater kingdoms, or create your own!",
  },
  {
    title: "Make Choices",
    description: "Decide what happens next in your story adventure!",
  },
  {
    title: "Share Your Story",
    description: "Save your stories and share them with friends and family!",
  },
]

const freeTierFeatures = [
  "Create up to 5 stories per month",
  "Basic themes and characters",
  "Standard story length",
  "Text-to-speech reading",
  "Basic customization options",
]

const premiumTierFeatures = [
  "Unlimited story creation",
  "All premium themes and characters",
  "Extended story length",
  "Priority AI processing",
  "Advanced customization options",
  "Ad-free experience",
  "Download stories as PDF",
  "Premium support",
]