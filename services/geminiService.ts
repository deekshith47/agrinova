

import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import type { AnalysisResult, FertilizerRecommendation, PestInfo, PestOnMap, SoilData, WeatherAdvisoryData, YieldPredictionData, FinancialData } from '../types';
import { translations } from '../translations';

type BotTranslations = (typeof translations)['en-US']['bot'];

export const handleApiError = (error: unknown): Error => {
  let errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
  if (error instanceof Error) {
    const lowerCaseMessage = errorMessage.toLowerCase();
    if (lowerCaseMessage.includes('entity was not found') || lowerCaseMessage.includes('api key not valid')) {
      errorMessage = "The configured API Key is invalid. Please contact the administrator.";
    } else if (errorMessage.includes('429') || lowerCaseMessage.includes('quota')) {
      errorMessage = "API Rate Limit Exceeded. Please wait a moment and try again.";
    }
  }
  return new Error(errorMessage);
};
// --- End Error Handler ---

// --- API Retry Helper ---
const withRetry = async <T>(apiCall: () => Promise<T>, maxRetries = 2, initialDelay = 1000): Promise<T> => {
  let attempt = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await apiCall();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : "";
      if (attempt < maxRetries && (errorMessage.includes('429') || errorMessage.includes('quota'))) {
        attempt++;
        console.warn(`Rate limit exceeded. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Rethrow for non-retryable errors or if max retries are reached
      }
    }
  }
};
// --- End API Retry Helper ---

// --- Robust JSON Extractor ---
const extractJsonFromResponse = (response: GenerateContentResponse): any => {
    if (!response.text) {
        console.error("No text returned from API. Full response:", response);
        const candidate = response.candidates?.[0];
        const finishReason = candidate?.finishReason;
        const safetyRatings = candidate?.safetyRatings;

        if (finishReason && finishReason !== 'STOP') {
            let errorMessage = `API call finished with reason: ${finishReason}.`;
            if (safetyRatings && safetyRatings.length > 0) {
                const blockedCategories = safetyRatings
                    .filter(rating => rating.blocked)
                    .map(rating => rating.category)
                    .join(', ');
                if (blockedCategories) {
                    errorMessage += ` Blocked categories: ${blockedCategories}.`;
                }
            }
            throw new Error(errorMessage);
        }
        throw new Error("The API returned an empty or invalid response.");
    }

    const text = response.text.trim();
    // Improved regex to find JSON within markdown blocks or standalone
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```|({[\s\S]+})|(\[[\s\S]+\])/);

    if (!jsonMatch) {
        // If no block is found, try to parse the whole text. This handles cases where the model returns clean JSON.
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse response as JSON, and no JSON block found. Response text:", text);
            // Instead of throwing a generic error, we now pass on the conversational response from the model.
            throw new Error(`The model returned a non-JSON response: "${text}"`);
        }
    }
    
    // Of the capture groups, find the one that's not undefined.
    const jsonString = jsonMatch[1] || jsonMatch[2] || jsonMatch[3];

    if (!jsonString) {
        throw new Error("Found a JSON block structure, but it was empty.");
    }

    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse extracted JSON string:", jsonString, e);
        throw new Error("The model's response contained malformed JSON.");
    }
};
// --- End Robust JSON Extractor ---

const getAi = () => {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("API_KEY is not configured in the environment.");
  }
  return new GoogleGenAI({ apiKey: key });
}

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export const analyzeLeaf = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    return await withRetry(async () => {
      const ai = getAi();
      const imagePart = fileToGenerativePart(base64Image, mimeType);
      const prompt = `You are AgroVision AI, an expert agronomist specializing in Indian agriculture. Analyze this plant leaf image. Identify the primary disease OR nutrient deficiency. Your analysis must be precise and follow these instructions:
      1.  Identify the primary disease or deficiency. Prioritize common diseases, but also consider deficiencies for Sulphur, Zinc, and Iron.
      2.  Precisely estimate the percentage of the total leaf area that is visibly infected. This calculation must be meticulous: Focus ONLY on clear symptoms like lesions, spots, or rot directly caused by the disease. You MUST disregard and exclude any visual noise such as shadows, water droplets, glare, physical tears, or insect holes that are not direct symptoms of the disease. If the leaf is healthy, this value MUST be 0.

      Respond with a valid JSON object following the provided schema.`;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [ {text: prompt}, imagePart ] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosis: { type: Type.STRING, description: "Name of the disease or deficiency, e.g., 'Septoria leaf spot', 'Zinc deficiency', or 'Healthy'" },
              confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0" },
              severity: { type: Type.STRING, enum: ['Mild', 'Moderate', 'Severe', 'Unknown'] },
              infectedAreaPercent: { type: Type.NUMBER, description: "Percentage of the leaf area that is visibly affected. Should be 0 if healthy." },
              explanation: { type: Type.STRING, description: "A concise, easy-to-understand explanation in 2-3 bullet points. Each point MUST start with a '-'." },
              chemicalTreatment: { type: Type.STRING, description: "Specific chemical recommendations in bullet points. Each point MUST start with a '-'." },
              organicTreatment: { type: Type.STRING, description: "Specific organic recommendations in bullet points. Each point MUST start with a '-'." }
            },
            required: ["diagnosis", "confidence", "severity", "infectedAreaPercent", "explanation", "chemicalTreatment", "organicTreatment"]
          }
        }
      });

      // With schema enforcement, the response text is guaranteed to be a valid JSON string.
      return JSON.parse(response.text) as AnalysisResult;
    });
  } catch (err) {
    console.error("Error in analyzeLeaf:", err);
    throw handleApiError(err);
  }
};

export const generateHeatmap = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    // Note: Retries are not applied here as it's a non-critical, potentially slow operation.
    const ai = getAi();
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const prompt = `You are a pixel-perfect image segmentation model. Your SOLE function is to generate a precise, filled heatmap of diseased areas on a plant leaf.

    **ABSOLUTE RULES (FAILURE TO COMPLY WILL INVALIDATE THE RESULT):**

    1.  **IDENTIFY & FILL:** You must identify ALL pixels corresponding to disease symptoms (lesions, spots, blight, rust). You will then create a new PNG image of the exact same dimensions as the input.
    2.  **FILL, DO NOT OUTLINE:** You MUST completely FILL the identified symptom areas. Outlining, bordering, or tracing the edges of symptoms is STRICTLY FORBIDDEN. The output must be solid, filled shapes.
    3.  **EXACT COLOR:** The fill color MUST be a semi-transparent magenta with the hex code \`#FF00FF\` and 60% opacity. No other color is acceptable.
    4.  **TRANSPARENT BACKGROUND:** All non-diseased parts of the image (healthy leaf tissue, background, stems) MUST be 100% transparent.
    5.  **PIXEL PRECISION:** Your segmentation must be exact. The boundaries of the filled shapes must perfectly match the boundaries of the symptoms.
    6.  **IGNORE ARTIFACTS:** You must intelligently ignore image noise, shadows, water droplets, and highlights. Only color genuine disease symptoms.
    7.  **STRICTLY IGNORE BACKGROUND:** The background of the image (anything that is not the leaf itself) must be completely transparent. Your segmentation should be confined ONLY to the leaf area.
    8.  **FOCUS ON PRIMARY LEAF:** If multiple leaves are present, your analysis and heatmap generation MUST be confined to the most central and prominent leaf in the image. All other leaves must be ignored and treated as part of the transparent background.

    Your final output must be ONLY the raw PNG image. Do not provide any text, explanation, or code.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("Could not generate heatmap. No image was returned from the AI.");
  } catch (err) {
    console.error("Error in generateHeatmap:", err);
    throw handleApiError(err);
  }
};


export const getFertilizerRecommendation = async (soilData: SoilData, analysisResult: AnalysisResult | null, lat: number, lon: number): Promise<FertilizerRecommendation> => {
  try {
    return await withRetry(async () => {
      const ai = getAi();
      const prompt = `
        You are AgroVision AI, a world-class soil scientist and agronomist with expertise in Indian farming conditions.
        Your task is to generate a precise, weather-aware fertilizer recommendation.
        
        CRITICAL INSTRUCTIONS:
        - Use crop-specific nutrient requirement models (e.g., for Wheat, Rice, Maize).
        - Auto-scale the fertilizer amounts based on the provided field area (kg/ha -> total kg).
        - The sustainability score should reflect the eco-impact. Warn if nutrient use is excessive or unbalanced.
        - Crucially, adjust the fertilizer plan based on the crop's health. Explain this adjustment clearly in the 'diseaseIntegrationExplanation' field.
        - **Use Google Maps to get up-to-date, local context. Incorporate a simulated short-term (24-48 hour) weather forecast for the user's location. Adjust the application schedule or nutrient amounts based on significant weather events (e.g., heavy rain, extreme heat). Explain this adjustment clearly in the 'weatherIntegrationExplanation' field.**
        - ALL descriptive outputs MUST be formatted as concise bullet points. Each point MUST start with a '-'. DO NOT write paragraphs.

        User Location:
        - Latitude: ${lat}
        - Longitude: ${lon}

        Soil Data:
        - Crop: ${soilData.crop}
        - Nitrogen (N): ${soilData.n} ppm
        - Phosphorus (P): ${soilData.p} ppm
        - Potassium (K): ${soilData.k} ppm
        - Sulphur (S): ${soilData.s} ppm
        - Zinc (Zn): ${soilData.zn} ppm
        - Iron (Fe): ${soilData.fe} ppm
        - pH: ${soilData.ph}
        - Field Area: ${soilData.area} hectares

        Crop Health Status (from image analysis):
        - Diagnosis: ${analysisResult?.diagnosis || 'Not analyzed'}
        - Severity: ${analysisResult?.severity || 'Not analyzed'}

        Respond ONLY with a valid JSON object with the following schema. Do not include any conversational text, markdown formatting, or any characters outside of the JSON object.
        {
          "reasoning": "string (Reasoning in 2-4 bullet points.)",
          "diseaseIntegrationExplanation": "string (Explanation of disease-based adjustments in 1-2 bullet points.)",
          "weatherIntegrationExplanation": "string (Explanation of weather-based adjustments in 1-2 bullet points.)",
          "nutrientAmounts": {"n": "number (kg/ha)", "p": "number (kg/ha)", "k": "number (kg/ha)", "s": "number (kg/ha)", "zn": "number (kg/ha)", "fe": "number (kg/ha)"},
          "totalFertilizer": {"n": "number (total kg)", "p": "number (total kg)", "k": "number (total kg)", "s": "number (total kg)", "zn": "number (total kg)", "fe": "number (total kg)"},
          "applicationSchedule": "string (Schedule in bullet points.)",
          "totalCost": "number (Estimate total cost in INR (₹). Assume: N=₹65/kg, P=₹50/kg, K=₹40/kg, S=₹25/kg, Zn=₹150/kg, Fe=₹120/kg.)",
          "sustainabilityScore": {"score": "number (0-100)", "feedback": "string (Feedback in 1-2 bullet points.)"},
          "smartPurchaseLinks": "string (Purchase suggestions in 2-3 bullet points. Mention generic channels like 'local agricultural cooperatives', 'government fertilizer depots', or major online agri-tech platforms. Do not provide actual URLs.)"
        }
      `;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          tools: [{googleMaps: {}}],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lon
              }
            }
          }
        }
      });
      
      return extractJsonFromResponse(response) as FertilizerRecommendation;
    });
  } catch (err) {
    console.error("Error in getFertilizerRecommendation:", err);
    throw handleApiError(err);
  }
};

export const getWeatherAdvisory = async (lat: number, lon: number, crop: string | null): Promise<{ advisory: WeatherAdvisoryData, groundingChunks?: any[] }> => {
  try {
    return await withRetry(async () => {
      const ai = getAi();
      const cropContext = crop 
        ? `The user is specifically growing ${crop}. Tailor the impact analysis and all recommendations specifically for this crop.`
        : `Analyze the potential impact of this weather on typical crops in the region (focus on Indian crops).`;
      
      const prompt = `
        You are AgroVision AI, an expert agricultural meteorologist specializing in Indian climate zones.
        The user's location is latitude: ${lat}, longitude: ${lon}.
        **Use Google Maps data to understand the local geography and typical weather patterns to provide a more accurate 3-day farming advisory.**
        
        ${cropContext}

        Instructions:
        1.  Create a brief, human-readable summary of the upcoming weather.
        2.  Provide key metrics: Temperature (min/max range in Celsius), Precipitation (chance and amount in mm), and Wind (speed in km/h and direction).
        3.  For the 'impact' field, analyze the potential impact of this weather on crops. This MUST be a string containing 2-3 concise bullet points. Each point MUST start with a '-'.
        4.  For each field in 'recommendations' (irrigation, fertilizer, pesticide), provide specific, actionable advice. Each field MUST be a string containing 1-2 concise bullet points. Each point MUST start with a '-'. Be practical (e.g., "Delay nitrogen fertilizer application if heavy rain is expected to prevent runoff.").
        
        Respond ONLY with a valid JSON object following this exact schema. Do not include markdown formatting or any other text.
        {
          "summary": "string",
          "temperature": "string",
          "precipitation": "string",
          "wind": "string",
          "impact": "string (Impact analysis in 2-3 bullet points.)",
          "recommendations": {
            "irrigation": "string (Recommendations in 1-2 bullet points.)",
            "fertilizer": "string (Recommendations in 1-2 bullet points.)",
            "pesticide": "string (Recommendations in 1-2 bullet points.)"
          }
        }
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          tools: [{googleMaps: {}}],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lon
              }
            }
          }
        }
      });

      const advisory = extractJsonFromResponse(response) as WeatherAdvisoryData;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      return { advisory, groundingChunks };
    });
  } catch (err) {
    console.error("Error in getWeatherAdvisory:", err);
    throw handleApiError(err);
  }
};

export const getYieldPrediction = async (soilData: SoilData, analysisResult: AnalysisResult, lat: number, lon: number): Promise<{ prediction: YieldPredictionData, groundingChunks?: any[] }> => {
  try {
    return await withRetry(async () => {
      const ai = getAi();
      const prompt = `
      You are AgroVision AI, a senior agronomist specializing in crop yield forecasting for Indian agriculture.
      Based on the provided soil data, crop health analysis, and location, predict the potential yield and impact of the identified issue.
      **Use Google Maps data to find information about typical yields for this crop (${soilData.crop}) in this specific region of India (latitude: ${lat}, longitude: ${lon}) to ground your 'expectedYield' prediction.**

      Soil and Crop Data:
      - Crop: ${soilData.crop}
      - Field Area: ${soilData.area} hectares
      - Soil N: ${soilData.n} ppm, P: ${soilData.p} ppm, K: ${soilData.k} ppm, S: ${soilData.s} ppm, Zn: ${soilData.zn} ppm, Fe: ${soilData.fe} ppm
      - Soil pH: ${soilData.ph}

      Crop Health Analysis:
      - Diagnosis: ${analysisResult.diagnosis}
      - Severity: ${analysisResult.severity}

      Instructions:
      1.  State the crop being analyzed.
      2.  Estimate the expected yield in 'tons/hectare' for this crop under ideal conditions, considering its type and typical yields in India.
      3.  Estimate the potential percentage of yield loss due to the diagnosed issue and its severity. If the plant is 'Healthy', this should be 0.
      4.  Briefly explain the reason for the potential loss in a single, concise sentence. If the plant is 'Healthy', state 'No loss expected from disease or deficiency.'.
      5.  Provide a list of 2-3 concise, actionable mitigation strategies to minimize the predicted loss.

      Respond ONLY with a valid JSON object following this exact schema. Do not include any conversational text or markdown formatting.
      {
        "crop": "string",
        "expectedYield": "number",
        "yieldUnit": "string ('tons/hectare')",
        "potentialLossPercent": "number",
        "lossReason": "string",
        "mitigationAdvice": ["string"]
      }
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
          config: {
              tools: [{googleMaps: {}}],
              toolConfig: {
                retrievalConfig: {
                  latLng: {
                    latitude: lat,
                    longitude: lon
                  }
                }
              }
          }
      });

      const prediction = extractJsonFromResponse(response) as YieldPredictionData;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      return { prediction, groundingChunks };
    });
  } catch (err) {
    console.error("Error in getYieldPrediction:", err);
    throw handleApiError(err);
  }
};

export const getFinancialMarketData = async (crop: string): Promise<FinancialData> => {
  try {
    return await withRetry(async () => {
      const ai = getAi();
      const prompt = `
        You are an expert agricultural market analyst for India. Provide a concise financial and market price summary for the following crop: "${crop}".
        Focus on current, actionable information relevant to a farmer.

        Instructions:
        1.  currentPrice: Provide the most relevant current price, such as the government's Minimum Support Price (MSP), and specify the unit (e.g., "per quintal").
        2.  priceTrend: Indicate if the market trend is 'Rising', 'Stable', or 'Falling'.
        3.  marketInsights: Provide 2-3 concise, actionable bullet points for the farmer. Each point MUST start with a '-'.
        4.  historicalData: Provide a simplified list of prices for the last 3 months to visualize a trend. Use the format provided in the schema.
        5.  revenueContribution: Project the potential revenue contribution of the selected crop compared to 2-3 other common Indian staple crops (like Wheat, Rice). Assume a diversified farm. The total percentage must add up to 100. Provide this as an array of objects, with the first object being the selected crop.

        Respond ONLY with a valid JSON object following this exact schema.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING },
              currentPrice: {
                type: Type.OBJECT,
                properties: {
                  price: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  source: { type: Type.STRING }
                },
                required: ["price", "unit", "source"]
              },
              priceTrend: { type: Type.STRING, enum: ['Rising', 'Stable', 'Falling'] },
              marketInsights: { type: Type.STRING, description: "Market insights in 2-3 bullet points." },
              historicalData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    month: { type: Type.STRING },
                    price: { type: Type.NUMBER }
                  },
                  required: ["month", "price"]
                }
              },
              revenueContribution: {
                type: Type.ARRAY,
                description: "Projected revenue contribution compared to other staple crops.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    crop: { type: Type.STRING },
                    percentage: { type: Type.NUMBER }
                  },
                  required: ["crop", "percentage"]
                }
              }
            },
            required: ["cropName", "currentPrice", "priceTrend", "marketInsights", "historicalData", "revenueContribution"]
          }
        }
      });

      const text = response.text.trim();
      return JSON.parse(text) as FinancialData;
    });
  } catch (err) {
    console.error("Error in getFinancialMarketData:", err);
    throw handleApiError(err);
  }
};


export const getCommunityHubContributionResponse = async (base64Image: string, mimeType: string, userLabel: string): Promise<string> => {
  try {
    return await withRetry(async () => {
      const ai = getAi();
      const imagePart = fileToGenerativePart(base64Image, mimeType);
      const prompt = `You are AgroVision AI. A user has contributed an image of a plant leaf and labeled it as "${userLabel}".
      1. Briefly thank the user for their contribution.
      2. Based on the image, provide a short, encouraging confirmation. If the label seems plausible, agree with it. If it's unclear, just say it's a valuable addition for analysis.
      Example response: "Thank you for contributing! This looks like a classic case of ${userLabel}. This data helps improve our AI for everyone."
      Keep the response to 1-2 sentences.`;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [ {text: prompt}, imagePart ] },
      });

      return response.text;
    });
  } catch (err) {
    console.error("Error in getCommunityHubContributionResponse:", err);
    throw handleApiError(err);
  }
};

export const getPestPredictionsForCrop = async (lat: number, lon: number, crop: string): Promise<{ pests: PestOnMap[], groundingChunks?: any[] }> => {
  try {
    return await withRetry(async () => {
      const ai = getAi();
      const prompt = `
      You are an expert entomologist for Indian agriculture. Based on the user's location (latitude: ${lat}, longitude: ${lon}) and their crop (${crop}), predict the 5 most likely pest threats right now.
      **Use Google Maps data to find recent, local pest reports or agricultural advisories to make your predictions more accurate and location-specific.**
      Consider common pests for that crop, seasonality, and general regional risks in India.
      
      Respond ONLY with a valid JSON array following this exact schema. Do not include any conversational text or markdown formatting.
      [
          { "name": "string (pest name, e.g., 'Aphids')", "risk": "string ('High', 'Moderate', or 'Low')" },
          { "name": "string", "risk": "string" },
          { "name": "string", "risk": "string" },
          { "name": "string", "risk": "string" },
          { "name": "string", "risk": "string" }
      ]
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
          config: {
              tools: [{googleMaps: {}}],
              toolConfig: {
                retrievalConfig: {
                  latLng: {
                    latitude: lat,
                    longitude: lon
                  }
                }
              }
          }
      });

      const pests = extractJsonFromResponse(response) as PestOnMap[];
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      return { pests, groundingChunks };
    });
  } catch (err) {
    console.error("Error in getPestPredictionsForCrop:", err);
    throw handleApiError(err);
  }
};

export const getPestInformation = async (pestName: string): Promise<PestInfo> => {
  try {
    return await withRetry(async () => {
      const ai = getAi();
      const prompt = `
        You are AgroVision AI, an expert entomologist and plant pathologist specializing in Indian agriculture.
        Provide detailed information about the following pest: "${pestName}".
        
        Instruction: For all descriptive text fields ('description', 'damage', 'prevention', 'organicControl', 'chemicalControl'), the output MUST be a string containing concise bullet points. Each point must start with a '-'. DO NOT write paragraphs.

        Respond ONLY with a valid JSON object following this exact schema.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING, description: "A brief, easy-to-understand description of the pest in bullet points." },
              risk: { type: Type.STRING, enum: ['High', 'Moderate', 'Low'], description: "The typical risk level this pest poses to crops." },
              damage: { type: Type.STRING, description: "Describe the specific damage it causes to plants in bullet points." },
              prevention: { type: Type.STRING, description: "List key preventative measures in bullet points." },
              organicControl: { type: Type.STRING, description: "Suggest effective organic control methods in bullet points." },
              chemicalControl: { type: Type.STRING, description: "Suggest common chemical control methods/pesticides in India in bullet points." }
            },
            required: ["name", "description", "risk", "damage", "prevention", "organicControl", "chemicalControl"]
          }
        }
      });

      const text = response.text.trim();
      const data = JSON.parse(text);
      if (!data.name) {
        data.name = pestName;
      }
      return data as PestInfo;
    });
  } catch (err) {
    console.error("Error in getPestInformation:", err);
    throw handleApiError(err);
  }
};

export const createChat = (
    analysisResult: AnalysisResult | null,
    soilData: SoilData | null,
    recommendation: FertilizerRecommendation | null,
    prediction: YieldPredictionData | null,
    activeView: string,
    language: string, // Full language name, e.g., "English"
    botTranslations: BotTranslations
): Chat => {
    try {
        const ai = getAi();
        const t = botTranslations.system_prompt;
        
        // Build the Agro-Report context in the selected language
        let reportContext = t.report_context_none;
        if (analysisResult && soilData && recommendation) {
            let yieldContext = '';
            if (prediction) {
                const netYield = prediction.expectedYield * (1 - prediction.potentialLossPercent / 100);
                yieldContext = t.report_data_yield(netYield.toFixed(2), prediction.yieldUnit, prediction.potentialLossPercent, prediction.lossReason);
            }

            reportContext = `${t.report_context_header}
${t.report_data_leaf(analysisResult.diagnosis, analysisResult.severity)}
${t.report_data_soil(soilData.crop, soilData.ph, soilData.n, soilData.p, soilData.k, soilData.s, soilData.zn, soilData.fe)}
${t.report_data_fertilizer(recommendation.reasoning, recommendation.nutrientAmounts.n, recommendation.nutrientAmounts.p, recommendation.nutrientAmounts.k)}
${t.report_data_treatments(analysisResult.chemicalTreatment, analysisResult.organicTreatment)}
${yieldContext}`;
        }

        // Build the user's current activity context in the selected language
        let userActivityContext = '';
        switch (activeView) {
            case 'dashboard': userActivityContext = t.activity_dashboard; break;
            case 'report': userActivityContext = t.activity_report; break;
            case 'pest': userActivityContext = t.activity_pest; break;
            case 'weather': userActivityContext = t.activity_weather; break;
            case 'yield': userActivityContext = t.activity_yield; break;
            case 'community': userActivityContext = t.activity_community; break;
            case 'bot': userActivityContext = t.activity_bot; break;
            default: userActivityContext = t.activity_unknown; break;
        }

        const systemInstruction = `
${t.intro}
${t.language_instruction(language)}
${t.goal}
                
${t.user_activity_header} ${userActivityContext}
                
${reportContext}`;

        return ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    } catch(err) {
        console.error("Error creating chat:", err);
        throw handleApiError(err);
    }
};
