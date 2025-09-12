import { GoogleGenAI } from "@google/genai";

// As per guidelines, assume API_KEY is present and initialize client directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// The word generation feature has been moved to a local, offline list.
// This service is now unused for fetching words.
