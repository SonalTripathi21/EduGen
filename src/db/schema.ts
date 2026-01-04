import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const courses = sqliteTable("courses", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: text("course_id").notNull(),
    name: text("name").notNull(),
    userEmail: text("user_email"),
    category: text("category").notNull(),
    level: text("level").notNull(),
    duration: text("duration").notNull(),
    includeVideo: text("include_video").default("Yes"),
    courseOutput: text("course_output", { mode: "json" }),
    userName: text("user_name"),
    userProfileImage: text("user_profile_image"),
    isPublished: integer("is_published", { mode: "boolean" }).default(false),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const chapters = sqliteTable("chapters", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: integer("course_id").references(() => courses.id).notNull(),
    chapterId: integer("chapter_id").notNull(),
    name: text("name").notNull(),
    content: text("content", { mode: "json" }),
    videoId: text("video_id"),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});
