"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, BookOpen, Home, Sparkles, VolumeIcon as VolumeUp, Pause, Share2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function StoryReadPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const [storyPath, setStoryPath] = useState<string[]>([])
  const [isReading, setIsReading] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customDecision, setCustomDecision] = useState("")
  const customInputRef = useRef<HTMLTextAreaElement>(null)

  // This would normally come from an API based on the story ID
  const storyTitle = "The Magical Forest Adventure"

  // Effect to focus the custom input when it's shown
  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus()
    }
  }, [showCustomInput])

  // Sample story content - in a real app, this would be fetched from an API
  const storyPages = [
    {
      image: "/placeholder.svg?height=400&width=600",
      text: "Once upon a time, there was a young explorer named Alex who discovered a hidden path behind their house. The path was lined with glowing mushrooms and twisted trees that seemed to whisper secrets. Alex had heard stories about the magical forest, but never believed they were true until now.",
      decisions: [
        { text: "Follow the glowing mushrooms deeper into the forest", nextPage: 1 },
        { text: "Climb the tallest tree to get a better view", nextPage: 2 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: "Alex followed the trail of glowing mushrooms, which grew brighter with each step. Soon, the forest opened into a clearing where a small, bubbling stream flowed with water that sparkled like liquid diamonds. Sitting beside the stream was a tiny creature with pointed ears and clothes made of leaves.",
      decisions: [
        { text: "Say hello to the creature", nextPage: 3 },
        { text: "Hide and watch what the creature does", nextPage: 4 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: "With determination, Alex began climbing the tallest tree. The bark felt warm and almost seemed to help by forming perfect handholds. From the top, Alex could see the entire forest stretching for miles. In the distance, there was a strange tower made of crystal that caught the sunlight and sent rainbow beams in all directions.",
      decisions: [
        { text: "Climb down and head toward the crystal tower", nextPage: 5 },
        { text: "Look for other interesting landmarks", nextPage: 6 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: '"Hello there!" Alex called out. The creature jumped in surprise, then smiled with relief. "A human child! How wonderful! I\'m Pip, a forest sprite. We\'ve been waiting for someone like you to help us." Pip explained that the forest\'s magic was fading because the Crystal of Seasons had been stolen by shadow goblins.',
      decisions: [
        { text: "Offer to help Pip find the Crystal", nextPage: 7 },
        { text: "Ask more questions about the forest magic", nextPage: 8 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: "Alex hid behind a large fern and watched the creature. It seemed to be collecting water in a tiny acorn cup. After drinking, the creature began to glow slightly and danced around the stream, causing flowers to bloom wherever its feet touched the ground. Suddenly, it stopped and looked directly at Alex's hiding spot.",
      decisions: [
        { text: "Step out and introduce yourself", nextPage: 3 },
        { text: "Stay hidden and see what happens", nextPage: 9 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: "Alex carefully climbed down and began walking toward the crystal tower. The path became wider and was soon lined with flowers that changed colors as Alex passed. After walking for what seemed like hours but felt like minutes, Alex reached the base of the tower. There was no door, just smooth crystal walls that hummed with energy.",
      decisions: [
        { text: "Place your hand on the crystal wall", nextPage: 10 },
        { text: "Walk around the tower looking for an entrance", nextPage: 11 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: "Scanning the horizon, Alex spotted several interesting landmarks: a circle of giant toadstools, a tree with a door in its trunk, and what looked like a village of tiny houses built into the side of a hill. Each seemed to promise its own adventure.",
      decisions: [
        { text: "Head toward the toadstool circle", nextPage: 12 },
        { text: "Investigate the tree with the door", nextPage: 13 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: '"I\'ll help you find the Crystal," Alex promised. Pip jumped with joy and whistled a melodic tune. Two butterflies with wings like stained glass appeared and landed on Alex\'s shoulders. "My friends will guide us to where the shadow goblins were last seen," Pip explained. "But we must hurry – without the Crystal, winter will never turn to spring."',
      decisions: [
        { text: "Follow the butterflies immediately", nextPage: 14 },
        { text: "Ask Pip if you need any special tools for the journey", nextPage: 15 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: '"What exactly is the forest magic?" Alex asked. Pip explained that the forest exists in perfect balance with four magical crystals – one for each season. The sprites are guardians who use the crystals\' power to ensure the seasons change properly. "Without the Crystal of Seasons, time is frozen between winter and spring, and soon all plants will wither."',
      decisions: [
        { text: "Offer to help find the Crystal now that you understand", nextPage: 7 },
        { text: "Ask about the shadow goblins who took the Crystal", nextPage: 16 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: "Alex remained perfectly still. The creature tilted its head curiously, then spoke in a voice like tinkling bells: \"I know you're there, human child. There's no need to hide – the forest has chosen you.\" A gentle breeze pushed against Alex's back, almost nudging them forward to meet the strange being.",
      decisions: [
        { text: "Step out and ask what the creature means", nextPage: 17 },
        { text: "Apologize for hiding and introduce yourself", nextPage: 3 },
      ],
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      text: "With a deep breath, Alex placed a hand on the crystal wall. It felt cool at first, then warm, and suddenly Alex's hand passed through as if the wall were made of water! A voice echoed inside Alex's mind: \"Enter, Chosen One. The Tower of Visions awaits.\" The entire wall rippled, inviting Alex to step through.",
      decisions: [
        { text: "Step through the crystal wall", nextPage: 18 },
        { text: "Pull your hand back and reconsider", nextPage: 11 },
      ],
    },
  ]

  const handleDecision = (nextPage: number) => {
    // Add the current decision to the story path
    setStoryPath([...storyPath, `Page ${currentPage} -> Page ${nextPage}`])
    // Move to the next page
    setCurrentPage(nextPage)
    // Reset custom input
    setShowCustomInput(false)
    setCustomDecision("")
    // Scroll to top
    window.scrollTo(0, 0)
  }

  const handleCustomDecision = () => {
    if (customDecision.trim()) {
      // In a real app, this would send the custom decision to an AI to generate the next part of the story
      // For now, we'll just go to a random next page
      const availableNextPages = storyPages
        .filter((_, index) => index > currentPage && index < storyPages.length)
        .map((_, index) => currentPage + index + 1)

      const randomNextPage =
        availableNextPages.length > 0
          ? availableNextPages[Math.floor(Math.random() * availableNextPages.length)]
          : (currentPage + 1) % storyPages.length

      // Add the custom decision to the story path
      setStoryPath([...storyPath, `Page ${currentPage} -> Custom: "${customDecision}" -> Page ${randomNextPage}`])

      // Move to the next page
      setCurrentPage(randomNextPage)

      // Reset custom input
      setShowCustomInput(false)
      setCustomDecision("")

      // Scroll to top
      window.scrollTo(0, 0)
    }
  }

  const toggleReading = () => {
    setIsReading(!isReading)
    // In a real app, this would start/stop text-to-speech
  }

  const currentStoryPage = storyPages[currentPage]

  return (
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

        <h1 className="text-2xl font-bold text-red-500 md:text-3xl">{storyTitle}</h1>

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
                  {isReading ? <Pause className="h-5 w-5" /> : <VolumeUp className="h-5 w-5" />}
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
                <Button variant="ghost" size="icon" className="rounded-full text-blue-500 hover:bg-blue-50">
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
                <Button variant="ghost" size="icon" className="rounded-full text-blue-500 hover:bg-blue-50">
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
          style={{ width: `${(currentPage / (storyPages.length - 1)) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Story Content */}
          <Card className="mb-8 overflow-hidden rounded-3xl border-orange-200 shadow-lg">
            {/* Story Image */}
            <div className="aspect-[3/2] w-full overflow-hidden bg-orange-50">
              <img
                src={currentStoryPage.image || "/placeholder.svg"}
                alt={`Story illustration for page ${currentPage + 1}`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Story Text */}
            <div className="p-6 md:p-8">
              <p className="text-xl leading-relaxed text-gray-800 md:text-2xl">{currentStoryPage.text}</p>
            </div>
          </Card>

          {/* Decision Section */}
          <div className="space-y-6">
            <h2 className="text-center text-2xl font-bold text-red-500">What happens next?</h2>

            {/* Predefined Decisions */}
            <div className="grid gap-4 md:grid-cols-2">
              {currentStoryPage.decisions.map((decision, index) => (
                <motion.div key={index} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="h-auto w-full rounded-2xl border-2 border-orange-300 p-6 text-left text-lg font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-700"
                    onClick={() => handleDecision(decision.nextPage)}
                  >
                    {decision.text}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Custom Decision */}
            {!showCustomInput ? (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
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
                <h3 className="mb-3 text-xl font-bold text-blue-700">Create Your Own Path!</h3>
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
        </motion.div>
      </AnimatePresence>

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
  )
}

