"use client";

import { useState } from "react";
import { Save, Delete } from "lucide-react";
type Article = {
  order: number;
  title: string;
  sections: Section[];
};

type Section = {
  number: string;
  title: string;
  paragraph: string;
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

export default function ArticleCreator() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentSubsection, setCurrentSubsection] = useState<Subsection | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addArticle = () => {
    const newArticle: Article = {
      order: articles.length + 1,
      title: "",
      sections: [],
    };
    setArticles([...articles, newArticle]);
    setCurrentArticle(newArticle);
    setCurrentSection(null);
    setCurrentSubsection(null);
  };

  

  const removeArticle = (articleToRemove: Article) => {
    const updatedArticles = articles
      .filter((article) => article !== articleToRemove)
      .map((article, index) => ({
        ...article,
        order: index + 1,
      }));
    setArticles(updatedArticles);
    if (currentArticle === articleToRemove) {
      setCurrentArticle(null);
      setCurrentSection(null);
      setCurrentSubsection(null);
    } else {
      const updatedCurrentArticle = updatedArticles.find((article) => article.title === currentArticle?.title);
      setCurrentArticle(updatedCurrentArticle || null);
    }
  };

  const addSection = () => {
    if (currentArticle) {
      const newSection: Section = {
        number: "",
        title: "",
        paragraph: "",
        letteredParagraphs: [],
        subsections: [],
      };
      const updatedArticle = {
        ...currentArticle,
        sections: [...currentArticle.sections, newSection],
      };
      setArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
      setCurrentArticle(updatedArticle);
      setCurrentSection(newSection);
      setCurrentSubsection(null);
    }
  };

  const removeSection = (sectionToRemove: Section) => {
    if (currentArticle) {
      const updatedSections = currentArticle.sections.filter((section) => section !== sectionToRemove);
      const updatedArticle = { ...currentArticle, sections: updatedSections };
      setArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
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
        number: "",
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
      setArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
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
      setArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
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
      setArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
      setCurrentArticle(updatedArticle);
    }
  };

  const updateSection = (updatedSection: Section) => {
    if (currentArticle) {
      const updatedArticle = {
        ...currentArticle,
        sections: currentArticle.sections.map((s) => (s === currentSection ? updatedSection : s)),
      };
      setArticles(articles.map((a) => (a.order === currentArticle.order ? updatedArticle : a)));
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

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Draft saved:", articles);
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex page_wrapper_height bg-base-200 relative">
      {/* Sticky Save Draft Button */}
      <button onClick={saveDraft} className="fixed  btn btn-neutral bottom-4 right-4 px-16" disabled={isSaving}>
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? "Saving..." : "Save Draft"}
      </button>

      {/* Sidebar */}
      <div className="w-64 bg-base-100 shadow-xl">
        <div className="h-full overflow-y-auto">
          <div className="p-4">
            <button onClick={addArticle} className="btn btn-sm btn-primary w-full mb-4">
              ADD ARTICLE
            </button>
            {articles.map((article) => (
              <div key={article.order} className="mb-2">
                <button className="btn btn-ghost w-full justify-start" onClick={() => setCurrentArticle(article)}>
                  Article {article.order}: {article.title || "Untitled"}
                </button>
                {article.sections.map((section) => (
                  <div key={section.number}>
                    <button
                      className="btn btn-ghost w-full justify-start pl-8 text-sm"
                      onClick={() => {
                        setCurrentArticle(article);
                        setCurrentSection(section);
                        setCurrentSubsection(null);
                      }}
                    >
                      Section {section.number}: {section.title || "Untitled"}
                    </button>
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.number}
                        className="btn btn-ghost w-full justify-start pl-12 text-xs"
                        onClick={() => {
                          setCurrentArticle(article);
                          setCurrentSection(section);
                          setCurrentSubsection(subsection);
                        }}
                      >
                        Subsection {subsection.number}: {subsection.title || "Untitled"}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        {currentArticle && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-semibold">Article {currentArticle.order}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => removeArticle(currentArticle)}>
                <Delete className="text-error w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Article Title"
              className="input input-bordered w-full"
              value={currentArticle.title}
              onChange={(e) => updateArticle("title", e.target.value)}
            />
            <button onClick={addSection} className="btn btn-secondary mr-4">
              Add Section
            </button>
          </div>
        )}
        {currentSection && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-semibold">Section</h4>
              <button className="btn btn-ghost btn-sm" onClick={() => removeSection(currentSection)}>
                <Delete className="text-error w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Section Number"
              className="input input-bordered w-full"
              value={currentSection.number}
              onChange={(e) => updateSection({ ...currentSection, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Section Title"
              className="input input-bordered w-full"
              value={currentSection.title}
              onChange={(e) => updateSection({ ...currentSection, title: e.target.value })}
            />
            <textarea
              placeholder="Section Paragraph"
              className="textarea textarea-bordered w-full h-24"
              value={currentSection.paragraph}
              onChange={(e) => updateSection({ ...currentSection, paragraph: e.target.value })}
            />
            <div className="flex space-x-4">
              <button onClick={() => addLetteredParagraph("section")} className="btn btn-secondary">
                Add Lettered Paragraph
              </button>
              <button onClick={addSubsection} className="btn btn-secondary">
                Add Subsection
              </button>
            </div>
            {currentSection.letteredParagraphs.map((lp, index) => (
              <div key={lp.letter} className="flex items-center space-x-2">
                <span>{lp.letter}.</span>
                <input
                  type="text"
                  placeholder="Paragraph content"
                  className="input input-bordered flex-grow"
                  value={lp.paragraph}
                  onChange={(e) => updateLetteredParagraph(index, e.target.value, "section")}
                />
                <button className="btn btn-ghost btn-sm" onClick={() => removeLetteredParagraph(index, "section")}>
                  <Delete className="text-error w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {currentSubsection && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-2">
              <h5 className="text-md font-semibold">Subsection</h5>
              <button className="btn btn-ghost btn-sm" onClick={() => removeSubsection(currentSubsection)}>
                <Delete className="text-error w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Subsection Number"
              className="input input-bordered w-full"
              value={currentSubsection.number}
              onChange={(e) => updateSubsection({ ...currentSubsection, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subsection Title"
              className="input input-bordered w-full"
              value={currentSubsection.title}
              onChange={(e) => updateSubsection({ ...currentSubsection, title: e.target.value })}
            />
            <textarea
              placeholder="Subsection Paragraph"
              className="textarea textarea-bordered w-full h-24"
              value={currentSubsection.paragraph}
              onChange={(e) => updateSubsection({ ...currentSubsection, paragraph: e.target.value })}
            />
            <button onClick={() => addLetteredParagraph("subsection")} className="btn btn-secondary">
              Add Lettered Paragraph
            </button>
            {currentSubsection.letteredParagraphs.map((lp, index) => (
              <div key={lp.letter} className="flex items-center space-x-2">
                <span>{lp.letter}.</span>
                <input
                  type="text"
                  placeholder="Paragraph content"
                  className="input input-bordered flex-grow"
                  value={lp.paragraph}
                  onChange={(e) => updateLetteredParagraph(index, e.target.value, "subsection")}
                />
                <button className="btn btn-ghost btn-sm" onClick={() => removeLetteredParagraph(index, "subsection")}>
                  <Delete className="text-error w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Pane */}
      <div className="w-1/3 bg-base-100 shadow-xl p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
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
                <p>{section.paragraph}</p>
                {section.letteredParagraphs.map((lp) => (
                  <p key={lp.letter} className="ml-4">
                    {lp.letter}. {lp.paragraph}
                  </p>
                ))}
                {section.subsections.map((subsection) => (
                  <div key={subsection.number} className="ml-4 mb-2">
                    <h5 className="text-md font-medium mb-1">
                      Subsection {subsection.number}: {subsection.title}
                    </h5>
                    <p>{subsection.paragraph}</p>
                    {subsection.letteredParagraphs.map((lp) => (
                      <p key={lp.letter} className="ml-4">
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
  );
}
