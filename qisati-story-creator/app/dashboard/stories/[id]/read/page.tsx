"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Home,
  Sparkles,
  VolumeIcon as VolumeUp,
  Pause,
  Share2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MagicLoadingAnimation from "@/components/magic-loading-animation";
import useStories from "@/hooks/useStories"; // Import the useStories hook

export default function StoryReadPage() {
  const params = useParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [storyPath, setStoryPath] = useState<string[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDecision, setCustomDecision] = useState("");

  // State for story and pages
  const [story, setStory] = useState<any>(null);
  const [storyPages, setStoryPages] = useState<any[]>([]);
  const [currentStoryPage, setCurrentStoryPage] = useState<any>(null);

  // Custom ref
  const customInputRef = useRef<HTMLTextAreaElement>(null);

  // Get the story hook functions
  const {
    loading: storiesLoading,
    error: storiesError,
    getStory,
    getStoryPages,
    continueStory,
  } = useStories();

  // Combined loading state
  const [loading, setLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Update the loading state from the hook
    setLoading(storiesLoading);
  }, [storiesLoading]);

  useEffect(() => {
    // Fetch the story and its pages when the component mounts
    const fetchStoryData = async () => {
      setLoading(true);
      try {
        // Convert the id from string to number
        const storyId = parseInt(params.id as string);
        if (isNaN(storyId)) {
          console.error("Invalid story ID");
          return;
        }

        // Fetch the story details
        const storyData = await getStory(storyId);
        if (storyData) {
          setStory(storyData);

          // Fetch the story pages
          const pagesData = await getStoryPages(storyId);
          if (pagesData && pagesData.length > 0) {
            setStoryPages(pagesData);
            // Set the current page to the last page
            setCurrentStoryPage(pagesData[pagesData.length - 1]);
            setCurrentPage(pagesData.length - 1);
          }
        }
      } catch (error) {
        console.error("Error fetching story data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryData();
  }, [params.id]);

  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustomInput]);

  useEffect(() => {
    if (storyPages.length > 0) {
      setCurrentStoryPage(storyPages[currentPage]);
    }
  }, [currentPage, storyPages]);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle a predefined decision
  const handleDecision = async (decisionText: string) => {
    setLoading(true);
    try {
      const storyId = parseInt(params.id as string);
      if (isNaN(storyId)) {
        console.error("Invalid story ID");
        return;
      }

      // Continue the story with the decision
      const newPage = await continueStory(storyId, decisionText);

      if (newPage) {
        // Update story pages and current page
        setStoryPages([...storyPages, newPage]);
        setCurrentStoryPage(newPage);
        setCurrentPage(storyPages.length);
        setStoryPath([...storyPath, `Decision: "${decisionText}"`]);
      }
    } catch (error) {
      console.error("Error handling decision:", error);
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  // Handle a custom decision
  const handleCustomDecision = async () => {
    if (customDecision.trim()) {
      setLoading(true);
      try {
        const storyId = parseInt(params.id as string);
        if (isNaN(storyId)) {
          console.error("Invalid story ID");
          return;
        }

        // Continue the story with the custom decision
        const newPage = await continueStory(storyId, customDecision);

        if (newPage) {
          // Update story pages and current page
          setStoryPages([...storyPages, newPage]);
          setCurrentStoryPage(newPage);
          setCurrentPage(storyPages.length);
          setStoryPath([...storyPath, `Custom Decision: "${customDecision}"`]);
        }
      } catch (error) {
        console.error("Error handling custom decision:", error);
      } finally {
        setLoading(false);
        setShowCustomInput(false);
        setCustomDecision("");
        window.scrollTo(0, 0);
      }
    }
  };

  const toggleReading = () => {
    setIsReading(!isReading);
  };

  if (!isMounted) {
    return null; // or a simple loading placeholder
  }

  // If we don't have story data yet, or we're loading, show a loading indicator
  if (!story || !currentStoryPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <MagicLoadingAnimation />
      </div>
    );
  }

  // Prepare the current page data
  const formattedCurrentPage = {
    image: currentStoryPage.imageUrl || "/placeholder.svg?height=400&width=600",
    text: currentStoryPage.text,
    decisions: (currentStoryPage.suggestedDecisions || []).map(
      (choice: string) => ({
        text: choice,
        nextPage: currentPage + 1, // Since we don't have specific page IDs, just increment
      })
    ),
  };

  const isLatestPage = currentPage === storyPages.length - 1;
  const isLast = currentPage === story.targetPages - 1;

  return (
    <div className="relative">
      {/* Enhanced Magic Loading Animation */}
      <AnimatePresence>{loading && <MagicLoadingAnimation />}</AnimatePresence>

      <div className="mx-auto max-w-4xl pb-20">
        {/* Story Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full text-red-500 hover:bg-red-50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>

          <h1 className="text-2xl font-bold text-red-500 md:text-3xl">
            {story.title}
          </h1>

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-orange-500 hover:bg-orange-50"
                    onClick={toggleReading}
                  >
                    {isReading ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <VolumeUp className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isReading ? "Stop Reading" : "Read Aloud"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-blue-500 hover:bg-blue-50"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Story</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-blue-500 hover:bg-blue-50"
                  >
                    <Save className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Progress</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 h-4 overflow-hidden rounded-full bg-orange-100">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{
              width: `${
                story.targetPages
                  ? (currentPage / (story.targetPages - 1)) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`page-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Story Content */}
            <Card className="mb-8 overflow-hidden rounded-3xl border-orange-200 shadow-lg">
              <div className="aspect-[3/2] w-full overflow-hidden bg-orange-50">
                <img
                  src={formattedCurrentPage.image}
                  alt={`Story illustration for page ${currentPage + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <p className="text-xl leading-relaxed text-gray-800 md:text-2xl">
                  {formattedCurrentPage.text}
                </p>
              </div>
            </Card>

            {/* Start a new adventue */}
            {isLast && (
              <div className="space-y-6">
                <h2 className="text-center text-2xl font-bold text-red-500">
                  Want to start a new adventure?
                </h2>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <Button
                    variant="outline"
                    className="h-full w-full min-h-[120px] rounded-2xl border-2 border-orange-300 p-6 text-left text-lg font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-700 whitespace-normal break-words flex items-center justify-center"
                    onClick={() => router.push("/dashboard/create")}
                  >
                    <span className="text-center">Create Another Story</span>
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Decision Section */}
            {isLatestPage && !isLast && (
              <div className="space-y-6">
                <h2 className="text-center text-2xl font-bold text-red-500">
                  What happens next?
                </h2>

                {/* Predefined Decisions */}
                <div className="grid gap-4 md:grid-cols-2">
                  {formattedCurrentPage.decisions.map(
                    (
                      decision: { text: string; nextPage: number },
                      index: number
                    ) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-full"
                      >
                        <Button
                          variant="outline"
                          className="h-full w-full min-h-[120px] rounded-2xl border-2 border-orange-300 p-6 text-left text-lg font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-700 whitespace-normal break-words flex items-center justify-center"
                          onClick={() => handleDecision(decision.text)}
                        >
                          <span className="text-center">{decision.text}</span>
                        </Button>
                      </motion.div>
                    )
                  )}
                </div>

                {/* Custom Decision */}
                {!showCustomInput ? (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="mx-auto mt-4 flex h-auto w-full max-w-md rounded-2xl bg-blue-500 p-6 text-lg font-bold text-white hover:bg-blue-600"
                      onClick={() => setShowCustomInput(true)}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Write Your Own Adventure!
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-6"
                  >
                    <h3 className="mb-3 text-xl font-bold text-blue-700">
                      Create Your Own Path!
                    </h3>
                    <Textarea
                      ref={customInputRef}
                      placeholder="What would YOU do next? Type your own adventure here!"
                      className="mb-4 min-h-[120px] rounded-xl border-blue-200 text-lg"
                      value={customDecision}
                      onChange={(e) => setCustomDecision(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <Button
                        className="rounded-xl bg-blue-500 px-6 py-3 text-lg font-bold text-white hover:bg-blue-600"
                        onClick={handleCustomDecision}
                        disabled={!customDecision.trim()}
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Make It Happen!
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl border-blue-300 px-6 py-3 text-lg font-medium text-blue-500 hover:bg-blue-50"
                        onClick={() => setShowCustomInput(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between bg-white p-4 shadow-lg">
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full text-red-500 hover:bg-red-50"
          onClick={() => router.push("/dashboard")}
        >
          <Home className="mr-2 h-5 w-5" />
          Home
        </Button>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            onClick={goToNextPage}
            disabled={currentPage === storyPages.length - 1}
          >
            Next
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch id="auto-read" />
            <Label htmlFor="auto-read" className="text-base font-medium">
              Auto-Read
            </Label>
          </div>
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full text-orange-500 hover:bg-orange-50"
            onClick={() => router.push(`/dashboard/stories/${params.id}`)}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Story Map
          </Button>
        </div>
      </div>
    </div>
  );
}
