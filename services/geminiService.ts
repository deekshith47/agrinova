

import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import type { AnalysisResult, FertilizerRecommendation, PestInfo, PestOnMap, SoilData, WeatherAdvisoryData, YieldPredictionData, FinancialData } from '../types';

const getAi = () => {
  if (!process.env.API_KEY) {
    // This should not happen in practice because the app is gated
    // until an API key is selected, which populates process.env.API_KEY.
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  const ai = getAi();
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  const prompt = `You are AgroVision AI, an expert agronomist specializing in Indian agriculture. Analyze this plant leaf image. Identify the primary disease OR nutrient deficiency. Prioritize common diseases first, but also consider deficiencies for Sulphur, Zinc, and Iron. Also, estimate the percentage of the leaf area that is infected. Respond ONLY with a valid JSON object following this exact schema:
    {
      "diagnosis": "string (name of the disease or deficiency, e.g., 'Septoria leaf spot', 'Zinc deficiency', or 'Healthy')",
      "confidence": "number (0.0 to 1.0)",
      "severity": "string ('Mild', 'Moderate', 'Severe', or 'Unknown')",
      "infectedAreaPercent": "number (0 to 100, estimate of the percentage of the leaf area that is visibly affected. If healthy, this should be 0.)",
      "explanation": "string (A concise, easy-to-understand explanation in 2-3 bullet points. Each point MUST start with a '-'. Do not write a paragraph.)",
      "chemicalTreatment": "string (Specific chemical recommendations in bullet points. Each point MUST start with a '-'. Mention products available in India.)",
      "organicTreatment": "string (Specific organic recommendations in bullet points. Each point MUST start with a '-'. Suggest practices suitable for Indian conditions.)"
    }
  `;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [ {text: prompt}, imagePart ] },
  });

  try {
    const text = response.text.replace(/```json|```/g, '').trim();
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response:", response.text, e);
    throw new Error("Could not analyze the image. The AI response was not valid JSON.");
  }
};

export const generateHeatmap = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = getAi();
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  const prompt = `You are a pixel-perfect image segmentation model. Your SOLE function is to generate a precise, filled heatmap of diseased areas on a plant leaf.

**ABSOLUTE RULES (FAILURE TO COMPLY WILL INVALIDATE THE RESULT):**

1.  **IDENTIFY & FILL:** You must identify ALL pixels corresponding to disease symptoms (lesions, spots, blight, rust). You will then create a new PNG image of the exact same dimensions as the input.
2.  **FILL, DO NOT OUTLINE:** You MUST completely FILL the identified symptom areas. Outlining, bordering, or tracing the edges of symptoms is STRICTLY FORBIDDEN and will be considered a failed task. The output must be solid, filled shapes.
3.  **EXACT COLOR:** The fill color MUST be a semi-transparent red with the hex code \`#FF0000\` and 50% opacity. No other color is acceptable.
4.  **TRANSPARENT BACKGROUND:** All non-diseased parts of the image (healthy leaf tissue, background, stems) MUST be 100% transparent.
5.  **PIXEL PRECISION:** Your segmentation must be exact. The boundaries of the filled shapes must perfectly match the boundaries of the symptoms.
6.  **IGNORE ARTIFACTS:** You must intelligently ignore image noise, shadows, water droplets, and highlights. Only color genuine disease symptoms.

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
};


export const getFertilizerRecommendation = async (soilData: SoilData, analysisResult: AnalysisResult | null, lat: number, lon: number): Promise<FertilizerRecommendation> => {
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

    Response Schema Instructions:
    1.  reasoning: Provide 2-4 bullet points explaining the general recommendation based SOLELY on the soil data and crop type.
    2.  diseaseIntegrationExplanation: Provide 1-2 bullet points explaining how the 'Crop Health Status' specifically influenced the final nutrient amounts. If the plant is healthy, state that no disease-related adjustments were needed.
    3.  weatherIntegrationExplanation: Provide 1-2 bullet points explaining how the short-term weather forecast specifically influenced the application plan. If no significant weather is expected, state that no weather-related adjustments were needed.
    4.  nutrientAmounts: Calculate required N, P, K, S, Zn, Fe in kg/ha.
    5.  totalFertilizer: Calculate total N, P, K, S, Zn, Fe for the entire field area.
    6.  applicationSchedule: Provide a simple schedule as a list of bullet points.
    7.  totalCost: Estimate total cost in INR (₹). Assume: N=₹65/kg, P=₹50/kg, K=₹40/kg, S=₹25/kg, Zn=₹150/kg, Fe=₹120/kg.
    8.  sustainabilityScore.score: Provide a score (0-100).
    9.  sustainabilityScore.feedback: Provide 1-2 bullet points explaining the score.
    10. smartPurchaseLinks: Provide 2-3 bullet points with suggestions on where to purchase these fertilizers in India. Mention generic channels like 'local agricultural cooperatives', 'government fertilizer depots', or major online agri-tech platforms. Do not provide actual URLs.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    tools: [{googleMaps: {}}],
    toolConfig: {
      retrievalConfig: {
        latLng: {
          latitude: lat,
          longitude: lon
        }
      }
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reasoning: { type: Type.STRING, description: "Reasoning in 2-4 bullet points." },
          diseaseIntegrationExplanation: { type: Type.STRING, description: "Explanation of disease-based adjustments in 1-2 bullet points." },
          weatherIntegrationExplanation: { type: Type.STRING, description: "Explanation of weather-based adjustments in 1-2 bullet points." },
          nutrientAmounts: {
            type: Type.OBJECT,
            properties: {
              n: { type: Type.NUMBER, description: "kg/ha" },
              p: { type: Type.NUMBER, description: "kg/ha" },
              k: { type: Type.NUMBER, description: "kg/ha" },
              s: { type: Type.NUMBER, description: "kg/ha" },
              zn: { type: Type.NUMBER, description: "kg/ha" },
              fe: { type: Type.NUMBER, description: "kg/ha" },
            },
            required: ["n", "p", "k", "s", "zn", "fe"],
          },
          totalFertilizer: {
            type: Type.OBJECT,
            properties: {
              n: { type: Type.NUMBER, description: "total kg" },
              p: { type: Type.NUMBER, description: "total kg" },
              k: { type: Type.NUMBER, description: "total kg" },
              s: { type: Type.NUMBER, description: "total kg" },
              zn: { type: Type.NUMBER, description: "total kg" },
              fe: { type: Type.NUMBER, description: "total kg" },
            },
            required: ["n", "p", "k", "s", "zn", "fe"],
          },
          applicationSchedule: { type: Type.STRING, description: "Schedule in bullet points." },
          totalCost: { type: Type.NUMBER },
          sustainabilityScore: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING, description: "Feedback in 1-2 bullet points." },
            },
            required: ["score", "feedback"],
          },
          smartPurchaseLinks: { type: Type.STRING, description: "Purchase suggestions in 2-3 bullet points." },
        },
        required: ["reasoning", "diseaseIntegrationExplanation", "weatherIntegrationExplanation", "nutrientAmounts", "totalFertilizer", "applicationSchedule", "totalCost", "sustainabilityScore", "smartPurchaseLinks"],
      }
    }
  });
  
  try {
    const text = response.text.trim();
    return JSON.parse(text) as FertilizerRecommendation;
  } catch (e) {
    console.error("Failed to parse Gemini recommendation response:", response.text, e);
    throw new Error("Could not get fertilizer recommendation. The AI response was not valid JSON.");
  }
};

export const getWeatherAdvisory = async (lat: number, lon: number, crop: string | null): Promise<{ advisory: WeatherAdvisoryData, groundingChunks?: any[] }> => {
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
    
    Respond ONLY with a valid JSON object following this exact schema.
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    tools: [{googleMaps: {}}],
    toolConfig: {
      retrievalConfig: {
        latLng: {
          latitude: lat,
          longitude: lon
        }
      }
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          temperature: { type: Type.STRING },
          precipitation: { type: Type.STRING },
          wind: { type: Type.STRING },
          impact: { type: Type.STRING, description: "Impact analysis in 2-3 bullet points." },
          recommendations: {
            type: Type.OBJECT,
            properties: {
              irrigation: { type: Type.STRING, description: "Recommendations in 1-2 bullet points." },
              fertilizer: { type: Type.STRING, description: "Recommendations in 1-2 bullet points." },
              pesticide: { type: Type.STRING, description: "Recommendations in 1-2 bullet points." },
            },
            required: ["irrigation", "fertilizer", "pesticide"]
          }
        },
        required: ["summary", "temperature", "precipitation", "wind", "impact", "recommendations"]
      }
    }
  });

  try {
    const text = response.text.trim();
    const advisory = JSON.parse(text) as WeatherAdvisoryData;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return { advisory, groundingChunks };
  } catch (e) {
    console.error("Failed to parse Gemini weather response:", response.text, e);
    throw new Error("Could not get weather advisory. The AI response was not valid JSON.");
  }
};

export const getYieldPrediction = async (soilData: SoilData, analysisResult: AnalysisResult, lat: number, lon: number): Promise<{ prediction: YieldPredictionData, groundingChunks?: any[] }> => {
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

    Respond ONLY with a valid JSON object following this exact schema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lon
            }
          }
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    crop: { type: Type.STRING },
                    expectedYield: { type: Type.NUMBER },
                    yieldUnit: { type: Type.STRING, enum: ['tons/hectare'] },
                    potentialLossPercent: { type: Type.NUMBER },
                    lossReason: { type: Type.STRING },
                    mitigationAdvice: { 
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                },
                required: ["crop", "expectedYield", "yieldUnit", "potentialLossPercent", "lossReason", "mitigationAdvice"]
            }
        }
    });

    try {
        const text = response.text.trim();
        const prediction = JSON.parse(text) as YieldPredictionData;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        return { prediction, groundingChunks };
    } catch (e) {
        console.error("Failed to parse Gemini yield prediction response:", response.text, e);
        throw new Error("Could not get yield prediction. The AI response was not valid JSON.");
    }
};

export const getFinancialMarketData = async (crop: string): Promise<FinancialData> => {
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
    model: 'gemini-2.5-flash',
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

  try {
    const text = response.text.trim();
    return JSON.parse(text) as FinancialData;
  } catch (e) {
    console.error("Failed to parse Gemini financial data response:", response.text, e);
    throw new Error("Could not get financial market data. The AI response was not valid JSON.");
  }
};


export const getCommunityHubContributionResponse = async (base64Image: string, mimeType: string, userLabel: string): Promise<string> => {
  const ai = getAi();
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  const prompt = `You are AgroVision AI. A user has contributed an image of a plant leaf and labeled it as "${userLabel}".
  1. Briefly thank the user for their contribution.
  2. Based on the image, provide a short, encouraging confirmation. If the label seems plausible, agree with it. If it's unclear, just say it's a valuable addition for analysis.
  Example response: "Thank you for contributing! This looks like a classic case of ${userLabel}. This data helps improve our AI for everyone."
  Keep the response to 1-2 sentences.`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [ {text: prompt}, imagePart ] },
  });

  return response.text;
};

export const getPestPredictionsForCrop = async (lat: number, lon: number, crop: string): Promise<{ pests: PestOnMap[], groundingChunks?: any[] }> => {
    const ai = getAi();
    const prompt = `
    You are an expert entomologist for Indian agriculture. Based on the user's location (latitude: ${lat}, longitude: ${lon}) and their crop (${crop}), predict the 5 most likely pest threats right now.
    **Use Google Maps data to find recent, local pest reports or agricultural advisories to make your predictions more accurate and location-specific.**
    Consider common pests for that crop, seasonality, and general regional risks in India.
    
    Respond ONLY with a valid JSON array following this exact schema:
    [
        { "name": "string (pest name, e.g., 'Aphids')", "risk": "string ('High', 'Moderate', or 'Low')" },
        { "name": "string", "risk": "string" },
        { "name": "string", "risk": "string" },
        { "name": "string", "risk": "string" },
        { "name": "string", "risk": "string" }
    ]
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lon
            }
          }
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        risk: { type: Type.STRING, enum: ['High', 'Moderate', 'Low'] }
                    },
                    required: ["name", "risk"]
                }
            }
        }
    });

    try {
        const text = response.text.trim();
        const pests = JSON.parse(text) as PestOnMap[];
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        return { pests, groundingChunks };
    } catch (e) {
        console.error("Failed to parse Gemini pest prediction response:", response.text, e);
        throw new Error("Could not get pest predictions. The AI response was not valid JSON.");
    }
};

export const getPestInformation = async (pestName: string): Promise<PestInfo> => {
  const ai = getAi();
  const prompt = `
    You are AgroVision AI, an expert entomologist and plant pathologist specializing in Indian agriculture.
    Provide detailed information about the following pest: "${pestName}".
    
    Instruction: For all descriptive text fields ('description', 'damage', 'prevention', 'organicControl', 'chemicalControl'), the output MUST be a string containing concise bullet points. Each point must start with a '-'. DO NOT write paragraphs.

    Respond ONLY with a valid JSON object following this exact schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
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

  try {
    const text = response.text.trim();
    const data = JSON.parse(text);
    if (!data.name) {
      data.name = pestName;
    }
    return data as PestInfo;
  } catch (e) {
    console.error("Failed to parse Gemini pest info response:", response.text, e);
    throw new Error("Could not get pest information. The AI response was not valid JSON.");
  }
};

export const createChat = (
    analysisResult: AnalysisResult | null,
    soilData: SoilData | null,
    recommendation: FertilizerRecommendation | null,
    prediction: YieldPredictionData | null,
    activeView: string,
    language: string
): Chat => {
    const ai = getAi();
    
    // Context for the Agro-Report
    let reportContext = `The user has not generated an Agro-Report yet. Answer their general farming questions. You can gently encourage them to perform an analysis for more personalized advice based on their specific conditions.`;
    if (analysisResult && soilData && recommendation) {
        let yieldContext = '';
        if (prediction) {
            const netYield = prediction.expectedYield * (1 - prediction.potentialLossPercent / 100);
            yieldContext = `
        - Yield Forecast: Forecasted net yield is ${netYield.toFixed(2)} ${prediction.yieldUnit}. This is based on a potential loss of ${prediction.potentialLossPercent}% due to ${prediction.lossReason}.`;
        }

        reportContext = `You have access to the user's latest Agro-Report. Use this information to answer their questions.
        Here is the data:
        - Leaf Health Summary: Diagnosis: ${analysisResult.diagnosis}, Severity: ${analysisResult.severity}.
        - Soil Profile: Crop: ${soilData.crop}, pH: ${soilData.ph}, N: ${soilData.n}ppm, P: ${soilData.p}ppm, K: ${soilData.k}ppm, S: ${soilData.s}ppm, Zn: ${soilData.zn}ppm, Fe: ${soilData.fe}ppm.
        - Fertilizer Prescription: ${recommendation.reasoning}. Recommended rates (kg/ha) - N: ${recommendation.nutrientAmounts.n}, P: ${recommendation.nutrientAmounts.p}, K: ${recommendation.nutrientAmounts.k}.
        - Treatments: Chemical: ${analysisResult.chemicalTreatment}, Organic: ${analysisResult.organicTreatment}.${yieldContext}`;
    }

    // Context for the user's current activity
    let userActivityContext = '';
    switch (activeView) {
        case 'dashboard':
            userActivityContext = "The user is currently on the 'Analytics Dashboard', preparing to upload a leaf image and enter soil data.";
            break;
        case 'report':
            userActivityContext = "The user is currently viewing their generated 'Agro-Report'. They might have questions about the results.";
            break;
        case 'pest':
            userActivityContext = "The user is currently looking at the 'Pest Prediction Map'. They might ask about pest control or risks in their area.";
            break;
        case 'weather':
             userActivityContext = "The user is on the 'Weather Advisory' page. They may have questions about how the forecast impacts their farm.";
            break;
        case 'yield':
            userActivityContext = "The user is viewing the 'Yield Predictor' based on their latest analysis. They may ask about improving their yield.";
            break;
        case 'community':
            userActivityContext = "The user is in the 'Community Hub', possibly contributing data or viewing the leaderboard.";
            break;
        case 'bot':
            userActivityContext = "The user is currently interacting with you in the 'Agro Bot' chat.";
            break;
        default:
             userActivityContext = "The user's current context is unknown."
             break;
    }

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are Agro Bot, a friendly and knowledgeable AI assistant for farmers, specializing in Indian agriculture.
            
**CRITICAL INSTRUCTION:** The user has selected **${language}** as their language of communication. It is a STRICT and ABSOLUTE requirement that you respond ONLY in **${language}**. For example, if the user asks a question in Kannada, your entire response must also be in Kannada. Do not use any other language for any part of your response.

Your goal is to provide concise, practical, and helpful advice on farming, crop diseases, soil health, and sustainable practices. Use simple language.
            
Current User Context: ${userActivityContext}
            
${reportContext}`,
        },
    });
};