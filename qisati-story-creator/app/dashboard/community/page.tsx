"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  MessageSquare,
  Search,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import useStories, { Story } from "@/hooks/useStories"; // Import the hook
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have this component

export default function CommunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Tags");

  // Use the stories hook
  const { getStories, loading, error } = useStories();
  const [stories, setStories] = useState<Story[]>([]);

  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard/community?tab=${value}`, { scroll: false });
  };

  // Update the active tab when the URL changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Fetch stories based on active tab
  useEffect(() => {
    const fetchStories = async () => {
      let filters = {
        isPublic: true,
        limit: 20,
        page: 1,
      };

      // Different filters based on tabs
      switch (activeTab) {
        case "trending":
          // Sort by viewCount in API or client-side
          break;
        case "recent":
          // Sort by newest
          break;
        case "following":
          // Would need user following data
          break;
        case "favorites":
          // Would need user favorites data
          break;
      }

      const response = await getStories(filters);
      if (response) {
        setStories(response.stories);
      }
    };

    fetchStories();
  }, [activeTab]);

  // Filter stories by search query and tag
  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      searchQuery === "" ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (story.summary &&
        story.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === "All Tags" ||
      (story.tags && story.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  // Get unique tags from all stories
  const allTags = Array.from(
    new Set(stories.flatMap((story) => story.tags || []))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-red-500">Friends' Stories</h1>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Find a story..."
            className="h-12 rounded-xl border-orange-200 pl-10 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
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
          <Badge
            variant="outline"
            className={`rounded-full ${
              selectedTag === "All Tags" ? "bg-red-500 text-white" : "bg-white"
            } px-4 py-2 text-base font-medium cursor-pointer`}
            onClick={() => setSelectedTag("All Tags")}
          >
            All Tags
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={`rounded-full ${
                selectedTag === tag ? "bg-red-500 text-white" : "bg-white"
              } px-4 py-2 text-base font-medium cursor-pointer`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <TabsContent value="trending" className="mt-8">
          {loading ? (
            <StoryLoadingSkeleton />
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-red-500">Error loading stories: {error}</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500">No stories found.</p>
            </div>
          ) : (
            <CommunityStoriesGrid stories={filteredStories} />
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-8">
          {loading ? (
            <StoryLoadingSkeleton />
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-red-500">Error loading stories: {error}</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500">No stories found.</p>
            </div>
          ) : (
            <CommunityStoriesGrid
              stories={[...filteredStories].sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )}
            />
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-8">
          <div className="flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-orange-300 bg-orange-50 p-12 text-center">
            <Heart className="mb-6 h-16 w-16 text-orange-300" />
            <h3 className="mb-3 text-2xl font-bold text-gray-800">
              No followed friends yet
            </h3>
            <p className="mb-8 text-lg text-gray-600">
              Follow your friends to see their stories here!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="rounded-full bg-red-500 px-8 py-6 text-lg font-bold hover:bg-red-600"
                asChild
              >
                <Link href="/dashboard/community?tab=trending">
                  Find Friends
                </Link>
              </Button>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-8">
          {loading ? (
            <StoryLoadingSkeleton />
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-red-500">Error loading stories: {error}</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500">No favorite stories found.</p>
            </div>
          ) : (
            <CommunityStoriesGrid
              stories={filteredStories.filter((story) => story.viewCount > 30)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CommunityStoriesGrid({ stories }: { stories: Story[] }) {
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
                src={story.coverImage || "/placeholder.svg"}
                alt={story.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`/placeholder.svg?text=${
                      story.author?.name?.charAt(0) || "A"
                    }`}
                  />
                  <AvatarFallback>
                    {story.author?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-base font-medium">
                  {story.author?.name || "Anonymous"}
                </span>
                <span className="text-sm text-gray-500">
                  • {formatDate(story.createdAt)}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-gray-800">
                {story.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-base text-gray-600">
                {story.summary ||
                  `A ${story.genre} story about ${story.setting}...`}
              </p>

              <div className="mb-2 flex flex-wrap gap-2">
                {story.tags &&
                  story.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full bg-orange-100 px-3 py-1 text-orange-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                {!story.tags || story.tags.length === 0 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-orange-100 px-3 py-1 text-orange-700"
                  >
                    {story.genre}
                  </Badge>
                ) : null}
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
                  <span>{story.viewCount || 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 rounded-lg text-base font-medium text-orange-500 hover:text-orange-600"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{story.pages?.length || 0}</span>
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
                  <Link href={`/dashboard/stories/${story.id}`}>
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
  );
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "1 day ago";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 31) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
}

// Loading skeleton component
function StoryLoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Card
          key={index}
          className="overflow-hidden rounded-2xl border-orange-200"
        >
          <div className="aspect-video">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="mb-3 h-6 w-3/4" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-full" />
            <div className="mb-2 flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-orange-100 p-5">
            <div className="flex gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
