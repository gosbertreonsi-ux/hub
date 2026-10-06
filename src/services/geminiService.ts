import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  if (apiKey) {
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
  }
  return null;
}

export async function generateSocialCaption(prompt: string, tone: 'inspirational' | 'aesthetic' | 'playful' | 'business' = 'aesthetic'): Promise<{ caption: string; hashtags: string[] }> {
  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert social media copywriter for MIZIZI SOCIAL, a vibrant visual photo/video platform celebrating authentic stories, culture, design, and creativity.
Generate a captivating post caption with a ${tone} tone based on this description: "${prompt}".
Include 4-5 relevant, high-traffic hashtags (without punctuation other than the # symbol).
Format response strictly as JSON:
{
  "caption": "Your generated caption here",
  "hashtags": ["MiziziVibes", "Creativity", "Explore", "VisualStory"]
}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          caption: parsed.caption || prompt,
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['MiziziSocial', 'CreatorLife'],
        };
      }
    }
  } catch (err) {
    console.warn('Gemini API call skipped or errored, falling back to smart copy:', err);
  }

  // High quality creative fallback templates based on prompt keywords
  const lower = prompt.toLowerCase();
  if (lower.includes('fashion') || lower.includes('outfit') || lower.includes('style')) {
    return {
      caption: `Where rich cultural heritage meets modern street architecture. Crafted for those who move boldly into tomorrow. ✨🧵`,
      hashtags: ['MiziziFashion', 'AfricanStyle', 'ContemporaryTailoring', 'SlowFashion', 'OOTD'],
    };
  } else if (lower.includes('sunset') || lower.includes('travel') || lower.includes('ocean') || lower.includes('beach')) {
    return {
      caption: `Chasing the last golden beams over the shoreline. Moments like these remind us to pause, breathe, and cherish the journey. 🌊🌅`,
      hashtags: ['TravelAfrica', 'IslandMagic', 'GoldenHour', 'Wanderlust', 'CoastalVibes'],
    };
  } else if (lower.includes('tech') || lower.includes('code') || lower.includes('build') || lower.includes('startup')) {
    return {
      caption: `Building the future from the ground up. Small iterations, relentless curiosity, and grand visions coming alive. 💻🚀`,
      hashtags: ['SiliconSavannah', 'BuildInPublic', 'TechAfrica', 'FounderLife', 'Innovation'],
    };
  } else if (lower.includes('wildlife') || lower.includes('nature') || lower.includes('safari')) {
    return {
      caption: `Unfiltered majesty in its truest element. Preserving the delicate heartbeat of our wild sanctuaries for generations ahead. 🌿🦁`,
      hashtags: ['WildlifeConservation', 'SavannahLife', 'SafariMoments', 'EarthFocus'],
    };
  }

  return {
    caption: `Capturing the unseen nuances of life through a distinct lens. Rooted in passion, expanding without boundaries. ✨📸`,
    hashtags: ['MiziziSocial', 'VisualStorytelling', 'CreateAndInspire', 'DailyVibes'],
  };
}

export async function generateCreatorAdvice(niche: string, currentFollowers: number): Promise<{ title: string; actionableSteps: string[]; recommendedAudio: string }> {
  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a top creator strategist on MIZIZI SOCIAL. The creator is in the "${niche}" niche with ${currentFollowers} followers. Give 3 crisp actionable growth tactics and 1 trending audio recommendation. Return strictly JSON:
{
  "title": "Strategy Focus",
  "actionableSteps": ["Step 1", "Step 2", "Step 3"],
  "recommendedAudio": "Audio Title"
}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    }
  } catch (err) {
    console.warn('Gemini advice fallback:', err);
  }

  return {
    title: `Scaling Your ${niche || 'Creative'} Influence on MIZIZI`,
    actionableSteps: [
      'Post short behind-the-scenes Reels showcasing your authentic process twice a week.',
      'Engage with at least 5 fellow creators in your niche within 30 minutes of uploading.',
      'Use location tags and 3-5 niche-specific hashtags rather than generic ones.',
    ],
    recommendedAudio: 'Afro-Fusion Acoustic Rhythms (Trending in East Africa)',
  };
}
