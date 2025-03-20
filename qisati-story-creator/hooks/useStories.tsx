import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
    name: string;
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
  const queryClient = useQueryClient();

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

  // GET: Get all stories with optional filters using caching
  const getStories = async (
    filters?: StoryFilters
  ): Promise<StoriesResponse | null> => {
    setLoading(true);
    setError(null);
    const queryKey = ["stories", filters];

    try {
      const data = await queryClient.fetchQuery({
        queryKey,
        queryFn: async () => {
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
          return handleResponse(response);
        },
      });
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // POST: Create a new story and update cache accordingly
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
      // Invalidate stories list cache and set individual story cache
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.setQueryData(["story", data.id], data);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // GET: Get a single story by ID using caching
  const getStory = async (id: number): Promise<Story | null> => {
    setLoading(true);
    setError(null);
    const queryKey = ["story", id];
    try {
      const data = await queryClient.fetchQuery({
        queryKey,
        queryFn: async () => {
          const response = await fetch(`/api/stories/${id}`);
          return handleResponse(response);
        },
      });
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // PUT: Update a story and update cache accordingly
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
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.setQueryData(["story", id], data);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Delete a story and invalidate related caches
  const deleteStory = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: "DELETE",
      });
      await handleResponse(response);
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.removeQueries({ queryKey: ["story", id] });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // GET: Get all pages for a story using caching
  const getStoryPages = async (
    storyId: number
  ): Promise<StoryPage[] | null> => {
    setLoading(true);
    setError(null);
    const queryKey = ["storyPages", storyId];
    try {
      const data = await queryClient.fetchQuery({
        queryKey,
        queryFn: async () => {
          const response = await fetch(`/api/stories/${storyId}/pages`);
          return handleResponse(response);
        },
      });
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // POST: Create a new page for a story and update cache accordingly
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
      // Invalidate pages cache for the story
      queryClient.invalidateQueries({ queryKey: ["storyPages", storyId] });
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // GET: Get a specific page using caching
  const getStoryPage = async (
    storyId: number,
    pageId: number
  ): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);
    // Use a composite key combining story and page
    const queryKey = ["storyPage", storyId, pageId];
    try {
      const data = await queryClient.fetchQuery({
        queryKey,
        queryFn: async () => {
          const response = await fetch(
            `/api/stories/${storyId}/pages/${pageId}`
          );
          return handleResponse(response);
        },
      });
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // PATCH: Update a specific page and update cache accordingly
  const updateStoryPage = async (
    storyId: number,
    pageNumber: number,
    updateData: UpdatePageData
  ): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/stories/${storyId}/pages/${pageNumber}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );
      const data = await handleResponse(response);
      queryClient.invalidateQueries({ queryKey: ["storyPages", storyId] });
      // Also update the specific page cache if needed
      queryClient.setQueryData(["storyPage", storyId, data.id], data);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Delete a specific page and invalidate related caches
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
      queryClient.invalidateQueries({ queryKey: ["storyPages", storyId] });
      queryClient.removeQueries({ queryKey: ["storyPage", storyId, pageId] });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // POST: Start a story - generate the first page, save it and update cache
  const startStory = async (storyId: number): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);
    try {
      // Generate the story beginning
      const response = await fetch(`/api/stories/${storyId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const generatedData = await handleResponse(response);
      const pageData: CreatePageData = {
        text: generatedData.text,
        imagePrompt: generatedData.imagePrompt,
        suggestedDecisions: generatedData.suggestedDecisions,
        pageNumber: 1, // First page
        aiModel: generatedData.model,
        generationPrompt: generatedData.prompt,
      };
      const savedPage = await createStoryPage(storyId, pageData);
      return savedPage;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // POST: Continue a story - update last page, generate and save the next page
  const continueStory = async (
    storyId: number,
    decisionTaken: string
  ): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);
    try {
      // Get last page and update it with the decision
      const pages = await getStoryPages(storyId);
      const lastPage = pages?.[pages.length - 1];
      if (!lastPage) {
        throw new Error("Last page not found");
      }
      const updateResponse = await updateStoryPage(
        storyId,
        lastPage.pageNumber,
        { decisionTaken }
      );
      if (!updateResponse) {
        throw new Error("Failed to update last page");
      }
      const response = await fetch(`/api/stories/${storyId}/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisionTaken }),
      });
      const generatedData = await handleResponse(response);
      const nextPageData: CreatePageData = {
        text: generatedData.text,
        imagePrompt: generatedData.imagePrompt,
        suggestedDecisions: generatedData.suggestedDecisions,
        pageNumber: lastPage.pageNumber + 1,
        aiModel: generatedData.model,
        generationPrompt: generatedData.prompt,
      };
      const savedPage = await createStoryPage(storyId, nextPageData);
      // Check if the story should be marked as completed
      const story = await getStory(storyId);
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

  // POST: Continue a specific story page based on a decision and save the next page
  const continueStoryPage = async (
    storyId: number,
    pageNumber: number,
    decisionTaken: string
  ): Promise<StoryPage | null> => {
    setLoading(true);
    setError(null);
    try {
      // Find the current page to update it with the decision
      const pages = await getStoryPages(storyId);
      const currentPage = pages?.find((page) => page.pageNumber === pageNumber);
      if (!currentPage) {
        throw new Error("Current page not found");
      }
      // Update the current page with the decision taken
      await updateStoryPage(storyId, currentPage.id, { decisionTaken });
      const response = await fetch(
        `/api/stories/${storyId}/pages/${pageNumber}/continue`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decisionTaken }),
        }
      );
      const generatedData = await handleResponse(response);
      const nextPageData: CreatePageData = {
        text: generatedData.text,
        imagePrompt: generatedData.imagePrompt,
        suggestedDecisions: generatedData.suggestedDecisions,
        pageNumber: pageNumber + 1,
        aiModel: generatedData.model,
        generationPrompt: generatedData.prompt,
      };
      const savedPage = await createStoryPage(storyId, nextPageData);
      // Check if we need to mark the story as completed
      const story = await getStory(storyId);
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
    continueStory,
    continueStoryPage,
  };
};

export default useStories;
