"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Save, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";

type Article = {
  order: string;
  title: string;
  sections: Section[];
};

type Section = {
  number: string;
  title: string;
  paragraph: string;
  image?: string;
  letteredParagraphs: LetteredParagraph[];
  subsections: Subsection[];
};

type Subsection = {
  number: string;
  title: string;
  paragraph: string;
  letteredParagraphs: LetteredParagraph[];
};

type LetteredParagraph = {
  letter: string;
  paragraph: string;
};

type ArticlesOfAssociation = {
  _id?: string;
  annexc1: string;
  articles: Article[];
};

export default function ArticlesOfAssociationEditor() {
  const { annexId, organizationId } = useParams() as { annexId: string; organizationId: string };
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentSubsection, setCurrentSubsection] = useState<Subsection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [articlesOfAssociationId, setArticlesOfAssociationId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedArticles, setLastSavedArticles] = useState<Article[]>([]);

  const toRoman = (num: number): string => {
    const romanNumerals = [
      { value: 1000, numeral: "M" },
      { value: 900, numeral: "CM" },
      { value: 500, numeral: "D" },
      { value: 400, numeral: "CD" },
      { value: 100, numeral: "C" },
      { value: 90, numeral: "XC" },
      { value: 50, numeral: "L" },
      { value: 40, numeral: "XL" },
      { value: 10, numeral: "X" },
      { value: 9, numeral: "IX" },
      { value: 5, numeral: "V" },
      { value: 4, numeral: "IV" },
      { value: 1, numeral: "I" },
    ];

    let result = "";
    for (const { value, numeral } of romanNumerals) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  };

  useEffect(() => {
    fetchArticlesOfAssociation();
  }, []);

  useEffect(() => {
    const isChanged = JSON.stringify(articles) !== JSON.stringify(lastSavedArticles);
    setHasUnsavedChanges(isChanged);
  }, [articles, lastSavedArticles]);

  const fetchArticlesOfAssociation = async () => {
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-c1/${annexId}/articles-of-association`);
      if (response.data) {
        setArticles(response.data.articles);
        setLastSavedArticles(response.data.articles);
        setArticlesOfAssociationId(response.data._id);
      }
    } catch (error) {
      console.error("Error fetching Articles of Association:", error);
    }
  };

  const updateArticles = useCallback((newArticles: Article[]) => {
    setArticles(newArticles);
  }, []);

  const addArticle = () => {
    const newArticle: Article = {
      order: toRoman(articles.length + 1),
      title: "",
      sections: [],
    };
    updateArticles([...articles, newArticle]);
    setCurrentArticle(newArticle);
    setCurrentSection(null);
    setCurrentSubsection(null);
  };

  const removeArticle = (articleToRemove: Article) => {
    const updatedArticles = articles
      .filter((article) => article !== articleToRemove)
      .map((article, index) => ({
        ...article,
        order: toRoman(index + 1),
      }));
    updateArticles(updatedArticles);
    if (currentArticle === articleToRemove) {
      setCurrentArticle(null);
      setCurrentSection(null);
      setCurrentSubsection(null);
    }
  };

  const addSection = () => {
    if (currentArticle) {
      const newSection: Section = {
        number: (currentArticle.sections.length + 1).toString(),
        title: "",
        paragraph: "",
        letteredParagraphs: [],
        subsections: [],
      };
      const updatedArticle = {
        ...currentArticle,
        sections: [...currentArticle.sections, newSection],
      };
      updateArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
      setCurrentArticle(updatedArticle);
      setCurrentSection(newSection);
      setCurrentSubsection(null);
    }
  };

  const removeSection = (sectionToRemove: Section) => {
    if (currentArticle) {
      const updatedSections = currentArticle.sections.filter((section) => section !== sectionToRemove);
      const updatedArticle = { ...currentArticle, sections: updatedSections };
      updateArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
      setCurrentArticle(updatedArticle);
      if (currentSection === sectionToRemove) {
        setCurrentSection(null);
        setCurrentSubsection(null);
      }
    }
  };

  const addSubsection = () => {
    if (currentArticle && currentSection) {
      const newSubsection: Subsection = {
        number: "", // Changed to an empty string for manual input
        title: "",
        paragraph: "",
        letteredParagraphs: [],
      };
      const updatedSection = {
        ...currentSection,
        subsections: [...currentSection.subsections, newSubsection],
      };
      const updatedArticle = {
        ...currentArticle,
        sections: currentArticle.sections.map((s) => (s === currentSection ? updatedSection : s)),
      };
      updateArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
      setCurrentArticle(updatedArticle);
      setCurrentSection(updatedSection);
      setCurrentSubsection(newSubsection);
    }
  };

  const removeSubsection = (subsectionToRemove: Subsection) => {
    if (currentArticle && currentSection) {
      const updatedSubsections = currentSection.subsections.filter((subsection) => subsection !== subsectionToRemove);
      const updatedSection = { ...currentSection, subsections: updatedSubsections };
      const updatedArticle = {
        ...currentArticle,
        sections: currentArticle.sections.map((s) => (s === currentSection ? updatedSection : s)),
      };
      updateArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
      setCurrentArticle(updatedArticle);
      setCurrentSection(updatedSection);
      if (currentSubsection === subsectionToRemove) {
        setCurrentSubsection(null);
      }
    }
  };

  const addLetteredParagraph = (target: "section" | "subsection") => {
    if (target === "section" && currentSection) {
      const newLetteredParagraph: LetteredParagraph = {
        letter: String.fromCharCode(97 + currentSection.letteredParagraphs.length),
        paragraph: "",
      };
      const updatedSection = {
        ...currentSection,
        letteredParagraphs: [...currentSection.letteredParagraphs, newLetteredParagraph],
      };
      updateSection(updatedSection);
    } else if (target === "subsection" && currentSubsection) {
      const newLetteredParagraph: LetteredParagraph = {
        letter: String.fromCharCode(97 + currentSubsection.letteredParagraphs.length),
        paragraph: "",
      };
      const updatedSubsection = {
        ...currentSubsection,
        letteredParagraphs: [...currentSubsection.letteredParagraphs, newLetteredParagraph],
      };
      updateSubsection(updatedSubsection);
    }
  };

  const removeLetteredParagraph = (index: number, target: "section" | "subsection") => {
    if (target === "section" && currentSection) {
      const updatedLetteredParagraphs = currentSection.letteredParagraphs.filter((_, i) => i !== index);
      const updatedSection = { ...currentSection, letteredParagraphs: updatedLetteredParagraphs };
      updateSection(updatedSection);
    } else if (target === "subsection" && currentSubsection) {
      const updatedLetteredParagraphs = currentSubsection.letteredParagraphs.filter((_, i) => i !== index);
      const updatedSubsection = { ...currentSubsection, letteredParagraphs: updatedLetteredParagraphs };
      updateSubsection(updatedSubsection);
    }
  };

  const updateArticle = (field: keyof Article, value: string) => {
    if (currentArticle) {
      const updatedArticle = { ...currentArticle, [field]: value };
      updateArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
      setCurrentArticle(updatedArticle);
    }
  };

  const updateSection = (updatedSection: Section) => {
    if (currentArticle) {
      const updatedArticle = {
        ...currentArticle,
        sections: currentArticle.sections.map((s) => (s === currentSection ? updatedSection : s)),
      };
      updateArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
      setCurrentArticle(updatedArticle);
      setCurrentSection(updatedSection);
    }
  };

  const updateSubsection = (updatedSubsection: Subsection) => {
    if (currentArticle && currentSection) {
      const updatedSection = {
        ...currentSection,
        subsections: currentSection.subsections.map((s) => (s === currentSubsection ? updatedSubsection : s)),
      };
      updateSection(updatedSection);
      setCurrentSubsection(updatedSubsection);
    }
  };

  const updateLetteredParagraph = (index: number, value: string, target: "section" | "subsection") => {
    if (target === "section" && currentSection) {
      const updatedLetteredParagraphs = [...currentSection.letteredParagraphs];
      updatedLetteredParagraphs[index] = { ...updatedLetteredParagraphs[index], paragraph: value };
      const updatedSection = { ...currentSection, letteredParagraphs: updatedLetteredParagraphs };
      updateSection(updatedSection);
    } else if (target === "subsection" && currentSubsection) {
      const updatedLetteredParagraphs = [...currentSubsection.letteredParagraphs];
      updatedLetteredParagraphs[index] = { ...updatedLetteredParagraphs[index], paragraph: value };
      const updatedSubsection = { ...currentSubsection, letteredParagraphs: updatedLetteredParagraphs };
      updateSubsection(updatedSubsection);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && currentSection) {
      const file = event.target.files[0];
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/api/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.url) {
          const updatedSection = { ...currentSection, image: response.data.url };
          updateSection(updatedSection);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const removeImage = async () => {
    if (currentSection && currentSection.image) {
      try {
        const fileName = currentSection.image.split("/").pop();
        if (fileName) {
          await axios.post("/api/delete-file", { fileName });
        }
        const updatedSection = { ...currentSection, image: undefined };
        updateSection(updatedSection);
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image. Please try again.");
      }
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const articlesOfAssociation = {
        articles,
      };

      let response;
      if (articlesOfAssociationId) {
        response = await axios.put(
          `/api/annexes/${organizationId}/annex-c1/${annexId}/articles-of-association`,
          articlesOfAssociation
        );
      } else {
        response = await axios.post(
          `/api/annexes/${organizationId}/annex-c1/${annexId}/articles-of-association`,
          articlesOfAssociation
        );
      }

      setArticlesOfAssociationId(response.data._id);
      setLastSavedArticles(articles);
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert(`Failed to save draft. ${error.response?.data?.message || "Please try again."}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <button onClick={addArticle} className="btn btn-primary w-full mb-4">
            <Plus className="inline-block mr-2 h-4 w-4" /> Add Article
          </button>
          <div className="h-[calc(100vh-8rem)] overflow-y-auto">
            {articles.map((article) => (
              <div key={article.order} className="mb-2">
                <button
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded transition duration-200"
                  onClick={() => setCurrentArticle(article)}
                >
                  Article {article.order}: {article.title || "Untitled"}
                </button>
                {article.sections.map((section) => (
                  <button
                    key={section.number}
                    className="w-full text-left pl-6 py-1 text-sm hover:bg-gray-100 transition duration-200"
                    onClick={() => {
                      setCurrentArticle(article);
                      setCurrentSection(section);
                      setCurrentSubsection(null);
                    }}
                  >
                    Section {section.number}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {currentArticle && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Article {currentArticle.order}</h2>
              <button
                className="text-red-500 hover:text-red-700 transition duration-200"
                onClick={() => removeArticle(currentArticle)}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Article Title"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={currentArticle.title}
              onChange={(e) => updateArticle("title", e.target.value)}
            />
            <button onClick={addSection} className="btn bg-green-100 text-green-800">
              <Plus className="inline-block mr-2 h-4 w-4" /> Add Section
            </button>
          </div>
        )}
        {currentSection && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Section {currentSection.number}</h3>
              <button
                className="text-red-500 hover:text-red-700 transition duration-200"
                onClick={() => removeSection(currentSection)}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Section Title"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={currentSection.title}
              onChange={(e) => updateSection({ ...currentSection, title: e.target.value })}
            />
            <textarea
              placeholder="Section Paragraph"
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              value={currentSection.paragraph}
              onChange={(e) => updateSection({ ...currentSection, paragraph: e.target.value })}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Image</label>
              {currentSection.image ? (
                <div className="relative w-full h-48 mb-2">
                  <Image
                    src={currentSection.image}
                    alt="Section image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Upload an image</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              )}
            </div>
            <div className="flex space-x-4 mb-4">
              <button onClick={() => addLetteredParagraph("section")} className="btn bg-blue-100 text-blue-800">
                <Plus className="inline-block mr-2 h-4 w-4" /> Add Lettered Paragraph
              </button>
              <button onClick={addSubsection} className="btn bg-purple-100 text-purple-800">
                <Plus className="inline-block mr-2 h-4 w-4" /> Add Subsection
              </button>
            </div>

            {currentSection.letteredParagraphs.map((lp, index) => (
              <div key={lp.letter} className="flex items-center space-x-2 mb-2">
                <span className="font-medium">{lp.letter}.</span>
                <input
                  type="text"
                  placeholder="Paragraph content"
                  value={lp.paragraph}
                  onChange={(e) => updateLetteredParagraph(index, e.target.value, "section")}
                  className="flex-grow p-2 border border-gray-300 rounded"
                />
                <button
                  className="text-red-500 hover:text-red-700 transition duration-200"
                  onClick={() => removeLetteredParagraph(index, "section")}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
        {currentSubsection && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Subsection</h4>
              <button
                className="text-red-500 hover:text-red-700 transition duration-200"
                onClick={() => removeSubsection(currentSubsection)}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Subsection Number (e.g., 3.2.a)"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={currentSubsection.number}
              onChange={(e) => updateSubsection({ ...currentSubsection, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subsection Title"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={currentSubsection.title}
              onChange={(e) => updateSubsection({ ...currentSubsection, title: e.target.value })}
            />
            <textarea
              placeholder="Subsection Paragraph"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
              value={currentSubsection.paragraph}
              onChange={(e) => updateSubsection({ ...currentSubsection, paragraph: e.target.value })}
            />
            <button onClick={() => addLetteredParagraph("subsection")} className="btn bg-blue-100 text-blue-800 mb-4">
              <Plus className="inline-block mr-2 h-4 w-4" /> Add Lettered Paragraph
            </button>
            {currentSubsection.letteredParagraphs.map((lp, index) => (
              <div key={lp.letter} className="flex items-center space-x-2 mb-2">
                <span className="font-medium">{lp.letter}.</span>
                <input
                  type="text"
                  placeholder="Paragraph content"
                  value={lp.paragraph}
                  onChange={(e) => updateLetteredParagraph(index, e.target.value, "subsection")}
                  className="flex-grow p-2 border border-gray-300 rounded"
                />
                <button
                  className="text-red-500 hover:text-red-700 transition duration-200"
                  onClick={() => removeLetteredParagraph(index, "subsection")}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Pane */}
      <div className="w-1/3 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
          {articles.map((article) => (
            <div key={article.order} className="mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Article {article.order}: {article.title}
              </h3>
              {article.sections.map((section) => (
                <div key={section.number} className="ml-4 mb-4">
                  <h4 className="text-lg font-medium mb-2">
                    Section {section.number}: {section.title}
                  </h4>

                  <p className="mb-2">{section.paragraph}</p>
                  {section.letteredParagraphs.map((lp) => (
                    <p key={lp.letter} className="ml-4 mb-1">
                      {lp.letter}. {lp.paragraph}
                    </p>
                  ))}

                  {section.image && (
                    <div className="relative w-full h-48 mb-2">
                      <Image
                        src={section.image}
                        alt={`Image for Section ${section.number}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                      />
                    </div>
                  )}
                  {section.subsections.map((subsection) => (
                    <div key={subsection.number} className="ml-4 mb-2">
                      <h5 className="text-md font-medium mb-1">
                        {subsection.number}: {subsection.title}
                      </h5>
                      <p className="mb-1">{subsection.paragraph}</p>
                      {subsection.letteredParagraphs.map((lp) => (
                        <p key={lp.letter} className="ml-4 mb-1">
                          {lp.letter}. {lp.paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Save Draft Button */}
      <button
        onClick={saveDraft}
        className={`fixed bottom-4 right-4 btn btn-neutral ${hasUnsavedChanges && !isSaving ? "animate-pulse" : ""}`}
        disabled={isSaving}
      >
        <Save className="mr-2 h-5 w-5" />
        {isSaving ? "Saving..." : "Save Draft"}
      </button>
    </div>
  );
}
