import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
});

export async function generateCourseStructure(topic: string, level: string, duration: string, noOfChapters: number) {
    const prompt = `
    Generate a course layout for the following topic: "${topic}".
    Level: ${level}
    Duration: ${duration}
    Number of Chapters: ${noOfChapters}

    Return a strictly valid JSON object with the following structure:
    {
      "courseTitle": "Generate a creative title",
      "chapters": [
        {
          "chapterId": 1,
          "name": "Chapter Title",
          "summary": "Brief summary of what this chapter covers"
        }
      ]
    }
    Ensure the JSON is clean and plain text, no markdown backticks.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Error:", error);
        return null;
    }
}

export async function generateChapterContent(chapterName: string, courseTitle: string) {
    const prompt = `
        Explain the chapter "${chapterName}" for the course "${courseTitle}".
        Provide detailed theoretical content, key concepts, a summary, and learning outcomes.
        
        Return a strictly valid JSON object:
        {
            "title": "${chapterName}",
            "theory": "Detailed explanation as HTML string (use <h3>, <p>, <ul>, <li> tags for formatting)",
            "keyConcepts": ["Concept 1", "Concept 2"],
            "summary": "Concise summary",
            "outcomes": ["Outcome 1", "Outcome 2"]
        }
        Ensure the JSON is clean and plain text, no markdown backticks.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Content Error:", error);
        return null;
    }
}
