import { google } from "googleapis";

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});

export async function searchVideos(query: string, limit = 3) {
    try {
        const response = await youtube.search.list({
            part: ["snippet"],
            q: query,
            maxResults: limit,
            type: ["video"],
            relevanceLanguage: "en",
            videoEmbeddable: "true",
        });

        return response.data.items?.map((item) => ({
            title: item.snippet?.title,
            videoId: item.id?.videoId,
            thumbnail: item.snippet?.thumbnails?.high?.url,
            videoUrl: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
            channelTitle: item.snippet?.channelTitle,
            description: item.snippet?.description,
        })) || [];
    } catch (error) {
        console.error("YouTube API Error:", error);
        return [];
    }
}
