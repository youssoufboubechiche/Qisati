"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import useStories, { Story, StoryFilters } from "@/hooks/useStories"; // Import the hook and types
import { getRandomImage } from "@/lib/image";

export default function StoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Use the stories hook
  const { loading, error, getStories } = useStories();

  const [stories, setStories] = useState<Story[]>([]);

  // Create a stable fetch function with useCallback
  const fetchStories = useCallback(async () => {
    const filters: StoryFilters = {};

    filters.isPublic = false; // temporary

    // Apply filters based on active tab
    if (activeTab === "completed") {
      filters.isCompleted = true;
    } else if (activeTab === "in-progress") {
      filters.isCompleted = false;
    }

    const response = await getStories(filters);
    if (response) {
      setStories(response.stories);
    }
  }, [activeTab, getStories]);

  // Fetch stories when component mounts or filters change
  useEffect(() => {
    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); // Only re-run when activeTab changes

  // Handle search and sorting
  const filteredStories = stories
    .filter((story) => {
      if (!searchQuery) return true;
      return story.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "newest") {
        return dateB.getTime() - dateA.getTime();
      } else if (sortOrder === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard/stories?tab=${value}`, { scroll: false });
  };

  // Update the active tab when the URL changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-red-500">My Stories</h1>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Find a story..."
              className="h-12 rounded-xl border-orange-200 pl-10 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-xl border-orange-200"
              >
                <SlidersHorizontal className="h-5 w-5 text-orange-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem
                className="text-base"
                onClick={() => setSortOrder("newest")}
              >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-base"
                onClick={() => setSortOrder("oldest")}
              >
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-base"
                onClick={() => setSortOrder("a-z")}
              >
                A to Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid h-14 w-full grid-cols-3 rounded-xl bg-orange-100 p-1">
          <TabsTrigger
            value="all"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            All Stories
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Finished
          </TabsTrigger>
          <TabsTrigger
            value="in-progress"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            In Progress
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="mt-8 text-center text-xl">Loading stories...</div>
        ) : error ? (
          <div className="mt-8 text-center text-xl text-red-500">
            Error loading stories: {error}
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-8">
              <StoriesGrid stories={filteredStories} />
            </TabsContent>

            <TabsContent value="completed" className="mt-8">
              <StoriesGrid
                stories={filteredStories.filter((story) => story.isCompleted)}
              />
            </TabsContent>

            <TabsContent value="in-progress" className="mt-8">
              <StoriesGrid
                stories={filteredStories.filter((story) => !story.isCompleted)}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

function StoriesGrid({ stories }: { stories: Story[] }) {
  return stories.length === 0 ? (
    <div className="text-center text-xl py-8">No stories found.</div>
  ) : (
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
            <div className="relative aspect-video overflow-hidden">
              <img
                src={
                  getRandomImage() || "/placeholder.svg?height=200&width=300"
                }
                alt={story.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
              {!story.isCompleted && (
                <div className="absolute right-3 top-3 rounded-full bg-orange-500 px-3 py-1.5 text-base font-bold text-white">
                  Not Finished
                </div>
              )}
            </div>
            <CardContent className="p-5">
              <h3 className="mb-1 text-xl font-bold text-gray-800">
                {story.title}
              </h3>
              <p className="mb-3 text-sm text-gray-500">
                {new Date(story.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="line-clamp-2 text-base text-gray-600">
                {story.summary || `A story about ${story.setting}`}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-orange-100 p-5">
              <Button
                variant="ghost"
                size="lg"
                className="rounded-xl text-lg font-medium text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                asChild
              >
                <Link href={`/dashboard/stories/${story.id}`}>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-xl text-lg font-medium"
                  >
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem asChild className="text-base">
                    <Link href={`/dashboard/stories/${story.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-base">
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-base">
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-base text-red-500">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
