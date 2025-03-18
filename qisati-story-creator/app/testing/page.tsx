"use client";

import { useStories, Story, StoryPage } from "@/hooks/useStories";
import { useEffect, useState } from "react";

export default function StoriesManagementPage() {
  const {
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
    continueStory,
  } = useStories();

  // State for stories data
  const [storiesData, setStoriesData] = useState<{
    stories: Story[];
    pagination: any;
  } | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyPages, setStoryPages] = useState<StoryPage[] | null>(null);
  const [selectedPage, setSelectedPage] = useState<StoryPage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState({
    isPublic: undefined as boolean | undefined,
    isCompleted: undefined as boolean | undefined,
    genre: "",
    targetAge: undefined as number | undefined,
  });

  // State for forms
  const [storyFormData, setStoryFormData] = useState({
    title: "",
    setting: "",
    characterInfo: "",
    genre: "",
    style: "",
    targetAge: 8,
    targetPages: 5,
    summary: "",
    isPublic: false,
  });

  // Added imagePrompt field here
  const [pageFormData, setPageFormData] = useState({
    text: "",
    imageUrl: "",
    imagePrompt: "",
    suggestedDecisions: ["", ""],
    readTime: 2,
  });

  // State for testing continueStory
  const [testDecision, setTestDecision] = useState("");

  // Load stories on initial render
  useEffect(() => {
    loadStories();
  }, [currentPage, filterOptions]);

  // Load stories with current filters and pagination
  const loadStories = async () => {
    const filters = {
      ...filterOptions,
      page: currentPage,
      limit: 10,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (
        filters[key as keyof typeof filters] === undefined ||
        filters[key as keyof typeof filters] === ""
      ) {
        delete filters[key as keyof typeof filters];
      }
    });

    const data = await getStories(filters);
    if (data) {
      setStoriesData(data);
    }
  };

  // Load a single story and its pages
  const loadStory = async (id: number) => {
    const story = await getStory(id);
    if (story) {
      setSelectedStory(story);
      const pages = await getStoryPages(id);
      if (pages) {
        setStoryPages(pages);
      }
    }
  };

  // Load a specific page and include imagePrompt
  const loadPage = async (storyId: number, pageId: number) => {
    const page = await getStoryPage(storyId, pageId);
    if (page) {
      setSelectedPage(page);
      setPageFormData({
        text: page.text,
        imageUrl: page.imageUrl || "",
        imagePrompt: page.imagePrompt || "",
        suggestedDecisions: page.suggestedDecisions || ["", ""],
        readTime: page.readTime || 2,
      });
    }
  };

  // Handle story form submission
  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createStory(storyFormData);
    if (result) {
      setStoryFormData({
        title: "",
        setting: "",
        characterInfo: "",
        genre: "",
        style: "",
        targetAge: 8,
        targetPages: 5,
        summary: "",
        isPublic: false,
      });
      loadStories();
    }
  };

  // Handle story update
  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStory) {
      const result = await updateStory(selectedStory.id, storyFormData);
      if (result) {
        loadStories();
        setSelectedStory(result);
      }
    }
  };

  // Handle story deletion
  const handleDeleteStory = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      const success = await deleteStory(id);
      if (success) {
        setSelectedStory(null);
        setStoryPages(null);
        loadStories();
      }
    }
  };

  // Handle page form submission
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStory) {
      const result = await createStoryPage(selectedStory.id, pageFormData);
      if (result) {
        setPageFormData({
          text: "",
          imageUrl: "",
          imagePrompt: "",
          suggestedDecisions: ["", ""],
          readTime: 2,
        });
        const pages = await getStoryPages(selectedStory.id);
        if (pages) {
          setStoryPages(pages);
        }
      }
    }
  };

  // Handle page update
  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStory && selectedPage) {
      const result = await updateStoryPage(
        selectedStory.id,
        selectedPage.id,
        pageFormData
      );
      if (result) {
        const pages = await getStoryPages(selectedStory.id);
        if (pages) {
          setStoryPages(pages);
          setSelectedPage(null);
        }
      }
    }
  };

  // Handle page deletion
  const handleDeletePage = async (pageId: number) => {
    if (
      selectedStory &&
      window.confirm("Are you sure you want to delete this page?")
    ) {
      const success = await deleteStoryPage(selectedStory.id, pageId);
      if (success) {
        setSelectedPage(null);
        const pages = await getStoryPages(selectedStory.id);
        if (pages) {
          setStoryPages(pages);
        }
      }
    }
  };

  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFilterOptions({
        ...filterOptions,
        [name]: checked,
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        [name]:
          value === ""
            ? undefined
            : name === "targetAge"
            ? parseInt(value)
            : value,
      });
    }
  };

  // Edit story form handler
  const handleEditStory = (story: Story) => {
    setSelectedStory(story);
    setStoryFormData({
      title: story.title,
      setting: story.setting,
      characterInfo: story.characterInfo,
      genre: story.genre,
      style: story.style,
      targetAge: story.targetAge,
      targetPages: story.targetPages,
      summary: story.summary || "",
      isPublic: story.isPublic,
    });
  };

  // Handle form input changes
  const handleStoryFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setStoryFormData({
        ...storyFormData,
        [name]: checked,
      });
    } else if (type === "number") {
      setStoryFormData({
        ...storyFormData,
        [name]: parseInt(value),
      });
    } else {
      setStoryFormData({
        ...storyFormData,
        [name]: value,
      });
    }
  };

  const handlePageFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setPageFormData({
        ...pageFormData,
        [name]: parseInt(value),
      });
    } else {
      setPageFormData({
        ...pageFormData,
        [name]: value,
      });
    }
  };

  // Test continueStory handler
  const handleContinueStoryTest = async () => {
    if (!selectedStory) return;
    try {
      const newPage = await continueStory(selectedStory.id, testDecision);
      if (newPage) {
        // Reload pages after continuing the story
        const updatedPages = await getStoryPages(selectedStory.id);
        setStoryPages(updatedPages);
        alert("Story continued successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to continue story.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Stories Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {/* Filters */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Public
                </label>
                <select
                  name="isPublic"
                  value={
                    filterOptions.isPublic === undefined
                      ? ""
                      : filterOptions.isPublic.toString()
                  }
                  onChange={handleFilterChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All</option>
                  <option value="true">Public</option>
                  <option value="false">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Completed
                </label>
                <select
                  name="isCompleted"
                  value={
                    filterOptions.isCompleted === undefined
                      ? ""
                      : filterOptions.isCompleted.toString()
                  }
                  onChange={handleFilterChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All</option>
                  <option value="true">Completed</option>
                  <option value="false">In Progress</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <input
                  type="text"
                  name="genre"
                  value={filterOptions.genre}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  placeholder="Any genre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Age
                </label>
                <input
                  type="number"
                  name="targetAge"
                  value={filterOptions.targetAge || ""}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  placeholder="Any age"
                />
              </div>

              <button
                onClick={() =>
                  setFilterOptions({
                    isPublic: undefined,
                    isCompleted: undefined,
                    genre: "",
                    targetAge: undefined,
                  })
                }
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Create Story Form */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              {selectedStory ? "Edit Story" : "Create New Story"}
            </h2>

            <form
              onSubmit={selectedStory ? handleUpdateStory : handleCreateStory}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={storyFormData.title}
                  onChange={handleStoryFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Setting
                </label>
                <textarea
                  name="setting"
                  value={storyFormData.setting}
                  onChange={handleStoryFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Character Info
                </label>
                <textarea
                  name="characterInfo"
                  value={storyFormData.characterInfo}
                  onChange={handleStoryFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <input
                  type="text"
                  name="genre"
                  value={storyFormData.genre}
                  onChange={handleStoryFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Style
                </label>
                <input
                  type="text"
                  name="style"
                  value={storyFormData.style}
                  onChange={handleStoryFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Age
                </label>
                <input
                  type="number"
                  name="targetAge"
                  value={storyFormData.targetAge}
                  onChange={handleStoryFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Pages
                </label>
                <input
                  type="number"
                  name="targetPages"
                  value={storyFormData.targetPages}
                  onChange={handleStoryFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Summary
                </label>
                <textarea
                  name="summary"
                  value={storyFormData.summary}
                  onChange={handleStoryFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={storyFormData.isPublic}
                  onChange={handleStoryFormChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor="isPublic"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Make Public
                </label>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {selectedStory ? "Update Story" : "Create Story"}
                </button>

                {selectedStory && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStory(null);
                      setStoryFormData({
                        title: "",
                        setting: "",
                        characterInfo: "",
                        genre: "",
                        style: "",
                        targetAge: 8,
                        targetPages: 5,
                        summary: "",
                        isPublic: false,
                      });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          {/* Stories List */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Stories</h2>

            {loading && <div className="text-center p-4">Loading...</div>}

            {!loading && storiesData && storiesData.stories.length === 0 && (
              <div className="text-center p-4">No stories found</div>
            )}

            {!loading && storiesData && storiesData.stories.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Genre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {storiesData.stories.map((story) => (
                        <tr key={story.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {story.title}
                            </div>
                            {story.pages && (
                              <div className="text-sm text-gray-500">
                                {story.pages.length} / {story.targetPages} pages
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {story.genre}
                            </div>
                            <div className="text-sm text-gray-500">
                              Age: {story.targetAge}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                story.isCompleted
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {story.isCompleted ? "Completed" : "In Progress"}
                            </span>
                            <span
                              className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                story.isPublic
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {story.isPublic ? "Public" : "Private"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => loadStory(story.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              View Pages
                            </button>
                            <button
                              onClick={() => handleEditStory(story)}
                              className="text-yellow-600 hover:text-yellow-900 mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStory(story.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {storiesData.pagination && (
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      Showing page {storiesData.pagination.currentPage} of{" "}
                      {storiesData.pagination.pages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-500"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.min(
                              storiesData.pagination.pages,
                              currentPage + 1
                            )
                          )
                        }
                        disabled={currentPage === storiesData.pagination.pages}
                        className={`px-3 py-1 rounded ${
                          currentPage === storiesData.pagination.pages
                            ? "bg-gray-200 text-gray-500"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Story Pages */}
          {selectedStory && (
            <div className="bg-white p-4 rounded shadow mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Pages for "{selectedStory.title}"
                </h2>
                <button
                  onClick={() => {
                    setSelectedStory(null);
                    setStoryPages(null);
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Back to Stories
                </button>
              </div>

              {/* Pages List */}
              {storyPages && storyPages.length === 0 && (
                <div className="text-center p-4 border border-dashed border-gray-300 rounded mb-4">
                  No pages yet. Create your first page below.
                </div>
              )}

              {storyPages && storyPages.length > 0 && (
                <div className="mb-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Preview
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Read Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {storyPages.map((page) => (
                          <tr key={page.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {page.pageNumber}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 line-clamp-2 max-w-sm">
                                {page.text.substring(0, 100)}...
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {page.readTime || "-"} min
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() =>
                                  loadPage(selectedStory.id, page.id)
                                }
                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePage(page.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Continue Story Test Section */}
              <div className="bg-green-50 p-4 rounded mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Test Continue Story
                </h3>
                <input
                  type="text"
                  placeholder="Enter decision for story continuation"
                  value={testDecision}
                  onChange={(e) => setTestDecision(e.target.value)}
                  className="border p-2 mb-4 w-full"
                />
                <button
                  onClick={handleContinueStoryTest}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Continue Story
                </button>
              </div>

              {/* Create/Edit Page Form */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">
                  {selectedPage ? "Edit Page" : "Add New Page"}
                </h3>

                <form
                  onSubmit={selectedPage ? handleUpdatePage : handleCreatePage}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Page Text
                    </label>
                    <textarea
                      name="text"
                      value={pageFormData.text}
                      onChange={handlePageFormChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={pageFormData.imageUrl}
                      onChange={handlePageFormChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  {/* New imagePrompt field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image Prompt
                    </label>
                    <input
                      type="text"
                      name="imagePrompt"
                      value={pageFormData.imagePrompt}
                      onChange={handlePageFormChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter image prompt"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pageFormData.suggestedDecisions.map((decision, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700">
                          Suggested Decision {index + 1}
                        </label>
                        <input
                          type="text"
                          name={`suggestedDecision${index}`}
                          value={decision}
                          onChange={handlePageFormChange}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Read Time (minutes)
                    </label>
                    <input
                      type="number"
                      name="readTime"
                      value={pageFormData.readTime}
                      onChange={handlePageFormChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {selectedPage ? "Update Page" : "Add Page"}
                    </button>

                    {selectedPage && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPage(null);
                          setPageFormData({
                            text: "",
                            imageUrl: "",
                            imagePrompt: "",
                            suggestedDecisions: ["", ""],
                            readTime: 2,
                          });
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
