-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "setting" TEXT NOT NULL,
    "characterInfo" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "targetAge" INTEGER NOT NULL,
    "targetPages" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "coverImage" TEXT,
    "summary" TEXT,
    "tags" TEXT[],
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryPage" (
    "id" SERIAL NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT,
    "suggestedDecision1" TEXT,
    "suggestedDecision2" TEXT,
    "decisionTaken" TEXT,
    "storyId" INTEGER NOT NULL,
    "nextPageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generationPrompt" TEXT,
    "aiModel" TEXT,
    "readTime" INTEGER,

    CONSTRAINT "StoryPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Story_authorId_idx" ON "Story"("authorId");

-- CreateIndex
CREATE INDEX "Story_isPublic_isCompleted_idx" ON "Story"("isPublic", "isCompleted");

-- CreateIndex
CREATE INDEX "Story_targetAge_idx" ON "Story"("targetAge");

-- CreateIndex
CREATE UNIQUE INDEX "StoryPage_nextPageId_key" ON "StoryPage"("nextPageId");

-- CreateIndex
CREATE INDEX "StoryPage_storyId_idx" ON "StoryPage"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryPage_storyId_pageNumber_key" ON "StoryPage"("storyId", "pageNumber");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryPage" ADD CONSTRAINT "StoryPage_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryPage" ADD CONSTRAINT "StoryPage_nextPageId_fkey" FOREIGN KEY ("nextPageId") REFERENCES "StoryPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
