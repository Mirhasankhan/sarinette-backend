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
const analyzeGenreFit = (text: string): { [key: string]: number } => {
  const genreKeywords: { [key: string]: string[] } = {
    "Case Study": ["case study", "research", "analysis", "data", "survey", "findings", "conclusion", "methodology", "evaluation", "report"],
    "Musical": ["music", "song", "melody", "composition", "rhythm", "instrument", "harmony", "lyrics", "orchestra", "performance"],
    "Article": ["news", "opinion", "human rights", "editorial", "journalism", "report", "headline", "feature", "review", "analysis"],
    "Books": ["novel", "story", "fiction", "literature", "author", "manuscript", "publishing", "biography", "poetry", "drama"],
    "Science": ["experiment", "discovery", "technology", "physics", "chemistry", "biology", "innovation", "research", "astronomy", "genetics"],
    "Business": ["startup", "finance", "entrepreneur", "economy", "investment", "marketing", "corporate", "strategy", "leadership", "commerce"],
    "Health": ["medical", "nutrition", "fitness", "therapy", "wellness", "mental health", "diet", "exercise", "treatment", "disease"],
    "History": ["past", "historical", "ancient", "civilization", "medieval", "renaissance", "war", "revolution", "archeology", "timeline"],
  };

  let genreCount: { [key: string]: number } = {};
  let totalKeywords = 0;

  Object.entries(genreKeywords).forEach(([genre, keywords]) => {
    genreCount[genre] = keywords.reduce(
      (count, keyword) => count + (text.includes(keyword) ? 1 : 0),
      0
    );
    totalKeywords += genreCount[genre];
  });

  // Normalize percentages and filter out zero percentages
  let genrePercentage: { [key: string]: number } = {};
  Object.entries(genreCount).forEach(([genre, count]) => {
    if (count > 0) {
      genrePercentage[genre] = (count / totalKeywords) * 100;
    }
  });

  return genrePercentage;
};

// Provide dynamic audience insight
const getAudienceInsight = (text: string, genres: { [key: string]: number }): { [key: string]: number } => {
  const maxScore = 1000;
  const minScore = 500;

  let genreScores: { [key: string]: number } = {};

  Object.entries(genres).forEach(([genre, percentage]) => {
    genreScores[genre] = minScore + Math.min((percentage / 100) * (maxScore - minScore), maxScore - minScore);
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

  const genrePercentage = analyzeGenreFit(text);
  const audienceInsight = getAudienceInsight(text, genrePercentage);
  const averageAudienceInsight = calculateAverageAudienceInsight(audienceInsight).toFixed(0);
  const marketabilityScore = calculateMarketabilityScore();

  return {
    genrePercentage,    
    marketabilityScore,
    averageAudienceInsight,
  };
};
