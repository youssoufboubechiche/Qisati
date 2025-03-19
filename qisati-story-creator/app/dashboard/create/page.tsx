"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Wand2,
  PenLine,
  Rocket,
  Fish,
  TurtleIcon as Dinosaur,
  Crown,
  Ship,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useStories from "@/hooks/useStories"; // Import the stories hook

export default function CreateStory() {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [customTheme, setCustomTheme] = useState("");
  const [creationMethod, setCreationMethod] = useState<"preset" | "custom">(
    "preset"
  );

  // Form state for story creation
  const [characterName, setCharacterName] = useState("");
  const [characterAge, setCharacterAge] = useState("child");
  const [storyLength, setStoryLength] = useState("medium");
  const [storyGenre, setStoryGenre] = useState("");
  const [storyStyle, setStoryStyle] = useState("");
  const [storyPrompt, setStoryPrompt] = useState("");

  // Import the stories hook
  const { loading, error, createStory, startStory } = useStories();

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleCustomThemeChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomTheme(e.target.value);
  };

  const handleContinue = () => {
    if (creationMethod === "preset" && selectedTheme) {
      setStep(2);
    } else if (creationMethod === "custom" && customTheme.trim().length > 0) {
      setStep(2);
    }
  };

  const handleStyleSelect = (style: string) => {
    setStoryStyle(style);
  };

  const getTargetPages = () => {
    switch (storyLength) {
      case "short":
        return 3;
      case "medium":
        return 7;
      case "long":
        return 12;
      default:
        return 7;
    }
  };

  const getTargetAge = () => {
    switch (characterAge) {
      case "child":
        return 4;
      case "teen":
        return 8;
      case "adult":
        return 12;
      default:
        return 4;
    }
  };

  const getStorySettings = () => {
    if (creationMethod === "preset" && selectedTheme) {
      const theme = presetThemes.find((t) => t.id === selectedTheme);
      return theme ? theme.description : "";
    }
    return customTheme;
  };

  const handleGenerateStory = async () => {
    setGenerating(true);

    try {
      // Create the initial story in the database
      const newStory = await createStory({
        title:
          creationMethod === "preset" && selectedTheme
            ? presetThemes.find((t) => t.id === selectedTheme)?.title ||
              "My Story"
            : "Custom Adventure",
        setting:
          getStorySettings() +
          (storyPrompt
            ? `\nSpecial instructions added by the user: ${storyPrompt}`
            : ""),
        characterInfo: `Main character: ${characterName || "Unnamed"}.`,
        genre: storyGenre || "adventure",
        style: storyStyle || "interactive",
        targetAge: getTargetAge(),
        targetPages: getTargetPages(),
        summary: "",
        isPublic: false,
        tags: selectedTheme ? [selectedTheme] : [],
      });

      if (newStory) {
        // Create the first page of the story
        const firstPage = await startStory(newStory.id);

        if (firstPage) {
          // Redirect to the read page
          window.location.href = `/dashboard/stories/${newStory.id}/read`;
        }
      }
    } catch (err) {
      console.error("Error generating story:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Steps indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-1 flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white shadow-md ${
                  step >= i ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                {i}
              </motion.div>
              <p
                className={`mt-2 text-base font-medium ${
                  step >= i ? "text-red-600" : "text-gray-500"
                }`}
              >
                {i === 1 ? "Pick Theme" : "Character"}
              </p>
              {i < 2 && (
                <div
                  className={`mt-2 h-2 w-full rounded-full ${
                    step > i ? "bg-red-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-orange-200 bg-white shadow-lg">
              <CardContent className="p-8">
                <h2 className="mb-8 text-center text-3xl font-bold text-red-500">
                  Let's Create a Story!
                </h2>

                <Tabs
                  defaultValue="preset"
                  className="w-full"
                  onValueChange={(value) =>
                    setCreationMethod(value as "preset" | "custom")
                  }
                >
                  <TabsList className="mb-8 grid w-full grid-cols-2 bg-orange-100 p-1">
                    <TabsTrigger
                      value="preset"
                      className="rounded-full data-[state=active]:bg-red-500 data-[state=active]:text-white"
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Choose a Theme
                    </TabsTrigger>
                    <TabsTrigger
                      value="custom"
                      className="rounded-full data-[state=active]:bg-red-500 data-[state=active]:text-white"
                    >
                      <PenLine className="mr-2 h-5 w-5" />
                      Make Your Own
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preset">
                    <div className="space-y-8">
                      <p className="text-center text-lg text-gray-700">
                        Pick a fun world for your adventure!
                      </p>

                      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {presetThemes.map((theme) => (
                          <motion.div
                            key={theme.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`cursor-pointer overflow-hidden rounded-2xl border-4 transition-all ${
                              selectedTheme === theme.id
                                ? "border-red-500 bg-red-50"
                                : "border-orange-200 bg-white"
                            }`}
                            onClick={() => handleThemeSelect(theme.id)}
                          >
                            <div
                              className={`p-2 ${
                                selectedTheme === theme.id
                                  ? "bg-red-500"
                                  : "bg-orange-400"
                              }`}
                            >
                              <theme.icon className="mx-auto h-8 w-8 text-white" />
                            </div>
                            <div className="p-4">
                              <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
                                {theme.title}
                              </h3>
                              <p className="text-center text-sm text-gray-600">
                                {theme.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex justify-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={handleContinue}
                            disabled={!selectedTheme}
                            className="rounded-full bg-red-500 px-8 py-6 text-lg font-bold hover:bg-red-600"
                          >
                            Next Step!
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="custom">
                    <div className="space-y-8">
                      <p className="text-center text-lg text-gray-700">
                        Tell us about your own amazing world!
                      </p>

                      <div className="rounded-2xl border-4 border-orange-300 bg-white p-6">
                        <Label
                          htmlFor="custom-theme"
                          className="mb-3 block text-xl font-bold text-gray-800"
                        >
                          What's your story about?
                        </Label>
                        <Textarea
                          id="custom-theme"
                          placeholder="Maybe an underwater castle? Or a candy planet? Or a world where toys come alive at night?"
                          className="min-h-[150px] rounded-xl border-orange-200 text-lg"
                          value={customTheme}
                          onChange={handleCustomThemeChange}
                        />
                        <p className="mt-3 text-sm text-gray-500">
                          The more details you add, the more amazing your story
                          will be!
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={handleContinue}
                            disabled={customTheme.trim().length === 0}
                            className="rounded-full bg-red-500 px-8 py-6 text-lg font-bold hover:bg-red-600"
                          >
                            Next Step!
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-orange-200 bg-white shadow-lg">
              <CardContent className="p-8">
                <h2 className="mb-8 text-center text-3xl font-bold text-red-500">
                  Tell Us About Your Character!
                </h2>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="rounded-2xl border-4 border-orange-300 bg-white p-6">
                    <Label
                      htmlFor="main-character"
                      className="mb-3 block text-xl font-bold text-gray-800"
                    >
                      What's your character's name?
                    </Label>
                    <Input
                      id="main-character"
                      placeholder="Type your name here..."
                      className="h-14 rounded-xl border-orange-200 text-lg"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                    />
                  </div>

                  <div className="rounded-2xl border-4 border-orange-300 bg-white p-6">
                    <Label
                      htmlFor="character-age"
                      className="mb-3 block text-xl font-bold text-gray-800"
                    >
                      How old is your character?
                    </Label>
                    <Select
                      defaultValue="child"
                      value={characterAge}
                      onValueChange={setCharacterAge}
                    >
                      <SelectTrigger
                        id="character-age"
                        className="h-14 rounded-xl border-orange-200 text-lg"
                      >
                        <SelectValue placeholder="Pick an age..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="child">
                          Kid (4-8 years old)
                        </SelectItem>
                        <SelectItem value="kid">
                          Big Kid (8-12 years old)
                        </SelectItem>
                        <SelectItem value="teen">
                          Teen (12+ years old)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-2xl border-4 border-orange-300 bg-white p-6">
                    <Label
                      htmlFor="story-length"
                      className="mb-3 block text-xl font-bold text-gray-800"
                    >
                      How long should your story be?
                    </Label>
                    <Select
                      defaultValue="medium"
                      value={storyLength}
                      onValueChange={setStoryLength}
                    >
                      <SelectTrigger
                        id="story-length"
                        className="h-14 rounded-xl border-orange-200 text-lg"
                      >
                        <SelectValue placeholder="Pick a length..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="short">
                          Short (quick read)
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium (just right)
                        </SelectItem>
                        <SelectItem value="long">
                          Long (big adventure)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label
                      htmlFor="story-length"
                      className="mb-3 mt-3 block text-xl font-bold text-gray-800"
                    >
                      What genre do is your story?
                    </Label>
                    <Select
                      defaultValue="medium"
                      value={storyGenre}
                      onValueChange={setStoryGenre}
                    >
                      <SelectTrigger
                        id="story-length"
                        className="h-14 rounded-xl border-orange-200 text-lg"
                      >
                        <SelectValue placeholder="Pick a genre..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="mystery">Mystery</SelectItem>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="fairytale">Fairy Tale</SelectItem>
                        <SelectItem value="bedtime">Bedtime</SelectItem>
                        <SelectItem value="animal">Animal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-2xl border-4 border-orange-300 bg-white p-6">
                    <Label className="mb-3 block text-xl font-bold text-gray-800">
                      What kind of story do you want?
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: "adventure", label: "Adventure", icon: Rocket },
                        { id: "funny", label: "Funny", icon: Sparkles },
                        {
                          id: "educational",
                          label: "Learning",
                          icon: BookOpen,
                        },
                        { id: "magical", label: "Magical", icon: Wand2 },
                      ].map((type) => (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`cursor-pointer rounded-xl ${
                            storyStyle === type.id
                              ? "bg-orange-300"
                              : "bg-orange-100"
                          } p-4 text-center hover:bg-orange-200`}
                          onClick={() => handleStyleSelect(type.id)}
                        >
                          <type.icon className="mx-auto mb-2 h-8 w-8 text-orange-500" />
                          <span className="font-medium text-gray-800">
                            {type.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="rounded-2xl border-4 border-orange-300 bg-white p-6">
                      <Label
                        htmlFor="story-prompt"
                        className="mb-3 block text-xl font-bold text-gray-800"
                      >
                        Any special things you want in your story? (Optional)
                      </Label>
                      <Textarea
                        id="story-prompt"
                        placeholder="Maybe a talking pet? Or a magic power? Or a special friend?"
                        className="min-h-[100px] rounded-xl border-orange-200 text-lg"
                        value={storyPrompt}
                        onChange={(e) => setStoryPrompt(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="rounded-full border-orange-400 px-8 py-6 text-lg font-bold text-orange-500 hover:bg-orange-50"
                    >
                      Go Back
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleGenerateStory}
                      disabled={generating || loading}
                      className="rounded-full bg-red-500 px-8 py-6 text-lg font-bold hover:bg-red-600"
                    >
                      {generating || loading ? (
                        <>
                          <Sparkles className="mr-2 h-6 w-6 animate-spin" />
                          Making Magic...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-6 w-6" />
                          Create My Story!
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const presetThemes = [
  {
    id: "magical-forest",
    title: "Magical Forest",
    description: "A forest where animals talk and trees have magic powers!",
    icon: Sparkles,
  },
  {
    id: "space-adventure",
    title: "Space Adventure",
    description: "Zoom through stars and meet friendly aliens!",
    icon: Rocket,
  },
  {
    id: "underwater-kingdom",
    title: "Underwater Kingdom",
    description: "Swim with mermaids and discover sunken treasure!",
    icon: Fish,
  },
  {
    id: "dinosaur-island",
    title: "Dinosaur Island",
    description: "Meet friendly dinosaurs on a mysterious island!",
    icon: Dinosaur,
  },
  {
    id: "fairy-tale",
    title: "Fairy Tale",
    description: "A world with princes, princesses, and magical creatures!",
    icon: Crown,
  },
  {
    id: "pirate-adventure",
    title: "Pirate Adventure",
    description: "Sail the seas and hunt for buried treasure!",
    icon: Ship,
  },
];
