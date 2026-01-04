"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

/* ✅ ReactPlayer dynamic import with mod.default */
const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  { ssr: false }
);

export default function ChapterView({
  chapter,
  course,
  chapterIndex,
  totalChapters,
}: {
  chapter: {
    id: number;
    courseId: number;
    chapterId: number;
    name: string;
    content: any;
    videoId: string | null;
  };
  course: {
    id: number;
    courseId: string;
    name: string;
  };
  chapterIndex: number;
  totalChapters: number;
}) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  /* ✅ Mounted state to avoid hydration mismatch */
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const generateChapterContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chapter/generate", {
        method: "POST",
        body: JSON.stringify({
          chapterId: chapter.id,
          courseId: course.id,
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        console.error("Error generating content");
        alert("Error generating content");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ If content not generated */
  if (!chapter.content) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-sm border min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">
          Chapter Content Not Generated
        </h2>
        <p className="text-slate-500 mb-8 max-w-md text-center">
          Click the button below to generate chapter content using AI.
        </p>
        <button
          onClick={generateChapterContent}
          disabled={loading}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              <LightbulbIcon /> Generate Chapter Content
            </>
          )}
        </button>
      </div>
    );
  }

  const { content } = chapter;

  /* ✅ Improved videoUrl construction */
  let videoUrl: string | null = null;

  if (
    chapter.videoId &&
    typeof chapter.videoId === "string" &&
    chapter.videoId.trim() !== ""
  ) {
    videoUrl = chapter.videoId.startsWith("http")
      ? chapter.videoId
      : `https://www.youtube.com/watch?v=${chapter.videoId.trim()}`;
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* 🎥 Video Section */}
      <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video flex items-center justify-center">
        {videoUrl ? (
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls
            onError={(e) =>
              console.error("Video player error:", e)
            }
          />
        ) : (
          <div className="text-white text-center">
            No video found
          </div>
        )}
      </div>

      {/* 📘 Content Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-3xl font-bold mb-6 text-primary">
          {content.title}
        </h2>

        <div
          className="prose lg:prose-xl max-w-none mb-8"
          dangerouslySetInnerHTML={{
            __html: content.theory || "",
          }}
        />

        {content.keyConcepts && (
          <div className="bg-slate-50 p-6 rounded-lg mb-8 border">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <LightbulbIcon /> Key Concepts
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.keyConcepts.map(
                (item: string, index: number) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 p-6 rounded-lg border">
          <h3 className="font-bold text-lg mb-2 text-blue-800">
            Summary
          </h3>
          <p className="text-blue-700">
            {content.summary}
          </p>
        </div>
      </div>

      {/* 🔁 Navigation */}
      <div className="flex justify-between mt-4 mb-20">
        <button
          disabled={chapterIndex === 0}
          onClick={() =>
            router.push(
              `/course/${course.courseId}/chapter/${chapterIndex - 1}`
            )
          }
          className="px-6 py-3 border rounded-lg"
        >
          Previous Chapter
        </button>

        <button
          disabled={chapterIndex === totalChapters - 1}
          onClick={() =>
            router.push(
              `/course/${course.courseId}/chapter/${chapterIndex + 1}`
            )
          }
          className="px-6 py-3 bg-primary text-white rounded-lg"
        >
          Next Chapter
        </button>
      </div>
    </div>
  );
}

function LightbulbIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

