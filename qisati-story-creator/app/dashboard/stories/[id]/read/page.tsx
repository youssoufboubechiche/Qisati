"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function StoryReadPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [storyPath, setStoryPath] = useState<string[]>([]);
    const [isReading, setIsReading] = useState(false);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customDecision, setCustomDecision] = useState("");
    const [generatedPage, setGeneratedPage] = useState<{
        narrative: string;
        choices: string[];
    } | null>(null);
    // Loading state
    const [loading, setLoading] = useState(false);
    const customInputRef = useRef<HTMLTextAreaElement>(null);

    const storyTitle = "The Magical Forest Adventure";

    useEffect(() => {
        if (showCustomInput && customInputRef.current) {
            customInputRef.current.focus();
        }
    }, [showCustomInput]);

    // Sample predefined story content.
    const storyPages = [
        {
            image: "/placeholder.svg?height=400&width=600",
            text: "Once upon a time, there was a young explorer named Alex who discovered a hidden path behind their house. The path was lined with glowing mushrooms and twisted trees that seemed to whisper secrets...",
            decisions: [
                {
                    text: "Follow the glowing mushrooms deeper into the forest",
                    nextPage: 1,
                },
                {
                    text: "Climb the tallest tree to get a better view",
                    nextPage: 2,
                },
            ],
        },
        // ... (other pages as needed)
    ];

    const currentStoryPage = generatedPage
        ? {
              image: "/generated-placeholder.svg",
              text: generatedPage.narrative,
              decisions: generatedPage.choices.map((choice, index) => ({
                  text: choice,
                  nextPage: currentPage + index + 1,
              })),
          }
        : storyPages[currentPage];

    // Predefined decision handler using the generation API.
    const handleDecision = async (decisionText: string) => {
        setLoading(true);
        const prompt = `
Previous Conversation Context: ${currentStoryPage.text}
Child's Action: ${decisionText}
    `;
        const endpoint = "/api/stories/generate/continue";
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const result = await response.json();
            setGeneratedPage(result);
            setStoryPath([...storyPath, `Decision: "${decisionText}"`]);
            setCurrentPage(currentPage + 1);
        } catch (error) {
            console.error("Error generating story (predefined):", error);
        }
        setLoading(false);
        window.scrollTo(0, 0);
    };

    // Custom decision handler using the same generation API.
    const handleCustomDecision = async () => {
        if (customDecision.trim()) {
            setLoading(true);
            const prompt = `
Previous Conversation Context: ${currentStoryPage.text}
Child's Action: ${customDecision}
      `;
            const endpoint = "/api/stories/generate/continue";
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt }),
                });
                const result = await response.json();
                console.log("Generated story (custom):", result);
                setGeneratedPage(result);
                setStoryPath([
                    ...storyPath,
                    `Custom Decision: "${customDecision}"`,
                ]);
                setCurrentPage(currentPage + 1);
            } catch (error) {
                console.error("Error generating story (custom):", error);
            }
            setLoading(false);
            setShowCustomInput(false);
            setCustomDecision("");
            window.scrollTo(0, 0);
        }
    };

    const toggleReading = () => {
        setIsReading(!isReading);
    };

    return (
        <div className="relative">
            {/* Enhanced Magic Loading Animation */}
            <AnimatePresence>
                {loading && <MagicLoadingAnimation />}
            </AnimatePresence>

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
                        {storyTitle}
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
                                    <p>
                                        {isReading
                                            ? "Stop Reading"
                                            : "Read Aloud"}
                                    </p>
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
                                (currentPage / (storyPages.length - 1)) * 100
                            }%`,
                        }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage + (generatedPage ? "-gen" : "")}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Story Content */}
                        <Card className="mb-8 overflow-hidden rounded-3xl border-orange-200 shadow-lg">
                            <div className="aspect-[3/2] w-full overflow-hidden bg-orange-50">
                                <img
                                    src={
                                        currentStoryPage.image ||
                                        "/placeholder.svg"
                                    }
                                    alt={`Story illustration for page ${
                                        currentPage + 1
                                    }`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-6 md:p-8">
                                <p className="text-xl leading-relaxed text-gray-800 md:text-2xl">
                                    {currentStoryPage.text}
                                </p>
                            </div>
                        </Card>

                        {/* Decision Section */}
                        <div className="space-y-6">
                            <h2 className="text-center text-2xl font-bold text-red-500">
                                What happens next?
                            </h2>

                            {/* Predefined Decisions */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {currentStoryPage.decisions.map(
                                    (decision, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="h-full"
                                        >
                                            <Button
                                                variant="outline"
                                                className="h-full w-full min-h-[120px] rounded-2xl border-2 border-orange-300 p-6 text-left text-lg font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-700 whitespace-normal break-words flex items-center justify-center"
                                                onClick={() =>
                                                    handleDecision(
                                                        decision.text
                                                    )
                                                }
                                            >
                                                <span className="text-center">
                                                    {decision.text}
                                                </span>
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
                                        onChange={(e) =>
                                            setCustomDecision(e.target.value)
                                        }
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
                                            onClick={() =>
                                                setShowCustomInput(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
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
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Switch id="auto-read" />
                        <Label
                            htmlFor="auto-read"
                            className="text-base font-medium"
                        >
                            Auto-Read
                        </Label>
                    </div>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="rounded-full text-orange-500 hover:bg-orange-50"
                        onClick={() =>
                            router.push(`/dashboard/stories/${params.id}`)
                        }
                    >
                        <BookOpen className="mr-2 h-5 w-5" />
                        Story Map
                    </Button>
                </div>
            </div>
        </div>
    );
}
