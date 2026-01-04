import { google } from "googleapis";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});

async function testYouTube() {
    console.log("Testing YouTube API...");
    try {
        const response = await youtube.search.list({
            part: ["snippet"],
            q: "React for beginners tutorial",
            maxResults: 1,
            type: ["video"],
            relevanceLanguage: "en",
        });

        console.log("Response Items:", response.data.items);
        if (response.data.items && response.data.items.length > 0) {
            console.log("First Video ID:", response.data.items[0].id?.videoId);
        } else {
            console.log("No items found.");
        }
    } catch (error: any) {
        console.error("YouTube API Error:", error.message);
        if (error.response) {
            console.error("Details:", error.response.data);
        }
    }
}

testYouTube();
