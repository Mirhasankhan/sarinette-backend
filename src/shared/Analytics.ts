import fs from "fs";
import axios from "axios";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import path from "path";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);

// Function to download file from URL
const downloadFile = async (fileUrl: string): Promise<string> => {
  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

  if (response.status !== 200) {
    throw new Error("Failed to download file");
  }

  const fileExtension = path.extname(fileUrl);
  const tempFilePath = `tempFile${fileExtension}`;

  await writeFileAsync(tempFilePath, response.data);
  return tempFilePath;
};

// Extract text from PDF
const extractTextFromPDF = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// Extract text from DOCX
const extractTextFromDocx = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer: dataBuffer });
  return result.value;
};

// Analyze genre fit
const analyzeGenreFit = (text: string): string[] => {
  const genreKeywords: { [key: string]: string[] } = {
    "Case Study": ["case study", "research", "analysis", "data", "survey", "findings", "conclusion", "methodology", "evaluation", "report"],
    Musical: ["music", "song", "melody", "composition", "rhythm", "instrument", "harmony", "lyrics", "orchestra", "performance"],
    Article: ["news", "opinion", "human rights", "editorial", "journalism", "report", "headline", "feature", "review", "analysis"],
    Books: ["novel", "story", "fiction", "literature", "author", "manuscript", "publishing", "biography", "poetry", "drama"],
    Science: ["experiment", "discovery", "technology", "physics", "chemistry", "biology", "innovation", "research", "astronomy", "genetics"],
    Business: ["startup", "finance", "entrepreneur", "economy", "investment", "marketing", "corporate", "strategy", "leadership", "commerce"],
    Health: ["medical", "nutrition", "fitness", "therapy", "wellness", "mental health", "diet", "exercise", "treatment", "disease"],
    History: ["past", "historical", "ancient", "civilization", "medieval", "renaissance", "war", "revolution", "archeology", "timeline"],
  };

  let genreCount: { [key: string]: number } = {};

  Object.entries(genreKeywords).forEach(([genre, keywords]) => {
    genreCount[genre] = keywords.reduce(
      (count, keyword) => count + (text.includes(keyword) ? 1 : 0),
      0
    );
  });

  return Object.entries(genreCount)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);
};

// Provide dynamic audience insight
const getAudienceInsight = (text: string, genres: string[]): { [key: string]: number } => {
  const maxScore = 1000;
  const minScore = 500;

  const genreKeywords: { [key: string]: string[] } = {
    "Case Study": ["case study", "research", "analysis", "data", "survey", "findings", "conclusion", "methodology", "evaluation", "report"],
    Musical: ["music", "song", "melody", "composition", "rhythm", "instrument", "harmony", "lyrics", "orchestra", "performance"],
    Article: ["news", "opinion", "human rights", "editorial", "journalism", "report", "headline", "feature", "review", "analysis"],
    Books: ["novel", "story", "fiction", "literature", "author", "manuscript", "publishing", "biography", "poetry", "drama"],
    Science: ["experiment", "discovery", "technology", "physics", "chemistry", "biology", "innovation", "research", "astronomy", "genetics"],
    Business: ["startup", "finance", "entrepreneur", "economy", "investment", "marketing", "corporate", "strategy", "leadership", "commerce"],
    Health: ["medical", "nutrition", "fitness", "therapy", "wellness", "mental health", "diet", "exercise", "treatment", "disease"],
    History: ["past", "historical", "ancient", "civilization", "medieval", "renaissance", "war", "revolution", "archeology", "timeline"],
  };

  let genreScores: { [key: string]: number } = {};

  genres.forEach((genre) => {
    if (genreKeywords[genre]) {
      const keywordCount = genreKeywords[genre].reduce(
        (count, keyword) => count + (text.match(new RegExp(`\\b${keyword}\\b`, "gi")) || []).length,
        0
      );
      genreScores[genre] = minScore + Math.min(keywordCount * 90, maxScore - minScore);
    }
  });

  return genreScores;
};

// Calculate average audience insight
const calculateAverageAudienceInsight = (audienceInsights: { [key: string]: number }): number => {
  const values = Object.values(audienceInsights);
  const total = values.reduce((sum, value) => sum + value, 0);
  return values.length > 0 ? total / values.length : 0;
};
const calculateMarketabilityScore = (): number => {
  // Generate a random integer between 1 and 5
  return Math.floor(Math.random() * 5) + 1;
};




// Main function
export const getManuscriptAnalytics = async (filePathOrUrl: string) => {
  let text = "";
  let tempFilePath = filePathOrUrl;

  if (filePathOrUrl.startsWith("http")) {
    tempFilePath = await downloadFile(filePathOrUrl);
  }

  text = tempFilePath.endsWith(".pdf") ? await extractTextFromPDF(tempFilePath) : await extractTextFromDocx(tempFilePath);
  fs.unlinkSync(tempFilePath);

  const genres = analyzeGenreFit(text);
  const audienceInsight = getAudienceInsight(text, genres);
  const averageAudienceInsight = calculateAverageAudienceInsight(audienceInsight).toFixed(0);
  const marketabilityScore = calculateMarketabilityScore();

  return {
    genres:{...audienceInsight},
    // audienceInsight,
    marketabilityScore,  
    averageAudienceInsight,
  };
};
