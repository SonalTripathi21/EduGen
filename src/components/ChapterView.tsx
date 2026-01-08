"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, Lightbulb, GraduationCap, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChapterDetails {
  id: number;
  courseId: number;
  chapterId: number;
  name: string;
  content: {
    title: string;
    theory: string;
    keyConcepts?: string[];
    summary: string;
    outcomes?: string[];
    questions?: {
      question: string;
      options: string[];
      answer: string;
    }[];
  } | null;
  videoId: string | null;
}

interface CourseDetails {
  id: number;
  courseId: string;
  name: string;
}

export default function ChapterView({
  chapter,
  course,
  chapterIndex,
  totalChapters,
}: {
  chapter: ChapterDetails;
  course: CourseDetails;
  chapterIndex: number;
  totalChapters: number;
}) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  /* ✅ Mounted state to avoid hydration mismatch */
  useEffect(() => {
    setMounted(true);
  }, [chapter, course]);

  if (!mounted) return null;

  const generateChapterContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chapter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterId: chapter.id,
          courseId: course.id,
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const errorData = await res.json();
        console.error("Error generating content:", errorData.error);
        alert(`Error generating content: ${errorData.error || "Unknown error"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ If content not generated */
  if (!chapter.content) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <Lightbulb size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-slate-800">
          Chapter Content Not Generated
        </h2>
        <p className="text-slate-500 mb-8 max-w-md">
          This chapter doesn't have any AI-generated content yet. Click the button below to generate it now.
        </p>
        <button
          onClick={generateChapterContent}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Generating Content...
            </>
          ) : (
            <>
              <Lightbulb className="w-5 h-5" /> Generate Chapter Content
            </>
          )}
        </button>
      </div>
    );
  }

  const { content } = chapter;

  /* ✅ Extract YouTube ID and construct embed URL */
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = chapter.videoId ? (getYoutubeId(chapter.videoId) || chapter.videoId) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : null;
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20">
      {/* 🎥 Video Section */}
      <div className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video relative group border border-slate-800">
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={
              embedUrl ||
              `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
                `${chapter.name} ${course.name}`
              )}`
            }
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={content.title}
          ></iframe>
        </div>
      </div>

      {watchUrl && (
        <div className="flex justify-end -mt-6">
          <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-primary transition flex items-center gap-1.5 font-medium px-2 py-1 rounded-lg hover:bg-slate-50">
            <ExternalLink size={14} /> View on YouTube
          </a>
        </div>
      )}

      {/* 📘 Content Section */}
      <div className="space-y-8">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 leading-tight">
            {content.title}
          </h2>

          <div
            className="prose prose-slate lg:prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{
              __html: content.theory || "",
            }}
          />
        </div>

        {/* Learning Outcomes */}
        {content.outcomes && Array.isArray(content.outcomes) && content.outcomes.length > 0 && (
          <div className="bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100/50 transform transition hover:shadow-md">
            <h3 className="font-bold text-xl mb-6 text-indigo-900 flex items-center gap-2">
              <GraduationCap className="text-indigo-600" /> Learning Outcomes
            </h3>
            <ul className="space-y-4">
              {content.outcomes.map((item, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold leading-none mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-indigo-900/80 leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Concepts */}
        {content.keyConcepts && Array.isArray(content.keyConcepts) && content.keyConcepts.length > 0 && (
          <div className="bg-emerald-50/50 p-8 rounded-2xl border border-emerald-100/50 transform transition hover:shadow-md">
            <h3 className="font-bold text-xl mb-6 text-emerald-900 flex items-center gap-2">
              <Lightbulb className="text-emerald-600" /> Key Concepts
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.keyConcepts.map(
                (item: string, index: number) => (
                  <li key={index} className="flex gap-3 items-start bg-white/50 p-3 rounded-xl border border-emerald-100/30">
                    <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-900/80 font-medium">{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Summary */}
        <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100/50">
          <p className="text-blue-900/70 leading-relaxed text-lg">
            {content.summary}
          </p>
        </div>

        {/* 📝 Quiz Section */}
        {content.questions && content.questions.length > 0 && (
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 mt-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Chapter Quiz</h3>
                <p className="text-slate-500 text-sm">Test your knowledge of this chapter</p>
              </div>
            </div>

            <div className="space-y-10">
              {content.questions.map((q, qIndex) => (
                <div key={qIndex} className="space-y-4">
                  <h4 className="font-bold text-lg text-slate-800 flex gap-3">
                    <span className="text-slate-300">0{qIndex + 1}.</span>
                    {q.question}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, optIndex) => {
                      const isSelected = userAnswers[qIndex] === option;
                      const isCorrect = option === q.answer;
                      const showFeedback = showResults;

                      let buttonClass = "p-4 rounded-xl border text-left transition-all font-medium flex justify-between items-center group ";

                      if (!showFeedback) {
                        buttonClass += isSelected
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-600";
                      } else {
                        if (isCorrect) {
                          buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "border-red-500 bg-red-50 text-red-700";
                        } else {
                          buttonClass += "border-slate-100 opacity-50 text-slate-400";
                        }
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={showResults}
                          onClick={() => setUserAnswers({ ...userAnswers, [qIndex]: option })}
                          className={buttonClass}
                        >
                          {option}
                          {showFeedback && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-6 border-t border-slate-50 pt-10">
              {!showResults ? (
                <button
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(userAnswers).length < content.questions.length}
                  className="bg-slate-900 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
                >
                  Check Your Answers
                </button>
              ) : (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-4xl font-black mb-2 text-slate-900">
                    {Object.entries(userAnswers).filter(([idx, ans]) => ans === content.questions![Number(idx)].answer).length} / {content.questions.length}
                  </div>
                  <p className="text-slate-500 font-medium mb-6">Your Final Score</p>
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setUserAnswers({});
                    }}
                    className="text-primary font-bold hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🔁 Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200">
        <button
          disabled={chapterIndex === 0}
          onClick={() =>
            router.push(`/course/${course.courseId}/chapter/${chapterIndex - 1}`)
          }
          className="w-full sm:w-auto px-8 py-3.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
        >
          Previous Chapter
        </button>

        <div className="text-slate-400 font-medium text-sm order-first sm:order-none">
          Chapter {chapterIndex + 1} of {totalChapters}
        </div>

        <button
          disabled={chapterIndex === totalChapters - 1}
          onClick={() =>
            router.push(`/course/${course.courseId}/chapter/${chapterIndex + 1}`)
          }
          className="w-full sm:w-auto px-10 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-30 disabled:shadow-none"
        >
          Next Chapter
        </button>
      </div>
    </div>
  );
}

