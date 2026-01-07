import { NextResponse } from "next/server";
import { generateCourseStructure } from "@/services/gemini";
import { db } from "@/db";
import { courses, chapters } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
// I'll use a simple random string generator since I didn't install uuid.
const generateId = () => Math.random().toString(36).substring(2, 15);

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { topic, level, duration, noOfChapters } = await req.json();

        if (!topic || !level || !duration || !noOfChapters) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // 1. Generate Course Structure via AI
        const courseLayout = await generateCourseStructure(topic, level, duration, noOfChapters);

        if (!courseLayout) {
            return NextResponse.json({ error: "Failed to generate course" }, { status: 500 });
        }

        // 2. Save Course to DB
        const courseId = generateId();
        const [insertedCourse] = await db.insert(courses).values({
            courseId: courseId,
            name: courseLayout.courseTitle || topic,
            level: level,
            category: topic, // using topic as category for now
            duration: duration,
            includeVideo: "Yes",
            courseOutput: courseLayout,
            userName: user?.fullName || "User",
            userEmail: user?.primaryEmailAddress?.emailAddress || "",
        }).returning();

        // 3. Save Chapters (initially empty content)
        if (courseLayout.chapters && courseLayout.chapters.length > 0) {
            for (const [index, chapter] of courseLayout.chapters.entries()) {
                await db.insert(chapters).values({
                    courseId: insertedCourse.id,
                    chapterId: index,
                    name: chapter.name,
                    content: null, // Will be populated later
                    videoId: null
                });
            }
        }

        return NextResponse.json({ courseId: courseId, course: insertedCourse });

    } catch (error) {
        console.error("API Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
