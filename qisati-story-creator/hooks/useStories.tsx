import { useState } from "react";

// Types for the API responses and requests
export interface Story {
  id: number;
  title: string;
  setting: string;
  characterInfo: string;
  genre: string;
  style: string;
  targetAge: number;
  targetPages: number;
  isCompleted: boolean;
  isPublic: boolean;
  summary: string | null;
  coverImage: string;
  tags: string[];
  viewCount: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    name: true;
  };
  pages?: StoryPage[];
}

export interface StoryPage {
  id: number;
  storyId: number;
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  suggestedDecisions?: string[];
  decisionTaken?: string;
  generationPrompt?: string;
  aiModel?: string;
  readTime?: number;
  nextPageId?: number;
  nextPage?: StoryPage;
}

export interface PaginationResult {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

export interface StoriesResponse {
  stories: Story[];
  pagination: PaginationResult;
}

export interface StoryFilters {
  isPublic?: boolean;
  isCompleted?: boolean;
  genre?: string;
  targetAge?: number;
  limit?: number;
  page?: number;
}

export interface CreateStoryData {
  title: string;
  setting: string;
  characterInfo: string;
  genre: string;
  style: string;
  targetAge: number;
  targetPages: number;
  summary?: string;
  coverImage?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateStoryData {
  title?: string;
  setting?: string;
  characterInfo?: string;
  genre?: string;
  style?: string;
  targetAge?: number;
  targetPages?: number;
  isCompleted?: boolean;
  isPublic?: boolean;
  summary?: string;
  coverImage?: string;
  tags?: string[];
}

export interface CreatePageData {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  suggestedDecisions?: string[];
  decisionTaken?: string;
  generationPrompt?: string;
  aiModel?: string;
  readTime?: number;
  pageNumber?: number;
}

export interface UpdatePageData {
  text?: string;
  imagePrompt?: string;
  imageUrl?: string;
  suggestedDecisions?: string[];
  decisionTaken?: string;
  generationPrompt?: string;
  aiModel?: string;
  readTime?: number;
}

// New interfaces for the generation endpoints
export interface StoryStartResponse {
  text: string;
  suggestedDecisions: string[];
}

export interface StoryContinuationResponse {
  text: string;
  suggestedDecisions: string[];
}

export interface ContinuationData {
  decisionTaken: string;
}

export const useStories = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle API responses
  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An error occurred");
    }
    return response.json();
  };

  // Helper function to handle errors
  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    setError(errorMessage);
    console.error("API Error:", error);
    return null;
  };

  // Get all stories with optional filters
  const getStories = async (
    filters?: StoryFilters
  ): Promise<StoriesResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.isPublic !== undefined)
          params.append("isPublic", filters.isPublic.toString());
        if (filters.isCompleted !== undefined)
          params.append("isCompleted", filters.isCompleted.toString());
        if (filters.genre) params.append("genre", filters.genre);
        if (filters.targetAge)
          params.append("targetAge", filters.targetAge.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());
        if (filters.page) params.append("page", filters.page.toString());
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`/api/stories${queryString}`);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new story
  const createStory = async (
    storyData: CreateStoryData
  ): Promise<Story | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get a single story by ID
  const getStory = async (id: number): Promise<Story | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stories/${id}`);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Update a story
  const updateStory = async (
    id: number,
    updateData: UpdateStoryData
  ): Promise<Story | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a story
  const deleteStory = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: "DELETE",
      });

      await handleResponse(response);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get all pages for a story
  const getStoryPages = async (
    storyId: number
  ): Promise<StoryPage[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stories/${storyId}/pages`);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new page for a story
  const createStoryPage = async (
    storyId: number,
    pageData: CreatePageData
  ): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stories/${storyId}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get a specific page
  const getStoryPage = async (
    storyId: number,
    pageId: number
  ): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stories/${storyId}/pages/${pageId}`);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Update a specific page
  const updateStoryPage = async (
    storyId: number,
    pageId: number,
    updateData: UpdatePageData
  ): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stories/${storyId}/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a specific page
  const deleteStoryPage = async (
    storyId: number,
    pageId: number
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stories/${storyId}/pages/${pageId}`, {
        method: "DELETE",
      });

      await handleResponse(response);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Start a story - generate the first page and save it
  const startStory = async (
    storyId: number,
    aiModel?: string
  ): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);

    try {
      // First, generate the story beginning
      const response = await fetch(`/api/stories/${storyId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const generatedData = await handleResponse(response);

      // Then save the generated content as the first page
      const pageData: CreatePageData = {
        text: generatedData.text,
        imagePrompt: generatedData.imagePrompt,
        suggestedDecisions: generatedData.suggestedDecisions,
        pageNumber: 1, // First page
        aiModel: aiModel || "openrouter", // Default or pass in preferred model
        generationPrompt: "initial_story_prompt", // Optional, for tracking what prompt was used
      };

      // Save the page to the database
      const savedPage = await createStoryPage(storyId, pageData);

      return savedPage;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Continue a story page based on a decision and save the next page
  const continueStoryPage = async (
    storyId: number,
    pageNumber: number,
    decisionTaken: string,
    aiModel?: string
  ): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);

    try {
      // First, get the current page to update it with the decision
      const pages = await getStoryPages(storyId);
      const currentPage = pages?.find((page) => page.pageNumber === pageNumber);

      if (!currentPage) {
        throw new Error("Current page not found");
      }

      // Update the current page with the decision taken
      await updateStoryPage(storyId, currentPage.id, {
        decisionTaken: decisionTaken,
      });

      // Generate the continuation
      const response = await fetch(
        `/api/stories/${storyId}/pages/${pageNumber}/continue`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decisionTaken }),
        }
      );

      const generatedData = await handleResponse(response);

      // Create the next page with the generated content
      const nextPageData: CreatePageData = {
        text: generatedData.text,
        imagePrompt: generatedData.imagePrompt,
        suggestedDecisions: generatedData.suggestedDecisions,
        pageNumber: pageNumber + 1, // Increment page number
        aiModel: aiModel || "openrouter",
        generationPrompt: `continuation_from_page_${pageNumber}`,
      };

      // Save the new page
      const savedPage = await createStoryPage(storyId, nextPageData);

      // Get the story to check if we need to mark it as completed
      const story = await getStory(storyId);

      // If this was the final page, mark the story as completed
      if (
        story &&
        nextPageData.pageNumber !== undefined &&
        nextPageData.pageNumber >= story.targetPages
      ) {
        await updateStory(storyId, { isCompleted: true });
      }

      return savedPage;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getStories,
    createStory,
    getStory,
    updateStory,
    deleteStory,
    getStoryPages,
    createStoryPage,
    getStoryPage,
    updateStoryPage,
    deleteStoryPage,
    startStory,
    continueStoryPage,
  };
};

export default useStories;
