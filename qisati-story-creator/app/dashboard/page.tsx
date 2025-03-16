"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, PenLine, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [recentStories] = useState([
    {
      id: 1,
      title: "The Magical Forest",
      date: "2 days ago",
      image: "/placeholder.svg?height=200&width=300",
      preview: "Once upon a time in a magical forest...",
    },
    {
      id: 2,
      title: "Space Adventure",
      date: "1 week ago",
      image: "/placeholder.svg?height=200&width=300",
      preview: "Captain Zara looked out at the stars...",
    },
    {
      id: 3,
      title: "The Brave Knight",
      date: "2 weeks ago",
      image: "/placeholder.svg?height=200&width=300",
      preview: "The kingdom was in danger...",
    },
  ])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 p-8 text-white shadow-lg"
        >
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Hi there, Story Explorer!</h1>
          <p className="mb-6 text-lg text-white">Ready to create an amazing adventure today?</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild className="rounded-full bg-white px-8 py-6 text-lg font-bold text-red-500 hover:bg-blue-50">
              <Link href="/dashboard/create">
                <Plus className="mr-2 h-5 w-5" /> Create New Story
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-red-500">Fun Things To Do</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="border-orange-200 transition-all hover:shadow-lg">
                <Link href={action.href} className="block p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-4">
                      <action.icon className="h-8 w-8 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{action.title}</h3>
                      <p className="text-base text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Stories */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-red-500">Your Stories</h2>
          <Button variant="ghost" asChild className="text-lg font-medium text-blue-500 hover:text-blue-600">
            <Link href="/dashboard/stories">See All Stories</Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="overflow-hidden rounded-2xl border-orange-200 transition-all hover:shadow-lg">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-gray-800">{story.title}</CardTitle>
                  <CardDescription className="text-base">{story.date}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="line-clamp-2 text-base text-gray-600">{story.preview}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-xl border-orange-300 text-lg font-medium text-orange-500 hover:bg-orange-50"
                    asChild
                  >
                    <Link href={`/dashboard/stories/${story.id}`}>Keep Reading</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

const quickActions = [
  {
    title: "Create New Story",
    description: "Choose a theme or make your own",
    icon: PenLine,
    href: "/dashboard/create",
  },
  {
    title: "Continue Story",
    description: "Pick up where you left off",
    icon: BookOpen,
    href: "/dashboard/stories",
  },
  {
    title: "Explore Stories",
    description: "See what other kids created",
    icon: Sparkles,
    href: "/dashboard/community",
  },
]

