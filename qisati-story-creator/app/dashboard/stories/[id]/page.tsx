"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Edit, Share2, Star, VolumeIcon as VolumeUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [story] = useState({
    id: params.id,
    title: "The Magical Forest Adventure",
    date: "May 15, 2023",
    image: "/placeholder.svg?height=400&width=600",
    preview:
      "Once upon a time, there was a young explorer named Alex who discovered a hidden path behind their house. The path was lined with glowing mushrooms and twisted trees that seemed to whisper secrets...",
    tags: ["Fantasy", "Adventure", "Magic", "Forest"],
    rating: 4.8,
    readTime: "15 min",
    ageRange: "6-10 years",
    completed: true,
  })

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full text-red-500 hover:bg-red-50"
          onClick={() => router.push("/dashboard/stories")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Stories
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-orange-300 text-orange-500 hover:bg-orange-50"
            onClick={() => router.push(`/dashboard/stories/${params.id}/edit`)}
          >
            <Edit className="mr-2 h-5 w-5" />
            Edit
          </Button>

          <Button
            className="rounded-full bg-red-500 text-white hover:bg-red-600"
            size="lg"
            onClick={() => router.push(`/dashboard/stories/${params.id}/read`)}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Read Story
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-8 overflow-hidden rounded-3xl border-orange-200 shadow-lg">
          <div className="aspect-[2/1] w-full overflow-hidden">
            <img src={story.image || "/placeholder.svg"} alt={story.title} className="h-full w-full object-cover" />
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">{story.title}</h1>
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold">{story.rating}</span>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              {story.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full bg-orange-100 px-4 py-1 text-base font-medium text-orange-700"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-orange-50 p-4 text-center">
                <p className="text-sm text-gray-500">Reading Time</p>
                <p className="text-lg font-bold text-orange-600">{story.readTime}</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-4 text-center">
                <p className="text-sm text-gray-500">Age Range</p>
                <p className="text-lg font-bold text-orange-600">{story.ageRange}</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-4 text-center">
                <p className="text-sm text-gray-500">Created On</p>
                <p className="text-lg font-bold text-orange-600">{story.date}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-3 text-2xl font-bold text-gray-800">Story Preview</h2>
              <p className="text-lg text-gray-600">{story.preview}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                className="rounded-full bg-red-500 px-8 py-6 text-lg font-bold text-white hover:bg-red-600"
                onClick={() => router.push(`/dashboard/stories/${params.id}/read`)}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Start Reading
              </Button>

              <Button
                variant="outline"
                className="rounded-full border-blue-300 px-8 py-6 text-lg font-bold text-blue-500 hover:bg-blue-50"
              >
                <VolumeUp className="mr-2 h-5 w-5" />
                Listen to Story
              </Button>

              <Button
                variant="outline"
                className="rounded-full border-orange-300 px-8 py-6 text-lg font-bold text-orange-500 hover:bg-orange-50"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share Story
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-red-500">Story Journey Map</h2>
        <div className="rounded-3xl border-2 border-orange-200 bg-orange-50 p-6">
          <div className="flex justify-center">
            <div className="max-w-md text-center">
              <p className="mb-4 text-lg text-gray-600">See how your story can change based on the choices you make!</p>
              <Button
                className="rounded-full bg-orange-500 px-8 py-6 text-lg font-bold text-white hover:bg-orange-600"
                onClick={() => router.push(`/dashboard/stories/${params.id}/read`)}
              >
                Start Your Adventure!
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold text-red-500">You Might Also Like</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              id: "2",
              title: "Space Adventure",
              image: "/placeholder.svg?height=200&width=300",
              preview: "Captain Zara looked out at the stars...",
            },
            {
              id: "3",
              title: "The Brave Knight",
              image: "/placeholder.svg?height=200&width=300",
              preview: "The kingdom was in danger...",
            },
          ].map((relatedStory) => (
            <motion.div key={relatedStory.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Card className="overflow-hidden rounded-2xl border-orange-200 transition-all hover:shadow-lg">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={relatedStory.image || "/placeholder.svg"}
                    alt={relatedStory.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="mb-2 text-xl font-bold text-gray-800">{relatedStory.title}</h3>
                  <p className="mb-4 line-clamp-2 text-base text-gray-600">{relatedStory.preview}</p>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-orange-300 text-base font-medium text-orange-500 hover:bg-orange-50"
                    asChild
                  >
                    <Link href={`/dashboard/stories/${relatedStory.id}`}>View Story</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Direct test link for easy access */}
      <div className="mt-12 rounded-xl border-2 border-red-300 bg-red-50 p-6 text-center">
        <h3 className="mb-4 text-xl font-bold text-red-600">Having trouble accessing the story?</h3>
        <p className="mb-6 text-lg">Try these direct links to read the story:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            className="rounded-full bg-red-500 px-6 py-4 text-lg font-bold text-white hover:bg-red-600"
            onClick={() => router.push(`/dashboard/stories/${params.id}/read`)}
          >
            Read This Story
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-red-300 px-6 py-4 text-lg font-bold text-red-500 hover:bg-red-100"
            onClick={() => router.push("/dashboard/stories/direct-test")}
          >
            Go to Test Page
          </Button>
        </div>
      </div>
    </div>
  )
}

