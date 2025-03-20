"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Moon, Sun, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "accessibility");
  const [theme, setTheme] = useState("light");
  const [showPassword, setShowPassword] = useState(false);

  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard/settings?tab=${value}`, { scroll: false });
  };

  // Update the active tab when the URL changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid h-14 w-full grid-cols-3 rounded-xl bg-orange-100 p-1">
          <TabsTrigger
            value="accessibility"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Reading Settings
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Story Controls
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="rounded-lg text-lg font-medium data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accessibility" className="mt-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-2xl border-orange-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-red-500">
                  How Stories Look
                </CardTitle>
                <CardDescription className="text-base">
                  Change how stories appear when you read them
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="theme-mode"
                        className="text-xl font-bold text-gray-800"
                      >
                        Light or Dark Mode
                      </Label>
                      <p className="text-base text-gray-500">
                        Choose between light and dark colors
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-orange-100 p-1">
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setTheme("light")}
                        className={`rounded-full px-4 py-2 ${
                          theme === "light" ? "bg-white shadow-sm" : ""
                        }`}
                      >
                        <Sun className="mr-2 h-5 w-5" />
                        <span className="text-base">Light</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setTheme("dark")}
                        className={`rounded-full px-4 py-2 ${
                          theme === "dark" ? "bg-white shadow-sm" : ""
                        }`}
                      >
                        <Moon className="mr-2 h-5 w-5" />
                        <span className="text-base">Dark</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="font-size"
                        className="text-xl font-bold text-gray-800"
                      >
                        Text Size
                      </Label>
                      <span className="text-base font-medium text-orange-500">
                        Medium
                      </span>
                    </div>
                    <Slider
                      id="font-size"
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="line-spacing"
                        className="text-xl font-bold text-gray-800"
                      >
                        Line Spacing
                      </Label>
                      <span className="text-base font-medium text-orange-500">
                        Normal
                      </span>
                    </div>
                    <Slider
                      id="line-spacing"
                      defaultValue={[40]}
                      max={100}
                      step={1}
                      className="py-2"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="font-family"
                      className="text-xl font-bold text-gray-800"
                    >
                      Font Style
                    </Label>
                    <Select defaultValue="inter">
                      <SelectTrigger
                        id="font-family"
                        className="mt-2 h-12 rounded-xl border-orange-200 text-base"
                      >
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="inter" className="text-base">
                          Inter
                        </SelectItem>
                        <SelectItem value="comic" className="text-base">
                          Comic Sans
                        </SelectItem>
                        <SelectItem value="dyslexic" className="text-base">
                          OpenDyslexic
                        </SelectItem>
                        <SelectItem value="serif" className="text-base">
                          Serif
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="rounded-2xl border-orange-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-red-500">
                  Sound & Reading
                </CardTitle>
                <CardDescription className="text-base">
                  Change how stories sound when read aloud
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="text-to-speech"
                      className="text-xl font-bold text-gray-800"
                    >
                      Read Stories Aloud
                    </Label>
                    <p className="text-base text-gray-500">
                      Let the app read stories to you
                    </p>
                  </div>
                  <Switch
                    id="text-to-speech"
                    defaultChecked
                    className="h-6 w-12"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="narration-speed"
                      className="text-xl font-bold text-gray-800"
                    >
                      Reading Speed
                    </Label>
                    <span className="text-base font-medium text-orange-500">
                      Normal
                    </span>
                  </div>
                  <Slider
                    id="narration-speed"
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    className="py-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="volume"
                      className="text-xl font-bold text-gray-800"
                    >
                      Volume
                    </Label>
                    <Volume2 className="h-5 w-5 text-orange-500" />
                  </div>
                  <Slider
                    id="volume"
                    defaultValue={[80]}
                    max={100}
                    step={1}
                    className="py-2"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="narrator-voice"
                    className="text-xl font-bold text-gray-800"
                  >
                    Voice Type
                  </Label>
                  <Select defaultValue="friendly">
                    <SelectTrigger
                      id="narrator-voice"
                      className="mt-2 h-12 rounded-xl border-orange-200 text-base"
                    >
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="friendly" className="text-base">
                        Friendly
                      </SelectItem>
                      <SelectItem value="storyteller" className="text-base">
                        Storyteller
                      </SelectItem>
                      <SelectItem value="adventure" className="text-base">
                        Adventure
                      </SelectItem>
                      <SelectItem value="calm" className="text-base">
                        Calm
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="sound-effects"
                      className="text-xl font-bold text-gray-800"
                    >
                      Sound Effects
                    </Label>
                    <p className="text-base text-gray-500">
                      Play fun sounds during stories
                    </p>
                  </div>
                  <Switch
                    id="sound-effects"
                    defaultChecked
                    className="h-6 w-12"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="content" className="mt-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-2xl border-orange-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-red-500">
                  Story Filters
                </CardTitle>
                <CardDescription className="text-base">
                  Control what appears in stories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div>
                  <Label
                    htmlFor="content-rating"
                    className="text-xl font-bold text-gray-800"
                  >
                    Story Rating
                  </Label>
                  <p className="mb-4 text-base text-gray-500">
                    Set the maximum rating for stories
                  </p>
                  <RadioGroup
                    defaultValue="g"
                    id="content-rating"
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="g"
                        id="g-rating"
                        className="h-5 w-5"
                      />
                      <Label htmlFor="g-rating" className="text-lg">
                        G (For all kids)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="pg"
                        id="pg-rating"
                        className="h-5 w-5"
                      />
                      <Label htmlFor="pg-rating" className="text-lg">
                        PG (Parent guidance)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="pg13"
                        id="pg13-rating"
                        className="h-5 w-5"
                      />
                      <Label htmlFor="pg13-rating" className="text-lg">
                        PG-13 (Some themes may be for older kids)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-xl font-bold text-gray-800">
                    Things to Avoid
                  </Label>
                  <p className="text-base text-gray-500">
                    Stories will avoid these themes
                  </p>

                  <div className="space-y-3">
                    {[
                      "Scary content",
                      "Conflict/fighting",
                      "Sad endings",
                      "Complex emotions",
                    ].map((theme) => (
                      <div key={theme} className="flex items-center space-x-3">
                        <Switch
                          id={`theme-${theme
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="h-6 w-12"
                        />
                        <Label
                          htmlFor={`theme-${theme
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="text-lg"
                        >
                          {theme}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="language-complexity"
                    className="text-xl font-bold text-gray-800"
                  >
                    Word Difficulty
                  </Label>
                  <p className="mb-3 text-base text-gray-500">
                    Adjust vocabulary level for stories
                  </p>
                  <Select defaultValue="age-appropriate">
                    <SelectTrigger
                      id="language-complexity"
                      className="h-12 rounded-xl border-orange-200 text-base"
                    >
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="simple" className="text-base">
                        Simple (Ages 3-5)
                      </SelectItem>
                      <SelectItem value="age-appropriate" className="text-base">
                        Just Right (Based on age)
                      </SelectItem>
                      <SelectItem value="advanced" className="text-base">
                        Advanced (Challenging words)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="account" className="mt-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-2xl border-orange-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-red-500">
                  Account Information
                </CardTitle>
                <CardDescription className="text-base">
                  Manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="parent-name"
                      className="text-xl font-bold text-gray-800"
                    >
                      Parent Name
                    </Label>
                    <Input
                      id="parent-name"
                      defaultValue="john Doe"
                      className="mt-2 h-12 rounded-xl border-orange-200 text-base"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-xl font-bold text-gray-800"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      defaultValue="parent@example.com"
                      className="mt-2 h-12 rounded-xl border-orange-200 text-base"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="password"
                      className="text-xl font-bold text-gray-800"
                    >
                      Password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        defaultValue="password123"
                        className="h-12 rounded-xl border-orange-200 pr-12 text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-4 py-2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="language"
                      className="text-xl font-bold text-gray-800"
                    >
                      Language
                    </Label>
                    <Select defaultValue="en">
                      <SelectTrigger
                        id="language"
                        className="mt-2 h-12 rounded-xl border-orange-200 text-base"
                      >
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="en" className="text-base">
                          English
                        </SelectItem>
                        <SelectItem value="es" className="text-base">
                          Español
                        </SelectItem>
                        <SelectItem value="fr" className="text-base">
                          Français
                        </SelectItem>
                        <SelectItem value="ar" className="text-base">
                          العربية
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="rounded-full bg-red-500 px-8 py-6 text-lg font-bold hover:bg-red-600"
                      onClick={() => {
                        // In a real app, this would save the settings
                        alert("Settings saved successfully!");
                      }}
                    >
                      Save Changes
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="rounded-2xl border-orange-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-red-500">
                  Kid Profiles
                </CardTitle>
                <CardDescription className="text-base">
                  Manage profiles for your children
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="rounded-xl border-2 border-orange-200 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>SD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">
                          Sara Doe
                        </h4>
                        <p className="text-base text-gray-500">Age: 7</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-xl border-orange-300 px-6 py-2 text-base font-medium text-orange-500 hover:bg-orange-50"
                      onClick={() => {
                        // In a real app, this would navigate to the edit profile page
                        alert("Edit profile functionality would open here");
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-orange-200 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">
                          Adam Doe
                        </h4>
                        <p className="text-base text-gray-500">Age: 5</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-xl border-orange-300 px-6 py-2 text-base font-medium text-orange-500 hover:bg-orange-50"
                      onClick={() => {
                        // In a real app, this would navigate to the edit profile page
                        alert("Edit profile functionality would open here");
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-xl border-4 border-dashed border-orange-300 py-6 text-lg font-bold text-orange-500 hover:bg-orange-50"
                  onClick={() => {
                    // In a real app, this would open a form to add a new profile
                    alert("Add child profile form would open here");
                  }}
                >
                  + Add Kid Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
