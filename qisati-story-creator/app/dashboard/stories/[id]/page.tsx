"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Edit,
  Share2,
  Star,
  VolumeIcon as VolumeUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import useStories, { Story } from "@/hooks/useStories"; // Update this path to match your actual file structure
import { use } from "react";

export default function StoryDetailPage() {
  // Unwrap params with React.use() as per Next.js recommendation
  const unwrappedParams = useParams();
  const storyId = parseInt(unwrappedParams.id as string);

  const router = useRouter();
  const storyHooks = useStories();
  const [story, setStory] = useState<Story | null>(null);
  const [relatedStories, setRelatedStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // Define the fetch function inside useEffect to avoid dependencies on hooks
    const fetchStory = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        if (isNaN(storyId)) {
          setFetchError("Invalid story ID");
          setIsLoading(false);
          return;
        }

        const fetchedStory = await storyHooks.getStory(storyId);
        if (fetchedStory) {
          setStory(fetchedStory);

          // Fetch related stories with the same genre
          if (fetchedStory.genre) {
            const response = await storyHooks.getStories({
              genre: fetchedStory.genre,
              isPublic: true,
              limit: 2,
            });

            if (response) {
              // Filter out the current story
              const filtered = response.stories.filter((s) => s.id !== storyId);
              setRelatedStories(filtered.slice(0, 2));
            }
          }
        } else {
          setFetchError("Story not found");
        }
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load story"
        );
        console.error("Error fetching story:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
    // Only re-run this effect if the storyId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  // Format the date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate read time (assuming 200 words per minute)
  const calculateReadTime = (pages?: any[]) => {
    if (!pages || pages.length === 0) return "5 min";

    const totalWords = pages.reduce((count, page) => {
      return count + (page.text ? page.text.split(/\s+/).length : 0);
    }, 0);

    const minutes = Math.ceil(totalWords / 200);
    return `${minutes} min`;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-gray-600">Loading story details...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full text-red-500 hover:bg-red-50"
            onClick={() => router.push("/dashboard/stories")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Stories
          </Button>
        </div>

        <Card className="mb-8 border-red-200 rounded-3xl shadow-lg">
          <CardContent className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-red-600">
              Error Loading Story
            </h1>
            <p className="mt-4 text-gray-600">{fetchError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full text-red-500 hover:bg-red-50"
            onClick={() => router.push("/dashboard/stories")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Stories
          </Button>
        </div>

        <Card className="mb-8 border-orange-200 rounded-3xl shadow-lg">
          <CardContent className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Story Not Found
            </h1>
            <p className="mt-4 text-gray-600">
              The story you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            onClick={() => router.push(`/dashboard/stories/${storyId}/edit`)}
          >
            <Edit className="mr-2 h-5 w-5" />
            Edit
          </Button>

          <Button
            className="rounded-full bg-red-500 text-white hover:bg-red-600"
            size="lg"
            onClick={() => router.push(`/dashboard/stories/${storyId}/read`)}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Read Story
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8 overflow-hidden rounded-3xl border-orange-200 shadow-lg">
          <div className="aspect-[2/1] w-full overflow-hidden">
            <img
              src={story.coverImage || "/placeholder.svg?height=400&width=600"}
              alt={story.title}
              className="h-full w-full object-cover"
            />
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
                {story.title}
              </h1>
              {story.viewCount && (
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold">
                    Views: {Math.round(story.viewCount / 10) / 10}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              {story.tags &&
                story.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full bg-orange-100 px-4 py-1 text-base font-medium text-orange-700"
                  >
                    {tag}
                  </Badge>
                ))}
              <Badge
                variant="secondary"
                className="rounded-full bg-orange-100 px-4 py-1 text-base font-medium text-orange-700"
              >
                {story.genre}
              </Badge>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-orange-50 p-4 text-center">
                <p className="text-sm text-gray-500">Reading Time</p>
                <p className="text-lg font-bold text-orange-600">
                  {calculateReadTime(story.pages)}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-4 text-center">
                <p className="text-sm text-gray-500">Age Range</p>
                <p className="text-lg font-bold text-orange-600">
                  {story.targetAge
                    ? `${story.targetAge}-${story.targetAge + 4} years`
                    : "All ages"}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-4 text-center">
                <p className="text-sm text-gray-500">Created On</p>
                <p className="text-lg font-bold text-orange-600">
                  {formatDate(story.createdAt)}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-3 text-2xl font-bold text-gray-800">
                Story Preview
              </h2>
              <p className="text-lg text-gray-600">
                {story.summary ||
                  (story.pages && story.pages.length > 0
                    ? story.pages[0].text.substring(0, 100) + "..."
                    : "Start your adventure to reveal the story!")}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                className="rounded-full bg-red-500 px-8 py-6 text-lg font-bold text-white hover:bg-red-600"
                onClick={() =>
                  router.push(`/dashboard/stories/${storyId}/read`)
                }
              >
                <BookOpen className="mr-2 h-5 w-5" />
                {story.pages && story.pages.length > 0
                  ? "Continue Reading"
                  : "Start Reading"}
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
        <h2 className="mb-6 text-2xl font-bold text-red-500">
          Story Journey Map
        </h2>
        <div className="rounded-3xl border-2 border-orange-200 bg-orange-50 p-6">
          <div className="flex justify-center">
            <div className="max-w-md text-center">
              <p className="mb-4 text-lg text-gray-600">
                See how your story can change based on the choices you make!
              </p>
              <Button
                className="rounded-full bg-orange-500 px-8 py-6 text-lg font-bold text-white hover:bg-orange-600"
                onClick={() =>
                  router.push(`/dashboard/stories/${storyId}/read`)
                }
              >
                Start Your Adventure!
              </Button>
            </div>
          </div>
        </div>
      </div>

      {relatedStories.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-red-500">
            You Might Also Like
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedStories.map((relatedStory) => (
              <motion.div
                key={relatedStory.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="overflow-hidden rounded-2xl border-orange-200 transition-all hover:shadow-lg">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={
                        relatedStory.coverImage ||
                        "/placeholder.svg?height=200&width=300"
                      }
                      alt={relatedStory.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="mb-2 text-xl font-bold text-gray-800">
                      {relatedStory.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-base text-gray-600">
                      {relatedStory.summary ||
                        "Start the adventure to reveal this story!"}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-orange-300 text-base font-medium text-orange-500 hover:bg-orange-50"
                      asChild
                    >
                      <Link href={`/dashboard/stories/${relatedStory.id}`}>
                        View Story
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {!story.isCompleted && (
        <div className="mt-12 rounded-xl border-2 border-red-300 bg-red-50 p-6 text-center">
          <h3 className="mb-4 text-xl font-bold text-red-600">
            Ready to continue this story?
          </h3>
          <p className="mb-6 text-lg">
            This story is waiting for you to make choices and continue the
            adventure!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="rounded-full bg-red-500 px-6 py-4 text-lg font-bold text-white hover:bg-red-600"
              onClick={() => router.push(`/dashboard/stories/${storyId}/read`)}
            >
              Continue Your Adventure
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
