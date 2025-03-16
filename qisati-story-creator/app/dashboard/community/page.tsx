"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Heart, MessageSquare, Search, Share2, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CommunityPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "trending")

  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/dashboard/community?tab=${value}`, { scroll: false })
  }

  // Update the active tab when the URL changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const [communityStories] = useState([
    {
      id: 1,
      title: "The Dragon's Quest",
      author: "Emma K.",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "2 days ago",
      image: "/placeholder.svg?height=200&width=300",
      preview: "A brave dragon sets out to find the magical crystal...",
      likes: 42,
      comments: 8,
      tags: ["Fantasy", "Dragons", "Adventure"],
    },
    {
      id: 2,
      title: "Robots of Tomorrow",
      author: "Liam J.",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "1 week ago",
      image: "/placeholder.svg?height=200&width=300",
      preview: "In a world where robots and humans live together...",
      likes: 36,
      comments: 12,
      tags: ["Sci-Fi", "Robots", "Future"],
    },
    {
      id: 3,
      title: "The Talking Animals",
      author: "Sophia M.",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "2 weeks ago",
      image: "/placeholder.svg?height=200&width=300",
      preview: "When the animals in the forest suddenly started talking...",
      likes: 28,
      comments: 5,
      tags: ["Animals", "Magic", "Friendship"],
    },
    {
      id: 4,
      title: "Pirate's Treasure",
      author: "Noah P.",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "3 weeks ago",
      image: "/placeholder.svg?height=200&width=300",
      preview: "Captain Redbeard and his crew sail the seven seas...",
      likes: 19,
      comments: 3,
      tags: ["Pirates", "Adventure", "Treasure"],
    },
    {
      id: 5,
      title: "The Enchanted Garden",
      author: "Olivia S.",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "1 month ago",
      image: "/placeholder.svg?height=200&width=300",
      preview: "Behind the old stone wall was a garden unlike any other...",
      likes: 53,
      comments: 15,
      tags: ["Magic", "Nature", "Mystery"],
    },
    {
      id: 6,
      title: "Journey to the Stars",
      author: "Ethan G.",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "1 month ago",
      image: "/placeholder.svg?height=200&width=300",
      preview: "When a shooting star crashed in the backyard...",
      likes: 31,
      comments: 7,
      tags: ["Space", "Adventure", "Sci-Fi"],
    },
  ])

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-red-500">Friends' Stories</h1>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
          <Input placeholder="Find a story..." className="h-12 rounded-xl border-orange-200 pl-10 text-lg" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid h-14 w-full grid-cols-4 rounded-xl bg-orange-100 p-1">
          <TabsTrigger
            value="trending"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Popular
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            New
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Following
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Favorites
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 flex flex-wrap gap-3">
          <Badge variant="outline" className="rounded-full bg-white px-4 py-2 text-base font-medium">
            All Tags
          </Badge>
          <Badge variant="outline" className="rounded-full bg-white px-4 py-2 text-base font-medium">
            Adventure
          </Badge>
          <Badge variant="outline" className="rounded-full bg-white px-4 py-2 text-base font-medium">
            Fantasy
          </Badge>
          <Badge variant="outline" className="rounded-full bg-white px-4 py-2 text-base font-medium">
            Animals
          </Badge>
          <Badge variant="outline" className="rounded-full bg-white px-4 py-2 text-base font-medium">
            Space
          </Badge>
          <Badge variant="outline" className="rounded-full bg-white px-4 py-2 text-base font-medium">
            Mystery
          </Badge>
        </div>

        <TabsContent value="trending" className="mt-8">
          <CommunityStoriesGrid stories={communityStories} />
        </TabsContent>

        <TabsContent value="recent" className="mt-8">
          <CommunityStoriesGrid
            stories={[...communityStories].sort((a, b) =>
              a.date.includes("day") ? -1 : b.date.includes("day") ? 1 : 0,
            )}
          />
        </TabsContent>

        <TabsContent value="following" className="mt-8">
          <div className="flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-orange-300 bg-orange-50 p-12 text-center">
            <Heart className="mb-6 h-16 w-16 text-orange-300" />
            <h3 className="mb-3 text-2xl font-bold text-gray-800">No followed friends yet</h3>
            <p className="mb-8 text-lg text-gray-600">Follow your friends to see their stories here!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="rounded-full bg-red-500 px-8 py-6 text-lg font-bold hover:bg-red-600" asChild>
                <Link href="/dashboard/community?tab=trending">Find Friends</Link>
              </Button>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-8">
          <CommunityStoriesGrid stories={communityStories.filter((story) => story.likes > 30)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CommunityStoriesGrid({ stories }: { stories: any[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((story, index) => (
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
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={story.authorAvatar} />
                  <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-base font-medium">{story.author}</span>
                <span className="text-sm text-gray-500">• {story.date}</span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-gray-800">{story.title}</h3>
              <p className="mb-4 line-clamp-2 text-base text-gray-600">{story.preview}</p>

              <div className="mb-2 flex flex-wrap gap-2">
                {story.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-orange-100 p-5">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 rounded-lg text-base font-medium text-orange-500 hover:text-orange-600"
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span>{story.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 rounded-lg text-base font-medium text-orange-500 hover:text-orange-600"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{story.comments}</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-base font-medium text-blue-500 hover:text-blue-600"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-base font-medium text-blue-500 hover:text-blue-600"
                  asChild
                >
                  <Link href={`/dashboard/community/${story.id}`}>
                    <BookOpen className="h-5 w-5" />
                    Read
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

