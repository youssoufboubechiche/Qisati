"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function DirectTestPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f5] p-4">
      <h1 className="mb-8 text-3xl font-bold text-red-500">Story Reading Test Page</h1>

      <div className="grid gap-6">
        <Button
          size="lg"
          className="rounded-full bg-red-500 px-8 py-6 text-xl font-bold hover:bg-red-600"
          onClick={() => router.push("/dashboard/stories/1/read")}
        >
          Read Story ID 1
        </Button>

        <Button
          size="lg"
          className="rounded-full bg-orange-500 px-8 py-6 text-xl font-bold hover:bg-orange-600"
          onClick={() => router.push("/dashboard/stories/2/read")}
        >
          Read Story ID 2
        </Button>

        <Button
          size="lg"
          className="rounded-full bg-blue-500 px-8 py-6 text-xl font-bold hover:bg-blue-600"
          onClick={() => router.push("/dashboard/stories/3/read")}
        >
          Read Story ID 3
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="mt-4 rounded-full border-gray-300 px-8 py-6 text-xl font-bold"
          onClick={() => router.push("/dashboard/stories")}
        >
          Back to Stories
        </Button>
      </div>
    </div>
  )
}

