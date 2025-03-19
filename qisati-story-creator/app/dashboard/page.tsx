"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, PenLine, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useStories, { Story } from "@/hooks/useStories"; // Update this path to match your actual file structure

export default function Dashboard() {
  const { getStories, loading, error } = useStories();
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        const response = await getStories({
          limit: 3, // Only get 3 most recent stories
          page: 1,
        });

        if (response) {
          setRecentStories(response.stories);
        }
      } catch (err) {
        setFetchError("Failed to load stories");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array so it only runs once

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

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
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">
            Hi there, Story Explorer!
          </h1>
          <p className="mb-6 text-lg text-white">
            Ready to create an amazing adventure today?
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className="rounded-full bg-white px-8 py-6 text-lg font-bold text-red-500 hover:bg-blue-50"
            >
              <Link href="/dashboard/create">
                <Plus className="mr-2 h-5 w-5" /> Create New Story
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-red-500">
          Fun Things To Do
        </h2>
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
                      <h3 className="text-xl font-bold text-gray-800">
                        {action.title}
                      </h3>
                      <p className="text-base text-gray-600">
                        {action.description}
                      </p>
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
          <Button
            variant="ghost"
            asChild
            className="text-lg font-medium text-blue-500 hover:text-blue-600"
          >
            <Link href="/dashboard/stories">See All Stories</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading your stories...</p>
          </div>
        ) : fetchError ? (
          <div className="text-center py-8">
            <p className="text-red-500">
              Oops! Something went wrong loading your stories.
            </p>
          </div>
        ) : recentStories.length === 0 ? (
          <div className="text-center py-8 bg-orange-50 rounded-xl">
            <p className="text-gray-600 mb-4">
              You haven't created any stories yet!
            </p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/dashboard/create">Create Your First Story</Link>
            </Button>
          </div>
        ) : (
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
                      src={story.coverImage || "/placeholder.svg"}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-gray-800">
                      {story.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {formatDate(story.updatedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="line-clamp-2 text-base text-gray-600">
                      {story.summary
                        ? story.summary
                        : false || story.pages?.[0]?.text?.substring(0, 100)
                        ? story.pages?.[0]?.text?.substring(0, 100) + "..."
                        : false || "Start reading this adventure..."}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-xl border-orange-300 text-lg font-medium text-orange-500 hover:bg-orange-50"
                      asChild
                    >
                      <Link href={`/dashboard/stories/${story.id}`}>
                        Keep Reading
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
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
];
