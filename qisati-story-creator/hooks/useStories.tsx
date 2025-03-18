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
    name: string;
  };
  pages?: StoryPage[];
}

export interface StoryPage {
  id: number;
  storyId: number;
  pageNumber: number;
  text: string;
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
  imageUrl?: string;
  suggestedDecisions?: string[];
  decisionTaken?: string;
  generationPrompt?: string;
  aiModel?: string;
  readTime?: number;
}

export interface UpdatePageData {
  text?: string;
  imageUrl?: string;
  suggestedDecisions?: string[];
  decisionTaken?: string;
  generationPrompt?: string;
  aiModel?: string;
  readTime?: number;
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
  };
};

export default useStories;
