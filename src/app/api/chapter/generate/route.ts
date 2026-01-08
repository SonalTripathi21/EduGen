import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateChapterContent } from "@/services/gemini";
import { searchVideos } from "@/services/youtube";
import { db } from "@/db";
import { chapters, courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { chapterId, courseId } = await req.json(); // using internal IDs usually, but let's see. 
        // Logic: passed chapterId (db id) or (index + courseId). Let's use internal DB chapter ID from frontend.

        // Fetch current chapter details
        const chapter = await db.select().from(chapters).where(eq(chapters.id, chapterId));
        if (!chapter.length) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });

        const course = await db.select().from(courses).where(eq(courses.id, chapter[0].courseId));

        // Generate Content
        const content = await generateChapterContent(chapter[0].name, course[0].name);

        // Fetch Video - Simplified search query for better relevance
        const searchQuery = `${chapter[0].name} ${course[0].name}`;
        console.log("Searching YouTube for:", searchQuery);
        const videos = await searchVideos(searchQuery, 1);
        const videoId = videos.length > 0 ? videos[0].videoId : null;
        console.log("Found Video ID:", videoId);

        // Update DB
        await db.update(chapters)
            .set({
                content: content,
                videoId: videoId
            })
            .where(eq(chapters.id, chapterId));

        // Revalidate course path to clear cache
        revalidatePath(`/course/${course[0].courseId}`);

        return NextResponse.json({ success: true, content, videoId });

    } catch (error) {
        console.error("Chapter Generation Error", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
