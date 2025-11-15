export type Language = 'en-US' | 'hi-IN' | 'kn-IN';
export const translations = {
    'en-US': {
        features: {
            title: "Welcome to the Future of Farming",
            subtitle: "Harnessing AI to empower farmers with precision, insight, and community.",
            aiDetection: { title: "AI Disease Detection", description: "Instantly identify crop diseases from a single photo." },
            fertilizer: { title: "Soil-Specific Advice", description: "Get fertilizer recommendations tailored to your soil data." },
            yield: { title: "Yield Prediction", description: "Forecast your potential harvest and mitigate risks early." },
            alerts: { title: "Hyperlocal Pest Alerts", description: "Receive real-time warnings about pests in your specific area." },
            hub: { title: "Community Hub", description: "Contribute data and learn from a network of fellow farmers." },
            bot: { title: "24/7 Agro Bot", description: "Your AI farming expert, ready to answer any question." },
            continueButton: "Get Started"
        },
        login: {
            welcome: "Welcome Back!",
            subtitle: "Your partner in precision agriculture.",
            signInTitle: "Sign In",
            signInSubtitle: "Enter your details to access your dashboard.",
            emailLabel: "Email",
            passwordLabel: "Password",
            signInButton: "Sign In"
        },
        nav: {
            dashboard: "Dashboard", report: "Agro-Report", pest: "Pest Map", weather: "Weather", yield: "Yield", economics: "Economics", market: "Market Prices", stores: "Stores", community: "Community", bot: "Agro Bot", profile: "Profile", analysis: "ANALYSIS", tools: "TOOLS", econ: "Econ"
        },
        dashboard: {
            leafAnalysis: {
                title: "1. Leaf Disease Analysis",
                uploadAriaLabel: "Upload a leaf photo for analysis",
                uploadPrompt: "Click to upload a photo",
                uploadSubprompt: "or drag and drop",
                imageAlt: "Uploaded leaf preview",
                heatmapAlt: "Heatmap of infected areas",
                showInfected: "Show Infected Areas",
                analyzeButton: "Analyze Leaf",
                loadingAnalyzing: "Analyzing...",
                loadingVisualizing: "Visualizing...",
                errorSelectImage: "Please select an image file first."
            },
            soilInput: {
                title: "2. Soil & Field Data",
                cropLabel: "Select Crop",
                nLabel: "Nitrogen (N)", pLabel: "Phosphorus (P)", kLabel: "Potassium (K)", sLabel: "Sulphur (S)", znLabel: "Zinc (Zn)", feLabel: "Iron (Fe)",
                phLabel: "Soil pH",
                areaLabel: "Field Area",
                areaUnit: "hectares",
                getRecommendationButton: "Get Full Agro-Report",
                getRecommendationTooltip: "First, analyze a leaf to enable this.",
                errorArea: "Please enter a valid, positive number for the area.",
                errorGeolocation: "Geolocation is not supported by this browser.",
                errorLocationServices: "Could not retrieve location. Please enable location services."
            }
        },
        report: {
            title: "Your Agro-Report",
            exportButton: "Export", exportAriaLabel: "Export report as PDF",
            newReportButton: "New Report", newReportAriaLabel: "Start a new analysis",
            placeholder: {
                title: "Your Agro-Report Awaits",
                subtitle: "Start by uploading a leaf photo and entering your soil data on the Dashboard. Your personalized report will appear here.",
                features: {
                    disease: { title: "Disease Diagnosis", description: "Identify issues with AI precision." },
                    fertilizer: { title: "Fertilizer Plan", description: "Custom nutrient mix for your crop." },
                    yield: { title: "Yield Forecast", description: "Predict your harvest potential." },
                    weather: { title: "Weather Advisory", description: "Get local, farm-specific forecasts." },
                    pest: { title: "Pest Alerts", description: "See common pests in your area." },
                    econ: { title: "Economic Insights", description: "Cost analysis and sustainability." }
                }
            },
            disease: { title: "Leaf Health Analysis", diagnosis: "Diagnosis", confidence: "Confidence", severity: "Severity", chemical: "Chemical Treatment", organic: "Organic Treatment" },
            infectedArea: { title: "Infected Area", mild: "Mild", moderate: "Moderate", severe: "Severe", unknown: "Unknown" },
            reasoning: { title: "AI Reasoning & Explanation", disease: "Disease Analysis Explanation", fertilizer: "Fertilizer Recommendation Rationale" },
            completePrompt: {
                title: "Complete Your Analysis",
                subtitle: "Add your <strong>Soil & Field Data</strong> on the Dashboard.",
                unlocksTitle: "This will unlock:",
                unlocksItems: ["Personalized Fertilizer Plan", "Yield Prediction", "Economic Analysis"]
            },
            yield: { title: "Yield Prediction", baseline: "Baseline Yield", loss: "Potential Loss", net: "Net Forecasted Yield", reason: "Reason for Loss", advice: "Mitigation Advice" },
            fertilizer: {
                title: "Fertilizer Recommendation",
                subtitle: "Based on your soil data, crop type, and leaf analysis.",
                crop: "Crop", area: "Area", ph: "pH",
                rate: "Application Rate", total: (area: number) => `Total for ${area} ha`,
                integration: "Integration with Disease Analysis", weather: "Weather-Aware Adjustments", schedule: "Application Schedule"
            },
            loadingAdvisories: "Fetching local advisories...",
            errorExtraData: "Could not fetch extra advisory data: ",
            errorLocation: "Could not retrieve location for advisories.",
            weather: { title: "Hyperlocal Weather Advisory", temperature: "Temperature", precipitation: "Precipitation", wind: "Wind", impact: "Impact on Crop", recommendations: "Recommendations", irrigation: "Irrigation", fertilizerRec: "Fertilizer", pesticide: "Pesticide" },
            pest: { title: "Local Pest Prediction", subtitle: (crop: string) => `Common pests for ${crop} in your area.`, risk: "Risk", high: "High", moderate: "Moderate", low: "Low" },
            sources: { title: "Data Sources", ariaLabel: "Visit data source", linkDefault: "Unnamed Source" }
        },
        economics: {
            title: "Economics & Sustainability",
            subtitle: "Based on your personalized fertilizer recommendation.",
            unlockMessage: "Complete a full analysis on the Dashboard to unlock cost estimations and sustainability scores.",
            costEstimation: { title: "Estimated Fertilizer Cost", label: "Total Estimated Cost" },
            sustainability: { title: "Sustainability Score", scoreLabel: "Eco-Friendly Score" },
            purchase: { title: "Smart Purchase Suggestions" }
        },
        financial: {
            title: "Financial & Market Prices",
            selectCrop: "Select a Crop to Analyze",
            chooseCrop: "-- Choose a crop --",
            loading: "Fetching latest market data...",
            placeholder: {
                title: "Market Insights Await",
                subtitle: "Select a crop from the dropdown above to get the latest AI-powered financial analysis, price trends, and a revenue contribution pie chart."
            },
            currentPrice: (source: string) => `Current Market Price (${source})`,
            perUnit: (unit: string) => `/${unit}`,
            trend: "Market Trend",
            rising: "Rising",
            stable: "Stable",
            falling: "Falling",
            insights: "AI Market Insights",
            chart3Month: "3-Month Price Trend (₹)",
            chartRevenue: "Projected Revenue Contribution"
        },
        stores: {
            title: "Nearby Stores & Reviews",
            placeholder: {
                title: "Find Nearby Fertilizer Stores",
                subtitle: "Complete a full analysis on the \"Dashboard\" to get a fertilizer recommendation. This tool will then find local stores, show what they stock, and display farmer reviews."
            },
            loading: "Finding nearby stores with reviews...",
            errorLocation: "Could not retrieve location. Please enable location services in your browser.",
            errorGeolocation: "Geolocation is not supported by your browser.",
            subtitle: "Here are the nearest stores that have the fertilizers you need, based on your Agro-Report. Ratings are based on community reviews.",
            noStores: {
                title: "No Stores Found",
                subtitle: "We couldn't find any stores within a 10km radius that stock the specific fertilizers from your recommendation."
            },
            distanceAway: (dist: string) => `${dist} km away`,
            availableProducts: "Available Products You Need:",
            call: "Call Store",
            directions: "Directions"
        },
        profile: {
            title: "Progressive Farmer",
            comingSoon: { title: "Full Profile Coming Soon!", subtitle: "Track your history and achievements." }
        },
        bot: {
            title: "Agro Bot Assistant",
            welcome: "Hello! I'm Agro Bot. How can I help you with your farm today? Ask me about crop diseases, soil health, or anything else!",
            placeholder: "Ask Agro Bot a question...",
            listening: "Listening...",
            sendAriaLabel: "Send message",
            startListening: "Start voice command",
            stopListening: "Stop voice command",
            mute: "Mute voice",
            unmute: "Unmute voice",
            errors: {
                retry: (delay: number, attempt: number, max: number) => `Connection is busy. Retrying in ${delay}s... (Attempt ${attempt}/${max})`,
                unexpected: "There was an unexpected error. Please try again.",
                noSpeech: "No speech was detected. Please try again.",
                network: "Network error. Please check your connection and try again.",
                micBlocked: "Microphone access is blocked. Please enable it in your browser settings."
            },
            system_prompt: {
                intro: "You are Agro Bot, a friendly and knowledgeable AI assistant for farmers, specializing in Indian agriculture.",
                goal: "Your goal is to provide concise, practical, and helpful advice on farming, crop diseases, soil health, and sustainable practices. Use simple language.",
                language_instruction: (lang: string) => `**CRITICAL INSTRUCTION:** The user has selected **${lang}** as their language of communication. It is a STRICT and ABSOLUTE requirement that you respond ONLY in **${lang}**. Do not use any other language for any part of your response.`,
                user_activity_header: "Current User Context:",
                activity_dashboard: "The user is currently on the 'Analytics Dashboard', preparing to upload a leaf image and enter soil data.",
                activity_report: "The user is currently viewing their generated 'Agro-Report'. They might have questions about the results.",
                activity_pest: "The user is currently looking at the 'Pest Prediction Map'. They might ask about pest control or risks in their area.",
                activity_weather: "The user is on the 'Weather Advisory' page. They may have questions about how the forecast impacts their farm.",
                activity_yield: "The user is viewing the 'Yield Predictor' based on their latest analysis. They may ask about improving their yield.",
                activity_community: "The user is in the 'Community Hub', possibly contributing data or viewing the leaderboard.",
                activity_bot: "The user is currently interacting with you in the 'Agro Bot' chat.",
                activity_unknown: "The user's current context is unknown.",
                report_context_none: "The user has not generated an Agro-Report yet. Answer their general farming questions. You can gently encourage them to perform an analysis for more personalized advice based on their specific conditions.",
                report_context_header: "You have access to the user's latest Agro-Report. Use this information to answer their questions. Here is the data:",
                report_data_leaf: (diag: string, sev: string) => `- Leaf Health Summary: Diagnosis: ${diag}, Severity: ${sev}.`,
                report_data_soil: (crop: any, ph: any, n: any, p: any, k: any, s: any, zn: any, fe: any) => `- Soil Profile: Crop: ${crop}, pH: ${ph}, N: ${n}ppm, P: ${p}ppm, K: ${k}ppm, S: ${s}ppm, Zn: ${zn}ppm, Fe: ${fe}ppm.`,
                report_data_fertilizer: (reason: string, n: any, p: any, k: any) => `- Fertilizer Prescription: ${reason}. Recommended rates (kg/ha) - N: ${n}, P: ${p}, K: ${k}.`,
                report_data_treatments: (chem: string, org: string) => `- Treatments: Chemical: ${chem}, Organic: ${org}.`,
                report_data_yield: (yieldNum: string, unit: string, loss: any, reason: string) => `- Yield Forecast: Forecasted net yield is ${yieldNum} ${unit}. This is based on a potential loss of ${loss}% due to ${reason}.`
            }
        },
        pest: {
            title: "Pest Prediction Map",
            placeholder: {
                title: "Hyperlocal Pest Prediction",
                subtitle: "Complete a soil analysis on the <strong>Dashboard</strong> to see a map of likely pest threats for your crop and location."
            },
            loading: (crop: string) => `Predicting pest threats for ${crop}...`,
            errorLocation: "Could not get location. Please enable location services.",
            errorGeolocation: "Geolocation not supported by this browser.",
            success: {
                subtitle: (crop: string) => `Based on your location and crop (${crop}), here are the most likely pest threats. Click any pest for more details.`,
                listTitle: "Predicted Pests"
            },

            yourLocation: "Your Location",
            getInfoFor: "Get information for",
            risk: "Risk", high: "High", moderate: "Moderate", low: "Low",
            modal: {
                title: "Pest Information",
                loading: "Fetching detailed pest information...",
                close: "Close",
                damage: "Potential Damage",
                prevention: "Prevention Methods",
                organic: "Organic Control",
                chemical: "Chemical Control"
            },
            sources: { title: "Data Sources", ariaLabel: "Visit data source", linkDefault: "Unnamed Source" }
        },
        weather: {
            title: "Hyperlocal Weather Advisory",
            prompt: {
                title: "Get a Farm-Specific Forecast",
                subtitle: "Get a 3-day weather advisory tailored to your location and crop type to help you plan irrigation, fertilization, and pesticide application.",
                button: "Get My Advisory"
            },
            loading: "Fetching your local weather advisory...",
            error: {
                title: "Failed to Fetch Weather",
                button: "Try Again"
            },

            errorLocation: "Could not retrieve location. Please enable location services.",
            errorGeolocation: "Geolocation is not supported by your browser.",
            success: {
                personalized: (crop: string) => `Personalized advisory for your ${crop} crop.`,
                summaryTitle: "Weather Summary",
                temperature: "Temperature",
                precipitation: "Precipitation",
                wind: "Wind",
                impactTitle: "Impact on Your Crop",
                recommendationsTitle: "AI-Powered Recommendations",
                irrigation: "Irrigation",
                fertilizer: "Fertilizer",
                pesticide: "Pesticide",
                refreshButton: "Refresh Advisory"
            },
            sources: { title: "Data Sources", ariaLabel: "Visit data source", linkDefault: "Unnamed Source" }
        },
        yield: {
            title: "Yield Predictor",
            placeholder: {
                title: "Unlock Your Yield Prediction",
                subtitle: "First, complete the <strong>Leaf Analysis</strong> and <strong>Soil Data</strong> sections on the Dashboard to generate a personalized yield forecast."
            },
            ready: {
                title: "Yield Prediction Ready",
                subtitle: "Your yield prediction has been calculated and is available in the main Agro-Report."
            },
            baseline: "Baseline Yield",
            loss: "Potential Loss",
            net: "Net Forecasted Yield",
            reason: "Reason for Loss",
            advice: "Mitigation Advice",
            sources: { title: "Data Sources", ariaLabel: "Visit data source", linkDefault: "Unnamed Source" }
        },
        community: {
            title: "Contribute to the Community AI",
            subtitle: "Help improve AgroVision AI by uploading your own plant leaf images and labeling them. Every contribution makes the AI smarter for everyone.",
            upload: {
                prompt: "Click to upload a photo",
                subprompt: "or drag and drop",
                ariaLabel: "Upload a leaf photo to contribute"
            },
            label: "1. Add a diagnosis label",
            labelPlaceholder: "Select a diagnosis...",
            labelHelp: "Choose the diagnosis that best matches your uploaded image.",
            contributeButton: "Contribute (+20 Agro Credits)",
            error: "Please upload an image and select a diagnosis label.",
            success: {
                title: "Contribution Received!",
                contributeAnother: "Contribute another image"
            },
            leaderboard: {
                title: "Community Leaderboard",
                contributions: "contributions",
                credits: "Credits"
            }
        }
    },
    'hi-IN': {
        features: {
            title: "खेती के भविष्य में आपका स्वागत है",
            subtitle: "किसानों को सटीकता, अंतर्दृष्टि और समुदाय के साथ सशक्त बनाने के लिए AI का उपयोग।",
            aiDetection: { title: "AI रोग पहचान", description: "एक ही तस्वीर से फसल रोगों की तुरंत पहचान करें।" },
            fertilizer: { title: "मिट्टी-विशिष्ट सलाह", description: "अपनी मिट्टी के आंकड़ों के अनुसार उर्वरक सिफारिशें प्राप्त करें।" },
            yield: { title: "उपज भविष्यवाणी", description: "अपनी संभावित फसल का पूर्वानुमान लगाएं और जोखिमों को जल्दी कम करें।" },
            alerts: { title: "हाइपरलोकल कीट अलर्ट", description: "अपने विशिष्ट क्षेत्र में कीटों के बारे में वास्तविक समय पर चेतावनी प्राप्त करें।" },
            hub: { title: "किसान समुदाय हब", description: "डेटा का योगदान करें और साथी किसानों के नेटवर्क से सीखें।" },
            bot: { title: "24/7 एग्रो बॉट", description: "आपका AI खेती विशेषज्ञ, किसी भी प्रश्न का उत्तर देने के लिए तैयार।" },
            continueButton: "शुरू करें"
        },
        login: {
            welcome: "वापसी पर स्वागत है!",
            subtitle: "सटीक कृषि में आपका साथी।",
            signInTitle: "साइन इन करें",
            signInSubtitle: "अपने डैशबोर्ड तक पहुंचने के लिए अपना विवरण दर्ज करें।",
            emailLabel: "ईमेल",
            passwordLabel: "पासवर्ड",
            signInButton: "साइन इन करें"
        },
        nav: {
            dashboard: "डैशबोर्ड", report: "एग्रो-रिपोर्ट", pest: "कीट नक्शा", weather: "मौसम", yield: "उपज", economics: "अर्थशास्त्र", market: "बाजार मूल्य", stores: "स्टोर", community: "समुदाय", bot: "एग्रो बॉट", profile: "प्रोफ़ाइल", analysis: "विश्लेषण", tools: "उपकरण", econ: "अर्थ"
        },
        dashboard: {
            leafAnalysis: {
                title: "1. पत्ती रोग विश्लेषण",
                uploadAriaLabel: "विश्लेषण के लिए एक पत्ती की तस्वीर अपलोड करें",
                uploadPrompt: "एक तस्वीर अपलोड करने के लिए क्लिक करें",
                uploadSubprompt: "या खींचें और छोड़ें",
                imageAlt: "अपलोड की गई पत्ती का पूर्वावलोकन",
                heatmapAlt: "संक्रमित क्षेत्रों का हीटमैप",
                showInfected: "संक्रमित क्षेत्र दिखाएं",
                analyzeButton: "पत्ती का विश्लेषण करें",
                loadingAnalyzing: "विश्लेषण हो रहा है...",
                loadingVisualizing: "विज़ुअलाइज़ हो रहा है...",
                errorSelectImage: "कृपया पहले एक छवि फ़ाइल चुनें।"
            },
            soilInput: {
                title: "2. मिट्टी और खेत का डेटा",
                cropLabel: "फसल चुनें",
                nLabel: "नाइट्रोजन (N)", pLabel: "फास्फोरस (P)", kLabel: "पोटेशियम (K)", sLabel: "सल्फर (S)", znLabel: "जिंक (Zn)", feLabel: "आयरन (Fe)",
                phLabel: "मिट्टी का pH",
                areaLabel: "खेत का क्षेत्रफल",
                areaUnit: "हेक्टेयर",
                getRecommendationButton: "पूरी एग्रो-रिपोर्ट प्राप्त करें",
                getRecommendationTooltip: "इसे सक्षम करने के लिए पहले एक पत्ती का विश्लेषण करें।",
                errorArea: "कृपया क्षेत्रफल के लिए एक मान्य, सकारात्मक संख्या दर्ज करें।",
                errorGeolocation: "यह ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है।",
                errorLocationServices: "स्थान प्राप्त नहीं किया जा सका। कृपया स्थान सेवाएं सक्षम करें।"
            }
        },
        report: {
            title: "आपकी एग्रो-रिपोर्ट",
            exportButton: "निर्यात", exportAriaLabel: "रिपोर्ट को पीडीएफ के रूप में निर्यात करें",
            newReportButton: "नई रिपोर्ट", newReportAriaLabel: "एक नया विश्लेषण शुरू करें",
            placeholder: {
                title: "आपकी एग्रो-रिपोर्ट प्रतीक्षारत है",
                subtitle: "डैशबोर्ड पर एक पत्ती की तस्वीर अपलोड करके और अपनी मिट्टी का डेटा दर्ज करके शुरू करें। आपकी व्यक्तिगत रिपोर्ट यहां दिखाई देगी।",
                features: {
                    disease: { title: "रोग निदान", description: "AI सटीकता के साथ समस्याओं की पहचान करें।" },
                    fertilizer: { title: "उर्वरक योजना", description: "आपकी फसल के लिए कस्टम पोषक तत्व मिश्रण।" },
                    yield: { title: "उपज पूर्वानुमान", description: "अपनी फसल की क्षमता का पूर्वानुमान लगाएं।" },
                    weather: { title: "मौसम सलाह", description: "स्थानीय, खेत-विशिष्ट पूर्वानुमान प्राप्त करें।" },
                    pest: { title: "कीट अलर्ट", description: "अपने क्षेत्र में आम कीट देखें।" },
                    econ: { title: "आर्थिक अंतर्दृष्टि", description: "लागत विश्लेषण और स्थिरता।" }
                }
            },
            disease: { title: "पत्ती स्वास्थ्य विश्लेषण", diagnosis: "निदान", confidence: "आत्मविश्वास", severity: "गंभीरता", chemical: "रासायनिक उपचार", organic: "जैविक उपचार" },
            infectedArea: { title: "संक्रमित क्षेत्र", mild: "हल्का", moderate: "मध्यम", severe: "गंभीर", unknown: "अज्ञात" },
            reasoning: { title: "AI तर्क और स्पष्टीकरण", disease: "रोग विश्लेषण स्पष्टीकरण", fertilizer: "उर्वरक सिफारिश का तर्क" },
            completePrompt: {
                title: "अपना विश्लेषण पूरा करें",
                subtitle: "डैशबोर्ड पर अपनी <strong>मिट्टी और खेत का डेटा</strong> जोड़ें।",
                unlocksTitle: "यह अनलॉक करेगा:",
                unlocksItems: ["व्यक्तिगत उर्वरक योजना", "उपज भविष्यवाणी", "आर्थिक विश्लेषण"]
            },
            yield: { title: "उपज भविष्यवाणी", baseline: "आधारभूत उपज", loss: "संभावित हानि", net: "शुद्ध अनुमानित उपज", reason: "हानि का कारण", advice: "शमन सलाह" },
            fertilizer: {
                title: "उर्वरक सिफारिश",
                subtitle: "आपकी मिट्टी के डेटा, फसल के प्रकार और पत्ती विश्लेषण के आधार पर।",
                crop: "फसल", area: "क्षेत्रफल", ph: "pH",
                rate: "आवेदन दर", total: (area: number) => `${area} हेक्टेयर के लिए कुल`,
                integration: "रोग विश्लेषण के साथ एकीकरण", weather: "मौसम-जागरूक समायोजन", schedule: "आवेदन अनुसूची"
            },
            loadingAdvisories: "स्थानीय सलाह प्राप्त हो रही है...",
            errorExtraData: "अतिरिक्त सलाहकार डेटा प्राप्त नहीं किया जा सका: ",
            errorLocation: "सलाह के लिए स्थान प्राप्त नहीं किया जा सका।",
            weather: { title: "हाइपरलोकल मौसम सलाह", temperature: "तापमान", precipitation: "वर्षा", wind: "हवा", impact: "फसल पर प्रभाव", recommendations: "सिफारिशें", irrigation: "सिंचाई", fertilizerRec: "उर्वरक", pesticide: "कीटनाशक" },
            pest: { title: "स्थानीय कीट भविष्यवाणी", subtitle: (crop: string) => `आपके क्षेत्र में ${crop} के लिए आम कीट।`, risk: "जोखिम", high: "उच्च", moderate: "मध्यम", low: "कम" },
            sources: { title: "डेटा स्रोत", ariaLabel: "डेटा स्रोत पर जाएं", linkDefault: "अनाम स्रोत" }
        },
        economics: {
            title: "अर्थशास्त्र और स्थिरता",
            subtitle: "आपकी व्यक्तिगत उर्वरक सिफारिश के आधार पर।",
            unlockMessage: "लागत अनुमान और स्थिरता स्कोर अनलॉक करने के लिए डैशबोर्ड पर एक पूर्ण विश्लेषण पूरा करें।",
            costEstimation: { title: "अनुमानित उर्वरक लागत", label: "कुल अनुमानित लागत" },
            sustainability: { title: "स्थिरता स्कोर", scoreLabel: "पर्यावरण-अनुकूल स्कोर" },
            purchase: { title: "स्मार्ट खरीद सुझाव" }
        },
        financial: {
            title: "वित्तीय और बाजार मूल्य",
            selectCrop: "विश्लेषण के लिए एक फसल चुनें",
            chooseCrop: "-- एक फसल चुनें --",
            loading: "नवीनतम बाजार डेटा प्राप्त हो रहा है...",
            placeholder: {
                title: "बाजार अंतर्दृष्टि प्रतीक्षारत है",
                subtitle: "नवीनतम एआई-संचालित वित्तीय विश्लेषण, मूल्य रुझान, और राजस्व योगदान पाई चार्ट प्राप्त करने के लिए ऊपर ड्रॉपडाउन से एक फसल चुनें।"
            },
            currentPrice: (source: string) => `वर्तमान बाजार मूल्य (${source})`,
            perUnit: (unit: string) => `/${unit}`,
            trend: "बाजार की प्रवृत्ति",
            rising: "बढ़ रहा है",
            stable: "स्थिर",
            falling: "गिर रहा है",
            insights: "एआई बाजार अंतर्दृष्टि",
            chart3Month: "3-महीने का मूल्य रुझान (₹)",
            chartRevenue: "अनुमानित राजस्व योगदान"
        },
        stores: {
            title: "आस-पास के स्टोर और समीक्षाएं",
            placeholder: {
                title: "आस-पास के उर्वरक स्टोर खोजें",
                subtitle: "उर्वरक सिफारिश प्राप्त करने के लिए \"डैशबोर्ड\" पर एक पूर्ण विश्लेषण पूरा करें। यह उपकरण तब स्थानीय स्टोर ढूंढेगा, दिखाएगा कि वे क्या स्टॉक करते हैं, और किसान समीक्षाएं प्रदर्शित करेगा।"
            },
            loading: "आस-पास के स्टोर और समीक्षाएं ढूंढी जा रही हैं...",
            errorLocation: "स्थान प्राप्त नहीं किया जा सका। कृपया अपने ब्राउज़र में स्थान सेवाएं सक्षम करें।",
            errorGeolocation: "आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है।",
            subtitle: "यहां आपके एग्रो-रिपोर्ट के आधार पर आपकी जरूरत के उर्वरक वाले निकटतम स्टोर हैं। रेटिंग समुदाय समीक्षाओं पर आधारित हैं।",
            noStores: {
                title: "कोई स्टोर नहीं मिला",
                subtitle: "हमें आपकी सिफारिश से विशिष्ट उर्वरकों का स्टॉक करने वाले 10 किमी के दायरे में कोई स्टोर नहीं मिला।"
            },
            distanceAway: (dist: string) => `${dist} किमी दूर`,
            availableProducts: "आपके लिए आवश्यक उपलब्ध उत्पाद:",
            call: "स्टोर को कॉल करें",
            directions: "दिशा-निर्देश"
        },
        profile: {
            title: "प्रगतिशील किसान",
            comingSoon: { title: "पूर्ण प्रोफ़ाइल जल्द ही आ रही है!", subtitle: "अपने इतिहास और उपलब्धियों को ट्रैक करें।" }
        },
        bot: {
            title: "एग्रो बॉट सहायक",
            welcome: "नमस्ते! मैं एग्रो बॉट हूँ। आज मैं आपके खेत में कैसे मदद कर सकता हूँ? मुझसे फसल रोगों, मिट्टी के स्वास्थ्य, या किसी और चीज़ के बारे में पूछें!",
            placeholder: "एग्रो बॉट से एक प्रश्न पूछें...",
            listening: "सुन रहा हूँ...",
            sendAriaLabel: "संदेश भेजें",
            startListening: "वॉइस कमांड शुरू करें",
            stopListening: "वॉइस कमांड रोकें",
            mute: "आवाज बंद करें",
            unmute: "आवाज चालू करें",
            errors: {
                retry: (delay: number, attempt: number, max: number) => `कनेक्शन व्यस्त है। ${delay} सेकंड में पुनः प्रयास कर रहा हूँ... (प्रयास ${attempt}/${max})`,
                unexpected: "एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।",
                noSpeech: "कोई भाषण नहीं मिला। कृपया पुन: प्रयास करें।",
                network: "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।",
                micBlocked: "माइक्रोफोन का उपयोग अवरुद्ध है। कृपया इसे अपनी ब्राउज़र सेटिंग्स में सक्षम करें।"
            },
            system_prompt: {
                intro: "आप एग्रो बॉट हैं, जो भारतीय कृषि में विशेषज्ञता रखने वाले किसानों के लिए एक मैत्रीपूर्ण और जानकार एआई सहायक है।",
                goal: "आपका लक्ष्य खेती, फसल रोगों, मिट्टी के स्वास्थ्य और टिकाऊ प्रथाओं पर संक्षिप्त, व्यावहारिक और सहायक सलाह देना है। सरल भाषा का प्रयोग करें।",
                language_instruction: (lang: string) => `**महत्वपूर्ण निर्देश:** उपयोगकर्ता ने संचार की भाषा के रूप में **${lang}** का चयन किया है। यह एक सख्त और पूर्ण आवश्यकता है कि आप केवल **${lang}** में ही जवाब दें। किसी अन्य भाषा का प्रयोग न करें।`,
                user_activity_header: "वर्तमान उपयोगकर्ता प्रसंग:",
                activity_dashboard: "उपयोगकर्ता वर्तमान में 'एनालिटिक्स डैशबोर्ड' पर है, पत्ती की छवि अपलोड करने और मिट्टी का डेटा दर्ज करने की तैयारी कर रहा है।",
                activity_report: "उपयोगकर्ता वर्तमान में अपनी उत्पन्न 'एग्रो-रिपोर्ट' देख रहा है। उनके परिणामों के बारे में प्रश्न हो सकते हैं।",
                activity_pest: "उपयोगकर्ता वर्तमान में 'कीट भविष्यवाणी मानचित्र' देख रहा है। वे अपने क्षेत्र में कीट नियंत्रण या जोखिमों के बारे में पूछ सकते हैं।",
                activity_weather: "उपयोगकर्ता 'मौसम सलाहकार' पृष्ठ पर है। उनके पास पूर्वानुमान उनके खेत को कैसे प्रभावित करता है, इस बारे में प्रश्न हो सकते हैं।",
                activity_yield: "उपयोगकर्ता अपने नवीनतम विश्लेषण के आधार पर 'उपज भविष्यवक्ता' देख रहा है। वे अपनी उपज में सुधार के बारे में पूछ सकते हैं।",
                activity_community: "उपयोगकर्ता 'सामुदायिक हब' में है, संभवतः डेटा का योगदान कर रहा है या लीडरबोर्ड देख रहा है।",
                activity_bot: "उपयोगकर्ता वर्तमान में 'एग्रो बॉट' चैट में आपके साथ बातचीत कर रहा है।",
                activity_unknown: "उपयोगकर्ता का वर्तमान प्रसंग अज्ञात है।",
                report_context_none: "उपयोगकर्ता ने अभी तक एग्रो-रिपोर्ट नहीं बनाई है। उनके सामान्य खेती के सवालों का जवाब दें। आप उन्हें उनकी विशिष्ट स्थितियों के आधार पर अधिक व्यक्तिगत सलाह के लिए विश्लेषण करने के लिए धीरे-धीरे प्रोत्साहित कर सकते हैं।",
                report_context_header: "आपके पास उपयोगकर्ता की नवीनतम एग्रो-रिपोर्ट तक पहुंच है। उनके सवालों का जवाब देने के लिए इस जानकारी का उपयोग करें। यहाँ डेटा है:",
                report_data_leaf: (diag, sev) => `- पत्ती स्वास्थ्य सारांश: निदान: ${diag}, गंभीरता: ${sev}।`,
                report_data_soil: (crop, ph, n, p, k, s, zn, fe) => `- मिट्टी प्रोफाइल: फसल: ${crop}, पीएच: ${ph}, एन: ${n}पीपीएम, पी: ${p}पीपीएम, के: ${k}पीपीएम, एस: ${s}पीपीएम, जेडएन: ${zn}पीपीएम, एफई: ${fe}पीपीएम।`,
                report_data_fertilizer: (reason, n, p, k) => `- उर्वरक प्रिस्क्रिप्शन: ${reason}। अनुशंसित दरें (किग्रा/हेक्टेयर) - एन: ${n}, पी: ${p}, के: ${k}।`,
                report_data_treatments: (chem, org) => `- उपचार: रासायनिक: ${chem}, जैविक: ${org}।`,
                report_data_yield: (yieldNum, unit, loss, reason) => `- उपज पूर्वानुमान: अनुमानित शुद्ध उपज ${yieldNum} ${unit} है। यह ${reason} के कारण ${loss}% की संभावित हानि पर आधारित है।`
            }
        },
        pest: {
            title: "कीट भविष्यवाणी नक्शा",
            placeholder: {
                title: "हाइपरलोकल कीट भविष्यवाणी",
                subtitle: "अपनी फसल और स्थान के लिए संभावित कीट खतरों का नक्शा देखने के लिए <strong>डैशबोर्ड</strong> पर मिट्टी का विश्लेषण पूरा करें।"
            },
            loading: (crop: string) => `${crop} के लिए कीट खतरों की भविष्यवाणी हो रही है...`,
            errorLocation: "स्थान प्राप्त नहीं किया जा सका। कृपया स्थान सेवाएं सक्षम करें।",
            errorGeolocation: "जियोलोकेशन समर्थित नहीं है।",
            success: {
                subtitle: (crop: string) => `आपके स्थान और फसल (${crop}) के आधार पर, यहां सबसे संभावित कीट खतरे हैं। अधिक विवरण के लिए किसी भी कीट पर क्लिक करें।`,
                listTitle: "अनुमानित कीट"
            },
            yourLocation: "आपका स्थान",
            getInfoFor: "के लिए जानकारी प्राप्त करें",
            risk: "जोखिम", high: "उच्च", moderate: "मध्यम", low: "कम",
            modal: {
                title: "कीट जानकारी",
                loading: "विस्तृत कीट जानकारी प्राप्त हो रही है...",
                close: "बंद करें",
                damage: "संभावित नुकसान",
                prevention: "रोकथाम के तरीके",
                organic: "जैविक नियंत्रण",
                chemical: "रासायनिक नियंत्रण"
            },
            sources: { title: "डेटा स्रोत", ariaLabel: "डेटा स्रोत पर जाएं", linkDefault: "अनाम स्रोत" }
        },
        weather: {
            title: "हाइपरलोकल मौसम सलाह",
            prompt: {
                title: "खेत-विशिष्ट पूर्वानुमान प्राप्त करें",
                subtitle: "सिंचाई, उर्वरीकरण और कीटनाशक आवेदन की योजना बनाने में मदद के लिए अपने स्थान और फसल प्रकार के अनुरूप 3-दिवसीय मौसम सलाह प्राप्त करें।",
                button: "मेरी सलाह प्राप्त करें"
            },
            loading: "आपकी स्थानीय मौसम सलाह प्राप्त हो रही है...",
            error: {
                title: "मौसम प्राप्त करने में विफल",
                button: "पुनः प्रयास करें"
            },
            errorLocation: "स्थान प्राप्त नहीं किया जा सका। कृपया स्थान सेवाएं सक्षम करें।",
            errorGeolocation: "आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है।",
            success: {
                personalized: (crop: string) => `आपकी ${crop} फसल के लिए व्यक्तिगत सलाह।`,
                summaryTitle: "मौसम सारांश",
                temperature: "तापमान",
                precipitation: "वर्षा",
                wind: "हवा",
                impactTitle: "आपकी फसल पर प्रभाव",
                recommendationsTitle: "एआई-संचालित सिफारिशें",
                irrigation: "सिंचाई",
                fertilizer: "उर्वरक",
                pesticide: "कीटनाशक",
                refreshButton: "सलाह ताज़ा करें"
            },
            sources: { title: "डेटा स्रोत", ariaLabel: "डेटा स्रोत पर जाएं", linkDefault: "अनाम स्रोत" }
        },
        yield: {
            title: "उपज भविष्यवक्ता",
            placeholder: {
                title: "अपनी उपज भविष्यवाणी अनलॉक करें",
                subtitle: "पहले, एक व्यक्तिगत उपज पूर्वानुमान उत्पन्न करने के लिए डैशबोर्ड पर <strong>पत्ती विश्लेषण</strong> और <strong>मिट्टी डेटा</strong> अनुभागों को पूरा करें।"
            },
            ready: {
                title: "उपज भविष्यवाणी तैयार है",
                subtitle: "आपकी उपज भविष्यवाणी की गणना कर ली गई है और यह मुख्य एग्रो-रिपोर्ट में उपलब्ध है।"
            },
            baseline: "आधारभूत उपज",
            loss: "संभावित हानि",
            net: "शुद्ध अनुमानित उपज",
            reason: "हानि का कारण",
            advice: "शमन सलाह",
            sources: { title: "डेटा स्रोत", ariaLabel: "डेटा स्रोत पर जाएं", linkDefault: "अनाम स्रोत" }
        },
        community: {
            title: "सामुदायिक एआई में योगदान करें",
            subtitle: "अपनी खुद की पौधों की पत्ती की छवियों को अपलोड और लेबल करके एग्रोविजन एआई को बेहतर बनाने में मदद करें। हर योगदान एआई को सभी के लिए होशियार बनाता है।",
            upload: {
                prompt: "एक तस्वीर अपलोड करने के लिए क्लिक करें",
                subprompt: "या खींचें और छोड़ें",
                ariaLabel: "योगदान करने के लिए एक पत्ती की तस्वीर अपलोड करें"
            },
            label: "1. एक निदान लेबल जोड़ें",
            labelPlaceholder: "एक निदान चुनें...",
            labelHelp: "वह निदान चुनें जो आपकी अपलोड की गई छवि से सबसे अच्छा मेल खाता हो।",
            contributeButton: "योगदान करें (+20 एग्रो क्रेडिट)",
            error: "कृपया एक छवि अपलोड करें और एक निदान लेबल चुनें।",
            success: {
                title: "योगदान प्राप्त हुआ!",
                contributeAnother: "एक और छवि का योगदान करें"
            },
            leaderboard: {
                title: "सामुदायिक लीडरबोर्ड",
                contributions: "योगदान",
                credits: "क्रेडिट"
            }
        }
    },
    'kn-IN': {
        features: {
            title: "ಕೃಷಿಯ ಭವಿಷ್ಯಕ್ಕೆ ಸುಸ್ವಾಗತ",
            subtitle: "ರೈತರನ್ನು ನಿಖರತೆ, ಒಳನೋಟ ಮತ್ತು ಸಮುದಾಯದೊಂದಿಗೆ ಸಬಲೀಕರಣಗೊಳಿಸಲು AI ಅನ್ನು ಬಳಸಿಕೊಳ್ಳುವುದು.",
            aiDetection: { title: "AI ರೋಗ ಪತ್ತೆ", description: "ಒಂದೇ ಫೋಟೋದಿಂದ ಬೆಳೆ ರೋಗಗಳನ್ನು ತಕ್ಷಣವೇ ಗುರುತಿಸಿ." },
            fertilizer: { title: "ಮಣ್ಣು-ನಿರ್ದಿಷ್ಟ ಸಲಹೆ", description: "ನಿಮ್ಮ ಮಣ್ಣಿನ ಡೇಟಾಗೆ ಅನುಗುಣವಾಗಿ ರಸಗೊಬ್ಬರ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ." },
            yield: { title: "ಇಳುವರಿ ಭವಿಷ್ಯ", description: "ನಿಮ್ಮ ಸಂಭಾವ್ಯ ಸುಗ್ಗಿಯನ್ನು ಮುನ್ಸೂಚಿಸಿ ಮತ್ತು ಅಪಾಯಗಳನ್ನು ಬೇಗನೆ ತಗ್ಗಿಸಿ." },
            alerts: { title: "ಹೈಪರ್ಲೋಕಲ್ ಕೀಟ ಎಚ್ಚರಿಕೆಗಳು", description: "ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಪ್ರದೇಶದಲ್ಲಿನ ಕೀಟಗಳ ಬಗ್ಗೆ ನೈಜ-ಸಮಯದ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸ್ವೀಕರಿಸಿ." },
            hub: { title: "ಸಮುದಾಯ ಕೇಂದ್ರ", description: "ಡೇಟಾವನ್ನು ಕೊಡುಗೆ ನೀಡಿ ಮತ್ತು ಸಹ ರೈತರ ಜಾಲದಿಂದ ಕಲಿಯಿರಿ." },
            bot: { title: "24/7 ಆಗ್ರೋ ಬಾಟ್", description: "ನಿಮ್ಮ AI ಕೃಷಿ ತಜ್ಞ, ಯಾವುದೇ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಲು ಸಿದ್ಧ." },
            continueButton: "ಪ್ರಾರಂಭಿಸಿ"
        },
        login: {
            welcome: "ಮರಳಿ ಸ್ವಾಗತ!",
            subtitle: "ನಿಖರ ಕೃಷಿಯಲ್ಲಿ ನಿಮ್ಮ ಪಾಲುದಾರ.",
            signInTitle: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
            signInSubtitle: "ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
            emailLabel: "ಇಮೇಲ್",
            passwordLabel: "ಪಾಸ್ವರ್ಡ್",
            signInButton: "ಸೈನ್ ಇನ್ ಮಾಡಿ"
        },
        nav: {
            dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", report: "ಆಗ್ರೋ-ವರದಿ", pest: "ಕೀಟ ನಕ್ಷೆ", weather: "ಹವಾಮಾನ", yield: "ಇಳುವರಿ", economics: "ಅರ್ಥಶಾಸ್ತ್ರ", market: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು", stores: "ಅಂಗಡಿಗಳು", community: "ಸಮುದಾಯ", bot: "ಆಗ್ರೋ ಬಾಟ್", profile: "ಪ್ರೊಫೈಲ್", analysis: "ವಿಶ್ಲೇಷಣೆ", tools: "ಪರಿಕರಗಳು", econ: "ಆರ್ಥಿಕ"
        },
        dashboard: {
            leafAnalysis: {
                title: "1. ಎಲೆ ರೋಗ ವಿಶ್ಲೇಷಣೆ",
                uploadAriaLabel: "ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಎಲೆಯ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
                uploadPrompt: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
                uploadSubprompt: "ಅಥವಾ ಎಳೆದು ತನ್ನಿ",
                imageAlt: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಎಲೆಯ ಪೂರ್ವವೀಕ್ಷಣೆ",
                heatmapAlt: "ಸೋಂಕಿತ ಪ್ರದೇಶಗಳ ಹೀಟ್‌ಮ್ಯಾಪ್",
                showInfected: "ಸೋಂಕಿತ ಪ್ರದೇಶಗಳನ್ನು ತೋರಿಸಿ",
                analyzeButton: "ಎಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
                loadingAnalyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
                loadingVisualizing: "ದೃಶ್ಯೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
                errorSelectImage: "ದಯವಿಟ್ಟು ಮೊದಲು ಒಂದು ಚಿತ್ರ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ."
            },
            soilInput: {
                title: "2. ಮಣ್ಣು ಮತ್ತು ಕ್ಷೇತ್ರದ ಡೇಟಾ",
                cropLabel: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
                nLabel: "ಸಾರಜನಕ (N)", pLabel: "ರಂಜಕ (P)", kLabel: "ಪೊಟ್ಯಾಸಿಯಮ್ (K)", sLabel: "ಗಂಧಕ (S)", znLabel: "ಸತು (Zn)", feLabel: "ಕಬ್ಬಿಣ (Fe)",
                phLabel: "ಮಣ್ಣಿನ pH",
                areaLabel: "ಕ್ಷೇತ್ರದ ವಿಸ್ತೀರ್ಣ",
                areaUnit: "ಹೆಕ್ಟೇರ್",
                getRecommendationButton: "ಪೂರ್ಣ ಆಗ್ರೋ-ವರದಿ ಪಡೆಯಿರಿ",
                getRecommendationTooltip: "ಇದನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮೊದಲು ಎಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ.",
                errorArea: "ದಯವಿಟ್ಟು ವಿಸ್ತೀರ್ಣಕ್ಕಾಗಿ ಮಾನ್ಯವಾದ, ಧನಾತ್ಮಕ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
                errorGeolocation: "ಈ ಬ್ರೌಸರ್ ಜಿಯೋಲೊಕೇಶನ್ ಅನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",
                errorLocationServices: "ಸ್ಥಳವನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಥಳ ಸೇವೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ."
            }
        },
        report: {
            title: "ನಿಮ್ಮ ಆಗ್ರೋ-ವರದಿ",
            exportButton: "ರಫ್ತು ಮಾಡಿ", exportAriaLabel: "ವರದಿಯನ್ನು ಪಿಡಿಎಫ್ ಆಗಿ ರಫ್ತು ಮಾಡಿ",
            newReportButton: "ಹೊಸ ವರದಿ", newReportAriaLabel: "ಹೊಸ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ",
            placeholder: {
                title: "ನಿಮ್ಮ ಆಗ್ರೋ-ವರದಿ ಕಾಯುತ್ತಿದೆ",
                subtitle: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಎಲೆಯ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಮೂಲಕ ಮತ್ತು ನಿಮ್ಮ ಮಣ್ಣಿನ ಡೇಟಾವನ್ನು ನಮೂದಿಸುವ ಮೂಲಕ ಪ್ರಾರಂಭಿಸಿ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ವರದಿ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
                features: {
                    disease: { title: "ರೋಗ ನಿರ್ಣಯ", description: "AI ನಿಖರತೆಯೊಂದಿಗೆ ಸಮಸ್ಯೆಗಳನ್ನು ಗುರುತಿಸಿ." },
                    fertilizer: { title: "ಗೊಬ್ಬರ ಯೋಜನೆ", description: "ನಿಮ್ಮ ಬೆಳೆಗೆ ಕಸ್ಟಮ್ ಪೋಷಕಾಂಶ ಮಿಶ್ರಣ." },
                    yield: { title: "ಇಳುವರಿ ಮುನ್ಸೂಚನೆ", description: "ನಿಮ್ಮ ಸುಗ್ಗಿಯ ಸಾಮರ್ಥ್ಯವನ್ನು ಊಹಿಸಿ." },
                    weather: { title: "ಹವಾಮಾನ ಸಲಹೆ", description: "ಸ್ಥಳೀಯ, ಫಾರ್ಮ್-ನಿರ್ದಿಷ್ಟ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಪಡೆಯಿರಿ." },
                    pest: { title: "ಕೀಟ ಎಚ್ಚರಿಕೆಗಳು", description: "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಸಾಮಾನ್ಯ ಕೀಟಗಳನ್ನು ನೋಡಿ." },
                    econ: { title: "ಆರ್ಥಿಕ ಒಳನೋಟಗಳು", description: "ವೆಚ್ಚ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸುಸ್ಥಿರತೆ." }
                }
            },
            disease: { title: "ಎಲೆ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ", diagnosis: "ರೋಗನಿರ್ಣಯ", confidence: "ವಿಶ್ವಾಸ", severity: "ತೀವ್ರತೆ", chemical: "ರಾಸಾಯನಿಕ ಚಿಕಿತ್ಸೆ", organic: "ಸಾವಯವ ಚಿಕಿತ್ಸೆ" },
            infectedArea: { title: "ಸೋಂಕಿತ ಪ್ರದೇಶ", mild: "ಸೌಮ್ಯ", moderate: "ಮಧ್ಯಮ", severe: "ತೀವ್ರ", unknown: "ಅಪರಿಚಿತ" },
            reasoning: { title: "AI ತಾರ್ಕಿಕತೆ ಮತ್ತು ವಿವರಣೆ", disease: "ರೋಗ ವಿಶ್ಲೇಷಣೆ ವಿವರಣೆ", fertilizer: "ಗೊಬ್ಬರ ಶಿಫಾರಸು ತಾರ್ಕಿಕತೆ" },
            completePrompt: {
                title: "ನಿಮ್ಮ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
                subtitle: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ <strong>ಮಣ್ಣು ಮತ್ತು ಕ್ಷೇತ್ರದ ಡೇಟಾ</strong>ವನ್ನು ಸೇರಿಸಿ.",
                unlocksTitle: "ಇದು ಅನ್ಲಾಕ್ ಮಾಡುತ್ತದೆ:",
                unlocksItems: ["ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಗೊಬ್ಬರ ಯೋಜನೆ", "ಇಳುವರಿ ಭವಿಷ್ಯ", "ಆರ್ಥಿಕ ವಿಶ್ಲೇಷಣೆ"]
            },
            yield: { title: "ಇಳುವರಿ ಭವಿಷ್ಯ", baseline: "ಮೂಲ ಇಳುವರಿ", loss: "ಸಂಭಾವ್ಯ ನಷ್ಟ", net: "ನಿವ್ವಳ ಮುನ್ಸೂಚಿತ ಇಳುವರಿ", reason: "ನಷ್ಟಕ್ಕೆ ಕಾರಣ", advice: "ತಗ್ಗಿಸುವಿಕೆ ಸಲಹೆ" },
            fertilizer: {
                title: "ಗೊಬ್ಬರ ಶಿಫಾರಸು",
                subtitle: "ನಿಮ್ಮ ಮಣ್ಣಿನ ಡೇಟಾ, ಬೆಳೆ ಪ್ರಕಾರ ಮತ್ತು ಎಲೆ ವಿಶ್ಲೇಷಣೆಯ ಆಧಾರದ ಮೇಲೆ.",
                crop: "ಬೆಳೆ", area: "ವಿಸ್ತೀರ್ಣ", ph: "pH",
                rate: "ಅಪ್ಲಿಕೇಶನ್ ದರ", total: (area: number) => `${area} ಹೆಕ್ಟೇರ್‌ಗೆ ಒಟ್ಟು`,
                integration: "ರೋಗ ವಿಶ್ಲೇಷಣೆಯೊಂದಿಗೆ ಏಕೀಕರಣ", weather: "ಹವಾಮಾನ-ಅರಿವಿನ ಹೊಂದಾಣಿಕೆಗಳು", schedule: "ಅಪ್ಲಿಕೇಶನ್ ವೇಳಾಪಟ್ಟಿ"
            },
            loadingAdvisories: "ಸ್ಥಳೀಯ ಸಲಹೆಗಳನ್ನು ತರಲಾಗುತ್ತಿದೆ...",
            errorExtraData: "ಹೆಚ್ಚುವರಿ ಸಲಹಾ ಡೇಟಾವನ್ನು ತರಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ: ",
            errorLocation: "ಸಲಹೆಗಳಿಗಾಗಿ ಸ್ಥಳವನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
            weather: { title: "ಹೈಪರ್ಲೋಕಲ್ ಹವಾಮಾನ ಸಲಹೆ", temperature: "ತಾಪಮಾನ", precipitation: "ಮಳೆ", wind: "ಗಾಳಿ", impact: "ಬೆಳೆಯ ಮೇಲೆ ಪರಿಣಾಮ", recommendations: "ಶಿಫಾರಸುಗಳು", irrigation: "ನೀರಾವರಿ", fertilizerRec: "ಗೊಬ್ಬರ", pesticide: "ಕೀಟನಾಶಕ" },
            pest: { title: "ಸ್ಥಳೀಯ ಕೀಟ ಭವಿಷ್ಯ", subtitle: (crop: string) => `ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ${crop} ಗಾಗಿ ಸಾಮಾನ್ಯ ಕೀಟಗಳು.`, risk: "ಅಪಾಯ", high: "ಹೆಚ್ಚು", moderate: "ಮಧ್ಯಮ", low: "ಕಡಿಮೆ" },
            sources: { title: "ಡೇಟಾ ಮೂಲಗಳು", ariaLabel: "ಡೇಟಾ ಮೂಲಕ್ಕೆ ಭೇಟಿ ನೀಡಿ", linkDefault: "ಹೆಸರಿಸದ ಮೂಲ" }
        },
        economics: {
            title: "ಅರ್ಥಶಾಸ್ತ್ರ ಮತ್ತು ಸುಸ್ಥಿರತೆ",
            subtitle: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಗೊಬ್ಬರ ಶಿಫಾರಸಿನ ಆಧಾರದ ಮೇಲೆ.",
            unlockMessage: "ವೆಚ್ಚದ ಅಂದಾಜುಗಳು ಮತ್ತು ಸುಸ್ಥಿರತೆಯ ಅಂಕಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಲು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
            costEstimation: { title: "ಅಂದಾಜು ಗೊಬ್ಬರ ವೆಚ್ಚ", label: "ಒಟ್ಟು ಅಂದಾಜು ವೆಚ್ಚ" },
            sustainability: { title: "ಸುಸ್ಥಿರತೆ ಅಂಕ", scoreLabel: "ಪರಿಸರ ಸ್ನೇಹಿ ಅಂಕ" },
            purchase: { title: "ಸ್ಮಾರ್ಟ್ ಖರೀದಿ ಸಲಹೆಗಳು" }
        },
        financial: {
            title: "ಹಣಕಾಸು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
            selectCrop: "ವಿಶ್ಲೇಷಿಸಲು ಒಂದು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
            chooseCrop: "-- ಒಂದು ಬೆಳೆಯನ್ನು ಆರಿಸಿ --",
            loading: "ಇತ್ತೀಚಿನ ಮಾರುಕಟ್ಟೆ ಡೇಟಾವನ್ನು ತರಲಾಗುತ್ತಿದೆ...",
            placeholder: {
                title: "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು ಕಾಯುತ್ತಿವೆ",
                subtitle: "ಇತ್ತೀಚಿನ AI-ಚಾಲಿತ ಹಣಕಾಸು ವಿಶ್ಲೇಷಣೆ, ಬೆಲೆ ಪ್ರವೃತ್ತಿಗಳು ಮತ್ತು ಆದಾಯ ಕೊಡುಗೆ ಪೈ ಚಾರ್ಟ್ ಪಡೆಯಲು ಮೇಲಿನ ಡ್ರಾಪ್‌ಡೌನ್‌ನಿಂದ ಒಂದು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ."
            },
            currentPrice: (source: string) => `ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ (${source})`,
            perUnit: (unit: string) => `/${unit}`,
            trend: "ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ",
            rising: "ಏರುತ್ತಿದೆ",
            stable: "ಸ್ಥಿರ",
            falling: "ಇಳಿಯುತ್ತಿದೆ",
            insights: "AI ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು",
            chart3Month: "3-ತಿಂಗಳ ಬೆಲೆ ಪ್ರವೃತ್ತಿ (₹)",
            chartRevenue: "ಯೋಜಿತ ಆದಾಯ ಕೊಡುಗೆ"
        },
        stores: {
            title: "ಹತ್ತಿರದ ಅಂಗಡಿಗಳು ಮತ್ತು ವಿಮರ್ಶೆಗಳು",
            placeholder: {
                title: "ಹತ್ತಿರದ ಗೊಬ್ಬರ ಅಂಗಡಿಗಳನ್ನು ಹುಡುಕಿ",
                subtitle: "ಗೊಬ್ಬರ ಶಿಫಾರಸು ಪಡೆಯಲು \"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್\" ನಲ್ಲಿ ಸಂಪೂರ್ಣ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಈ ಉಪಕರಣವು ನಂತರ ಸ್ಥಳೀಯ ಅಂಗಡಿಗಳನ್ನು ಹುಡುಕುತ್ತದೆ, ಅವುಗಳು ಏನು ಸ್ಟಾಕ್ ಮಾಡುತ್ತವೆ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತದೆ ಮತ್ತು ರೈತರ ವಿಮರ್ಶೆಗಳನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ."
            },
            loading: "ಹತ್ತಿರದ ಅಂಗಡಿಗಳು ಮತ್ತು ವಿಮರ್ಶೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
            errorLocation: "ಸ್ಥಳವನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸ್ಥಳ ಸೇವೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.",
            errorGeolocation: "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಜಿಯೋಲೊಕೇಶನ್ ಅನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",
            subtitle: "ನಿಮ್ಮ ಆಗ್ರೋ-ವರದಿಯ ಆಧಾರದ ಮೇಲೆ ನಿಮಗೆ ಬೇಕಾದ ಗೊಬ್ಬರಗಳನ್ನು ಹೊಂದಿರುವ ಹತ್ತಿರದ ಅಂಗಡಿಗಳು ಇಲ್ಲಿವೆ. ರೇಟಿಂಗ್‌ಗಳು ಸಮುದಾಯದ ವಿಮರ್ಶೆಗಳನ್ನು ಆಧರಿಸಿವೆ.",
            noStores: {
                title: "ಯಾವುದೇ ಅಂಗಡಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
                subtitle: "ನಿಮ್ಮ ಶಿಫಾರಸಿನಿಂದ ನಿರ್ದಿಷ್ಟ ಗೊಬ್ಬರಗಳನ್ನು ಸಂಗ್ರಹಿಸುವ 10 ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ನಮಗೆ ಯಾವುದೇ ಅಂಗಡಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ."
            },
            distanceAway: (dist: string) => `${dist} ಕಿಮೀ ದೂರ`,
            availableProducts: "ನಿಮಗೆ ಬೇಕಾದ ಲಭ್ಯವಿರುವ ಉತ್ಪನ್ನಗಳು:",
            call: "ಅಂಗಡಿಗೆ ಕರೆ ಮಾಡಿ",
            directions: "ಮಾರ್ಗಗಳು"
        },
        profile: {
            title: "ಪ್ರಗತಿಪರ ರೈತ",
            comingSoon: { title: "ಪೂರ್ಣ ಪ್ರೊಫೈಲ್ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ!", subtitle: "ನಿಮ್ಮ ಇತಿಹಾಸ ಮತ್ತು ಸಾಧನೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ." }
        },
        bot: {
            title: "ಆಗ್ರೋ ಬಾಟ್ ಸಹಾಯಕ",
            welcome: "ನಮಸ್ಕಾರ! ನಾನು ಆಗ್ರೋ ಬಾಟ್. ಇಂದು ನಿಮ್ಮ ಜಮೀನಿಗೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ಬೆಳೆ ರೋಗಗಳು, ಮಣ್ಣಿನ ಆರೋಗ್ಯ, ಅಥವಾ ಬೇರೆ ಯಾವುದರ ಬಗ್ಗೆಯಾದರೂ ಕೇಳಿ!",
            placeholder: "ಆಗ್ರೋ ಬಾಟ್‌ಗೆ ಒಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ...",
            listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ...",
            sendAriaLabel: "ಸಂದೇಶ ಕಳುಹಿಸಿ",
            startListening: "ಧ್ವನಿ ಆಜ್ಞೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ",
            stopListening: "ಧ್ವನಿ ಆಜ್ಞೆಯನ್ನು ನಿಲ್ಲಿಸಿ",
            mute: "ಧ್ವನಿ ಮ್ಯೂಟ್ ಮಾಡಿ",
            unmute: "ಧ್ವನಿ ಅನ್‌ಮ್ಯೂಟ್ ಮಾಡಿ",
            errors: {
                retry: (delay: number, attempt: number, max: number) => `ಸಂಪರ್ಕವು ಕಾರ್ಯನಿರತವಾಗಿದೆ. ${delay} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಮರುಪ್ರಯತ್ನಿಸಲಾಗುತ್ತಿದೆ... (ಪ್ರಯತ್ನ ${attempt}/${max})`,
                unexpected: "ಒಂದು ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
                noSpeech: "ಯಾವುದೇ ಮಾತು ಪತ್ತೆಯಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
                network: "ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
                micBlocked: "ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶವನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಅದನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ."
            },
            system_prompt: {
                intro: "ನೀವು ಆಗ್ರೋ ಬಾಟ್, ಭಾರತೀಯ ಕೃಷಿಯಲ್ಲಿ ಪರಿಣತಿ ಹೊಂದಿರುವ ರೈತರಿಗೆ ಸ್ನೇಹಪರ ಮತ್ತು ಜ್ಞಾನವುಳ್ಳ AI ಸಹಾಯಕ.",
                goal: "ನಿಮ್ಮ ಗುರಿ ಕೃಷಿ, ಬೆಳೆ ರೋಗಗಳು, ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ಸುಸ್ಥಿರ ಪದ್ಧತಿಗಳ ಬಗ್ಗೆ ಸಂಕ್ಷಿಪ್ತ, ಪ್ರಾಯೋಗಿಕ ಮತ್ತು ಸಹಾಯಕವಾದ ಸಲಹೆ ನೀಡುವುದು. ಸರಳ ಭಾಷೆಯನ್ನು ಬಳಸಿ.",
                language_instruction: (lang: string) => `**ನಿರ್ಣಾಯಕ ಸೂಚನೆ:** ಬಳಕೆದಾರರು ಸಂವಹನ ಭಾಷೆಯಾಗಿ **${lang}** ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದಾರೆ. ನೀವು ಕೇವಲ **${lang}** ನಲ್ಲಿ ಮಾತ್ರ ಉತ್ತರಿಸುವುದು ಕಠಿಣ ಮತ್ತು ಸಂಪೂರ್ಣ ಅವಶ್ಯಕತೆಯಾಗಿದೆ. ಬೇರೆ ಯಾವುದೇ ಭಾಷೆಯನ್ನು ಬಳಸಬೇಡಿ.`,
                user_activity_header: "ಪ್ರಸ್ತುತ ಬಳಕೆದಾರರ ಸಂದರ್ಭ:",
                activity_dashboard: "ಬಳಕೆದಾರರು ಪ್ರಸ್ತುತ 'ವಿಶ್ಲೇಷಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'ನಲ್ಲಿದ್ದಾರೆ, ಎಲೆ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಮತ್ತು ಮಣ್ಣಿನ ಡೇಟಾವನ್ನು ನಮೂದಿಸಲು ತಯಾರಿ ನಡೆಸುತ್ತಿದ್ದಾರೆ.",
                activity_report: "ಬಳಕೆದಾರರು ಪ್ರಸ್ತುತ ತಮ್ಮ ರಚಿತ 'ಆಗ್ರೋ-ವರದಿ'ಯನ್ನು ವೀಕ್ಷಿಸುತ್ತಿದ್ದಾರೆ. ಅವರಿಗೆ ಫಲಿತಾಂಶಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿರಬಹುದು.",
                activity_pest: "ಬಳಕೆದಾರರು ಪ್ರಸ್ತುತ 'ಕೀಟ ಭವಿಷ್ಯ ನಕ್ಷೆ'ಯನ್ನು ನೋಡುತ್ತಿದ್ದಾರೆ. ಅವರು ತಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿನ ಕೀಟ ನಿಯಂತ್ರಣ ಅಥವಾ ಅಪಾಯಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು.",
                activity_weather: "ಬಳಕೆದಾರರು 'ಹವಾಮಾನ ಸಲಹೆ' ಪುಟದಲ್ಲಿದ್ದಾರೆ. ಮುನ್ಸೂಚನೆಯು ತಮ್ಮ ಜಮೀನಿನ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ ಎಂಬುದರ ಕುರಿತು ಅವರಿಗೆ ಪ್ರಶ್ನೆಗಳಿರಬಹುದು.",
                activity_yield: "ಬಳಕೆದಾರರು ತಮ್ಮ ಇತ್ತೀಚಿನ ವಿಶ್ಲೇಷಣೆಯ ಆಧಾರದ ಮೇಲೆ 'ಇಳುವರಿ ಮುನ್ಸೂಚಕ'ವನ್ನು ವೀಕ್ಷಿಸುತ್ತಿದ್ದಾರೆ. ಅವರು ತಮ್ಮ ಇಳುವರಿಯನ್ನು ಸುಧಾರಿಸುವ ಬಗ್ಗೆ ಕೇಳಬಹುದು.",
                activity_community: "ಬಳಕೆದಾರರು 'ಸಮುದಾಯ ಕೇಂದ್ರ'ದಲ್ಲಿದ್ದಾರೆ, ಬಹುಶಃ ಡೇಟಾವನ್ನು ಕೊಡುಗೆ ನೀಡುತ್ತಿದ್ದಾರೆ ಅಥವಾ ಲೀಡರ್‌ಬೋರ್ಡ್ ವೀಕ್ಷಿಸುತ್ತಿದ್ದಾರೆ.",
                activity_bot: "ಬಳಕೆದಾರರು ಪ್ರಸ್ತುತ 'ಆಗ್ರೋ ಬಾಟ್' ಚಾಟ್‌ನಲ್ಲಿ ನಿಮ್ಮೊಂದಿಗೆ ಸಂವಹನ ನಡೆಸುತ್ತಿದ್ದಾರೆ.",
                activity_unknown: "ಬಳಕೆದಾರರ ಪ್ರಸ್ತುತ ಸಂದರ್ಭ ತಿಳಿದಿಲ್ಲ.",
                report_context_none: "ಬಳಕೆದಾರರು ಇನ್ನೂ ಆಗ್ರೋ-ವರದಿಯನ್ನು ರಚಿಸಿಲ್ಲ. ಅವರ ಸಾಮಾನ್ಯ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ. ಅವರ ನಿರ್ದಿಷ್ಟ ಪರಿಸ್ಥಿತಿಗಳ ಆಧಾರದ ಮೇಲೆ ಹೆಚ್ಚು ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಸಲಹೆಗಾಗಿ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಲು ನೀವು ಅವರನ್ನು ನಿಧಾನವಾಗಿ ಪ್ರೋತ್ಸಾಹಿಸಬಹುದು.",
                report_context_header: "ಬಳಕೆದಾರರ ಇತ್ತೀಚಿನ ಆಗ್ರೋ-ವರದಿಗೆ ನಿಮಗೆ ಪ್ರವೇಶವಿದೆ. ಅವರ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಲು ಈ ಮಾಹಿತಿಯನ್ನು ಬಳಸಿ. ಇಲ್ಲಿ ಡೇಟಾ ಇದೆ:",
                report_data_leaf: (diag, sev) => `- ಎಲೆ ಆರೋಗ್ಯ ಸಾರಾಂಶ: ರೋಗನಿರ್ಣಯ: ${diag}, ತೀವ್ರತೆ: ${sev}.`,
                report_data_soil: (crop, ph, n, p, k, s, zn, fe) => `- ಮಣ್ಣಿನ ವಿವರ: ಬೆಳೆ: ${crop}, ಪಿಎಚ್: ${ph}, ಎನ್: ${n}ppm, ಪಿ: ${p}ppm, ಕೆ: ${k}ppm, ಎಸ್: ${s}ppm, ಝಡ್ಎನ್: ${zn}ppm, ಎಫ್ಇ: ${fe}ppm.`,
                report_data_fertilizer: (reason, n, p, k) => `- ಗೊಬ್ಬರ ಶಿಫಾರಸು: ${reason}. ಶಿಫಾರಸು ಮಾಡಲಾದ ದರಗಳು (ಕೆಜಿ/ಹೆಕ್ಟೇರ್) - ಎನ್: ${n}, ಪಿ: ${p}, ಕೆ: ${k}.`,
                report_data_treatments: (chem, org) => `- ಚಿಕಿತ್ಸೆಗಳು: ರಾಸಾಯನಿಕ: ${chem}, ಸಾವಯವ: ${org}.`,
                report_data_yield: (yieldNum, unit, loss, reason) => `- ಇಳುವರಿ ಮುನ್ಸೂಚನೆ: ಮುನ್ಸೂಚಿತ ನಿವ್ವಳ ಇಳುವರಿ ${yieldNum} ${unit} ಆಗಿದೆ. ಇದು ${reason} ಕಾರಣದಿಂದಾಗಿ ${loss}% ಸಂಭಾವ್ಯ ನಷ್ಟವನ್ನು ಆಧರಿಸಿದೆ.`
            }
        },
        pest: {
            title: "ಕೀಟ ಭವಿಷ್ಯ ನಕ್ಷೆ",
            placeholder: {
                title: "ಹೈಪರ್ಲೋಕಲ್ ಕೀಟ ಭವಿಷ್ಯ",
                subtitle: "ನಿಮ್ಮ ಬೆಳೆ ಮತ್ತು ಸ್ಥಳಕ್ಕಾಗಿ ಸಂಭಾವ್ಯ ಕೀಟ ಬೆದರಿಕೆಗಳ ನಕ್ಷೆಯನ್ನು ನೋಡಲು <strong>ಡ್ಯಾಶ್‌ಬೋರ್ಡ್</strong>ನಲ್ಲಿ ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ."
            },
            loading: (crop: string) => `${crop} ಗಾಗಿ ಕೀಟ ಬೆದರಿಕೆಗಳನ್ನು ಊಹಿಸಲಾಗುತ್ತಿದೆ...`,
            errorLocation: "ಸ್ಥಳವನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಥಳ ಸೇವೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.",
            errorGeolocation: "ಜಿಯೋಲೊಕೇಶನ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.",
            success: {
                subtitle: (crop: string) => `ನಿಮ್ಮ ಸ್ಥಳ ಮತ್ತು ಬೆಳೆ (${crop}) ಆಧಾರದ ಮೇಲೆ, ಇಲ್ಲಿ ಅತ್ಯಂತ ಸಂಭವನೀಯ ಕೀಟ ಬೆದರಿಕೆಗಳಿವೆ. ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಯಾವುದೇ ಕೀಟದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.`,
                listTitle: "ಊಹಿಸಲಾದ ಕೀಟಗಳು"
            },
            yourLocation: "ನಿಮ್ಮ ಸ್ಥಳ",
            getInfoFor: "ಗಾಗಿ ಮಾಹಿತಿ ಪಡೆಯಿರಿ",
            risk: "ಅಪಾಯ", high: "ಹೆಚ್ಚು", moderate: "ಮಧ್ಯಮ", low: "ಕಡಿಮೆ",
            modal: {
                title: "ಕೀಟ ಮಾಹಿತಿ",
                loading: "ವಿವರವಾದ ಕೀಟ ಮಾಹಿತಿಯನ್ನು ತರಲಾಗುತ್ತಿದೆ...",
                close: "ಮುಚ್ಚಿ",
                damage: "ಸಂಭಾವ್ಯ ಹಾನಿ",
                prevention: "ತಡೆಗಟ್ಟುವಿಕೆ ವಿಧಾನಗಳು",
                organic: "ಸಾವಯವ ನಿಯಂತ್ರಣ",
                chemical: "ರಾಸಾಯನಿಕ ನಿಯಂತ್ರಣ"
            },
            sources: { title: "ಡೇಟಾ ಮೂಲಗಳು", ariaLabel: "ಡೇಟಾ ಮೂಲಕ್ಕೆ ಭೇಟಿ ನೀಡಿ", linkDefault: "ಹೆಸರಿಸದ ಮೂಲ" }
        },
        weather: {
            title: "ಹೈಪರ್ಲೋಕಲ್ ಹವಾಮಾನ ಸಲಹೆ",
            prompt: {
                title: "ಫಾರ್ಮ್-ನಿರ್ದಿಷ್ಟ ಮುನ್ಸೂಚನೆ ಪಡೆಯಿರಿ",
                subtitle: "ನೀರಾವರಿ, ಗೊಬ್ಬರ ಮತ್ತು ಕೀಟನಾಶಕ ಅಪ್ಲಿಕೇಶನ್ ಯೋಜಿಸಲು ಸಹಾಯ ಮಾಡಲು ನಿಮ್ಮ ಸ್ಥಳ ಮತ್ತು ಬೆಳೆ ಪ್ರಕಾರಕ್ಕೆ ಅನುಗುಣವಾಗಿ 3-ದಿನಗಳ ಹವಾಮಾನ ಸಲಹೆಯನ್ನು ಪಡೆಯಿರಿ.",
                button: "ನನ್ನ ಸಲಹೆ ಪಡೆಯಿರಿ"
            },
            loading: "ನಿಮ್ಮ ಸ್ಥಳೀಯ ಹವಾಮಾನ ಸಲಹೆಯನ್ನು ತರಲಾಗುತ್ತಿದೆ...",
            error: {
                title: "ಹವಾಮಾನವನ್ನು ತರಲು ವಿಫಲವಾಗಿದೆ",
                button: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ"
            },
            errorLocation: "ಸ್ಥಳವನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಥಳ ಸೇವೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.",
            errorGeolocation: "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಜಿಯೋಲೊಕೇಶನ್ ಅನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",
            success: {
                personalized: (crop: string) => `ನಿಮ್ಮ ${crop} ಬೆಳೆಗೆ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಸಲಹೆ.`,
                summaryTitle: "ಹವಾಮಾನ ಸಾರಾಂಶ",
                temperature: "ತಾಪಮಾನ",
                precipitation: "ಮಳೆ",
                wind: "ಗಾಳಿ",
                impactTitle: "ನಿಮ್ಮ ಬೆಳೆಯ ಮೇಲೆ ಪರಿಣಾಮ",
                recommendationsTitle: "AI-ಚಾಲಿತ ಶಿಫಾರಸುಗಳು",
                irrigation: "ನೀರಾವರಿ",
                fertilizer: "ಗೊಬ್ಬರ",
                pesticide: "ಕೀಟನಾಶಕ",
                refreshButton: "ಸಲಹೆಯನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ"
            },
            sources: { title: "ಡೇಟಾ ಮೂಲಗಳು", ariaLabel: "ಡೇಟಾ ಮೂಲಕ್ಕೆ ಭೇಟಿ ನೀಡಿ", linkDefault: "ಹೆಸರಿಸದ ಮೂಲ" }
        },
        yield: {
            title: "ಇಳುವರಿ ಮುನ್ಸೂಚಕ",
            placeholder: {
                title: "ನಿಮ್ಮ ಇಳುವರಿ ಭವಿಷ್ಯವನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಿ",
                subtitle: "ಮೊದಲು, ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಇಳುವರಿ ಮುನ್ಸೂಚನೆಯನ್ನು ರಚಿಸಲು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ <strong>ಎಲೆ ವಿಶ್ಲೇಷಣೆ</strong> ಮತ್ತು <strong>ಮಣ್ಣಿನ ಡೇಟಾ</strong> ವಿಭಾಗಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ."
            },
            ready: {
                title: "ಇಳುವರಿ ಭವಿಷ್ಯ ಸಿದ್ಧವಾಗಿದೆ",
                subtitle: "ನಿಮ್ಮ ಇಳುವರಿ ಭವಿಷ್ಯವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ ಮತ್ತು ಇದು ಮುಖ್ಯ ಆಗ್ರೋ-ವರದಿಯಲ್ಲಿ ಲಭ್ಯವಿದೆ."
            },
            baseline: "ಮೂಲ ಇಳುವರಿ",
            loss: "ಸಂಭಾವ್ಯ ನಷ್ಟ",
            net: "ನಿವ್ವಳ ಮುನ್ಸೂಚಿತ ಇಳುವರಿ",
            reason: "ನಷ್ಟಕ್ಕೆ ಕಾರಣ",
            advice: "ತಗ್ಗಿಸುವಿಕೆ ಸಲಹೆ",
            sources: { title: "ಡೇಟಾ ಮೂಲಗಳು", ariaLabel: "ಡೇಟಾ ಮೂಲಕ್ಕೆ ಭೇಟಿ ನೀಡಿ", linkDefault: "ಹೆಸರಿಸದ ಮೂಲ" }
        },
        community: {
            title: "ಸಮುದಾಯ AI ಗೆ ಕೊಡುಗೆ ನೀಡಿ",
            subtitle: "ನಿಮ್ಮ ಸ್ವಂತ ಸಸ್ಯ ಎಲೆ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಮತ್ತು ಲೇಬಲ್ ಮಾಡುವ ಮೂಲಕ ಆಗ್ರೋವಿಷನ್ AI ಅನ್ನು ಸುಧಾರಿಸಲು ಸಹಾಯ ಮಾಡಿ. ಪ್ರತಿಯೊಂದು ಕೊಡುಗೆಯು AI ಅನ್ನು ಎಲ್ಲರಿಗೂ ಚುರುಕುಗೊಳಿಸುತ್ತದೆ.",
            upload: {
                prompt: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
                subprompt: "ಅಥವಾ ಎಳೆದು ತನ್ನಿ",
                ariaLabel: "ಕೊಡುಗೆ ನೀಡಲು ಎಲೆಯ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ"
            },
            label: "1. ಒಂದು ರೋಗನಿರ್ಣಯ ಲೇಬಲ್ ಸೇರಿಸಿ",
            labelPlaceholder: "ಒಂದು ರೋಗನಿರ್ಣಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ...",
            labelHelp: "ನಿಮ್ಮ ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರಕ್ಕೆ ಉತ್ತಮವಾಗಿ ಹೊಂದಿಕೆಯಾಗುವ ರೋಗನಿರ್ಣಯವನ್ನು ಆರಿಸಿ.",
            contributeButton: "ಕೊಡುಗೆ ನೀಡಿ (+20 ಆಗ್ರೋ ಕ್ರೆಡಿಟ್)",
            error: "ದಯವಿಟ್ಟು ಒಂದು ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಒಂದು ರೋಗನಿರ್ಣಯ ಲೇಬಲ್ ಆಯ್ಕೆಮಾಡಿ.",
            success: {
                title: "ಕೊಡುಗೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ!",
                contributeAnother: "ಮತ್ತೊಂದು ಚಿತ್ರವನ್ನು ಕೊಡುಗೆ ನೀಡಿ"
            },
            leaderboard: {
                title: "ಸಮುದಾಯ ಲೀಡರ್‌ಬೋರ್ಡ್",
                contributions: "ಕೊಡುಗೆಗಳು",
                credits: "ಕ್ರೆಡಿಟ್‌ಗಳು"
            }
        }
    }
};