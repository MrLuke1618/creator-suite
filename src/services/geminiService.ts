
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { BrainstormIdea, OptimizedContent, IdeaLabResult, Language, ScriptAnalysisFeedback, AudienceAnalysisResult, ViralClipsResult, ImageMetadata, Chapter, CommentAnalysis, BrandSafetyAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A real app would have better error handling or a check at startup.
  // For this context, we will proceed, but calls will fail if the key isn't set in the environment.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const brandLockInstruction = `
---
CRITICAL INSTRUCTION: BRAND LOCK ACTIVE
You are an AI assistant for "Avada Commerce". All of your outputs MUST strictly adhere to the following brand guidelines. Failure to do so is a critical error.
- **Brand Identity:** Avada Commerce, a leading provider of Shopify apps.
- **Brand Voice:** Professional, helpful, expert, clear, and tech-savvy. Avoid overly casual language, slang, or hype. Focus on providing value and actionable insights.
- **Target Audience:** Shopify merchants, e-commerce entrepreneurs, and marketing managers. All content should be tailored to their needs and pain points.
- **Core Offerings:** Your responses must be relevant to Avada's 13 Shopify apps (e.g., SEO, Sales Boost, Loyalty Programs, etc.). Do not suggest concepts or features outside of this ecosystem.
- **Brand Safety:** All content must be 100% brand-safe. Avoid controversial topics, politics, offensive language, and any subject matter inappropriate for a professional business context.
---
Apply these guidelines to the following request:
`;

const addPresetContextToPrompt = (prompt: string, presetContext?: string, isBrandLocked?: boolean): string => {
  if (isBrandLocked) {
    return `${brandLockInstruction}\nORIGINAL REQUEST:\n${prompt}`;
  }
  if (presetContext && presetContext.trim() !== '') {
    return `You are a content creator for a specific brand. Please keep the following brand context in mind for all your outputs.
---
BRAND CONTEXT:
${presetContext}
---
Now, fulfill the original request based on that context.

ORIGINAL REQUEST:
${prompt}`;
  }
  return prompt;
};

export const analyzeScript = async (script: string, language: Language, seoOptimize: boolean, presetContext?: string, isBrandLocked?: boolean): Promise<ScriptAnalysisFeedback> => {
  const basePrompts = {
    [Language.EN]: `Analyze the following video script. Provide overall feedback on pacing and clarity. Suggest specific sentence rephrasings for clarity or conciseness, including the original sentence, your suggestion, and the reason. Finally, suggest 2-3 relevant calls-to-action (CTAs) for the end of the video.`,
    [Language.VI]: `Phân tích kịch bản video sau đây. Cung cấp phản hồi tổng thể về nhịp độ và sự rõ ràng. Đề xuất diễn đạt lại các câu cụ thể để rõ ràng hoặc súc tích hơn, bao gồm câu gốc, đề xuất của bạn và lý do. Cuối cùng, đề xuất 2-3 lời kêu gọi hành động (CTA) phù hợp cho cuối video.`
  };

  const seoPrompts = {
      [Language.EN]: `Additionally, act as a professional YouTube scriptwriter and SEO expert. Your primary goal is to maximize audience retention and viral potential. Rewrite the entire script to be more engaging. Improve the hook, clarify the main points, strengthen the call to action, and naturally weave in relevant keywords based on the content. Provide this full, rewritten script in the 'rewrittenScript' field.`,
      [Language.VI]: `Ngoài ra, hãy đóng vai một người viết kịch bản YouTube chuyên nghiệp và chuyên gia SEO. Mục tiêu chính của bạn là tối đa hóa tỷ lệ giữ chân khán giả và tiềm năng lan truyền. Viết lại toàn bộ kịch bản để hấp dẫn hơn. Cải thiện câu mở đầu, làm rõ các điểm chính, tăng cường lời kêu gọi hành động và lồng ghép các từ khóa liên quan một cách tự nhiên dựa trên nội dung. Cung cấp kịch bản đầy đủ, đã được viết lại này trong trường 'rewrittenScript'.`
  };

  const prompt = `${basePrompts[language]} ${seoOptimize ? seoPrompts[language] : "Do not provide a rewritten script; leave the 'rewrittenScript' field empty."} Here is the script: "${script}"`;
  const finalPrompt = addPresetContextToPrompt(prompt, presetContext, isBrandLocked);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallFeedback: {
              type: Type.STRING,
              description: "Overall feedback on the script's pacing and clarity.",
            },
            rephrasingSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  reason: { type: Type.STRING },
                }
              },
              description: "Specific suggestions for rephrasing sentences."
            },
            ctaSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 2-3 relevant call-to-action suggestions."
            },
            rewrittenScript: {
                type: Type.STRING,
                description: "The full script, rewritten for SEO and engagement if requested. Otherwise, an empty string."
            }
          }
        }
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing script:", error);
    const errorMessages = {
      [Language.EN]: { overallFeedback: "Failed to get feedback from AI. Please check your API key and network connection.", rephrasingSuggestions: [], ctaSuggestions: [], rewrittenScript: "" },
      [Language.VI]: { overallFeedback: "Không thể nhận phản hồi từ AI. Vui lòng kiểm tra API key và kết nối mạng.", rephrasingSuggestions: [], ctaSuggestions: [], rewrittenScript: "" }
    }
    return errorMessages[language];
  }
};

export const getTranscriptionFeedback = async (transcript: string, language: Language): Promise<string> => {
  const prompts = {
    [Language.EN]: `The following text was transcribed from speech. Please review it for common speech-to-text errors, such as misheard words, incorrect punctuation, or grammatical mistakes. Provide a corrected version or list specific suggestions for improvement. Keep the feedback concise and focused on accuracy. Transcribed text:`,
    [Language.VI]: `Văn bản sau được phiên âm từ giọng nói. Vui lòng xem xét các lỗi chuyển giọng nói thành văn bản phổ biến, chẳng hạn như từ nghe nhầm, dấu câu không chính xác hoặc lỗi ngữ pháp. Cung cấp một phiên bản đã sửa hoặc liệt kê các đề xuất cải thiện cụ thể. Giữ phản hồi ngắn gọn và tập trung vào độ chính xác. Văn bản đã phiên âm:`
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${prompts[language]} "${transcript}"`,
      config: {
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error getting transcription feedback:", error);
    const errorMessages = {
      [Language.EN]: "Failed to get transcription feedback from AI. Please check your API key and network connection.",
      [Language.VI]: "Không thể nhận phản hồi phiên âm từ AI. Vui lòng kiểm tra API key và kết nối mạng."
    }
    return errorMessages[language];
  }
};

export const getThumbnailFeedback = async (thumbA: string, thumbB: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<string> => {
    const prompts = {
    [Language.EN]: "As a YouTube thumbnail expert, compare these two thumbnails. Which is more likely to get a higher click-through rate? Analyze contrast, text readability, emotional appeal, and overall composition. Provide specific, actionable feedback for each.",
    [Language.VI]: "Với tư cách là chuyên gia về ảnh bìa YouTube, hãy so sánh hai ảnh bìa này. Cái nào có khả năng nhận được tỷ lệ nhấp chuột cao hơn? Phân tích độ tương phản, khả năng đọc văn bản, sức hấp dẫn về cảm xúc và bố cục tổng thể. Cung cấp phản hồi cụ thể, có tính hành động cho mỗi ảnh."
  };
  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const imagePartA = { inlineData: { mimeType: 'image/jpeg', data: thumbA } };
    const imagePartB = { inlineData: { mimeType: 'image/jpeg', data: thumbB } };
    const textPart = { text: finalPrompt };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePartA, imagePartB, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error getting thumbnail feedback:", error);
    const errorMessages = {
      [Language.EN]: "Failed to get feedback from AI. Please check your API key and network connection.",
      [Language.VI]: "Không thể nhận phản hồi từ AI. Vui lòng kiểm tra API key và kết nối mạng."
    }
    return errorMessages[language];
  }
};

export const generateThumbnails = async (prompt: string, language: Language, script?: string, presetContext?: string, isBrandLocked?: boolean): Promise<string[]> => {
    const scriptContextEn = script && script.trim() ? ` The video is about the following topic: "${script.substring(0, 400)}..."` : '';
    const scriptContextVi = script && script.trim() ? ` Video này nói về chủ đề sau: "${script.substring(0, 400)}..."` : '';

    const prompts = {
      [Language.EN]: `A compelling YouTube thumbnail for a video titled "${prompt}". Visually engaging, high contrast, clear subject, and minimal text.${scriptContextEn}`,
      [Language.VI]: `Một ảnh bìa YouTube hấp dẫn cho video có tiêu đề "${prompt}". Hình ảnh cuốn hút, độ tương phản cao, chủ thể rõ ràng và văn bản tối giản.${scriptContextVi}`
    }
    
    const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config: {
                numberOfImages: 2,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        return response.generatedImages.map(img => img.image.imageBytes);
    } catch (error) {
        console.error("Error generating thumbnails:", error);
        return [];
    }
};

export const generateSingleThumbnailFromScript = async (script: string, aspectRatio: '16:9' | '9:16', language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<string | null> => {
    const promptEn = `Based on the following video script, create a single, visually stunning, and highly clickable YouTube thumbnail. The thumbnail should be in a ${aspectRatio} aspect ratio. It must be eye-catching, with high contrast, a clear focal point, and minimal, readable text that captures the essence of the video. Avoid generic imagery. The goal is maximum click-through rate. Script: "${script.substring(0, 1000)}..."`;
    const promptVi = `Dựa trên kịch bản video sau, hãy tạo một ảnh bìa YouTube duy nhất, đẹp mắt và có tỷ lệ nhấp chuột cao. Ảnh bìa phải có tỷ lệ khung hình ${aspectRatio}. Nó phải bắt mắt, có độ tương phản cao, tiêu điểm rõ ràng và văn bản tối giản, dễ đọc, thể hiện được bản chất của video. Tránh hình ảnh chung chung. Mục tiêu là tối đa hóa tỷ lệ nhấp chuột. Kịch bản: "${script.substring(0, 1000)}..."`;

    const prompts = {
        [Language.EN]: promptEn,
        [Language.VI]: promptVi,
    };
    
    const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });
        return response.generatedImages[0]?.image.imageBytes || null;
    } catch (error) {
        console.error("Error generating single thumbnail from script:", error);
        return null;
    }
};

export const generateImageMetadata = async (imageBase64: string, videoScript: string, videoTitle: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<ImageMetadata> => {
  const prompts = {
    [Language.EN]: `As a digital marketing expert specializing in YouTube and Google Image Search SEO, analyze the provided thumbnail image in the context of its video.
Video Title: "${videoTitle}"
Video Script: "${videoScript}"
Your task is to generate metadata to maximize discoverability, accessibility, and social media engagement, following the latest SEO best practices. Provide:
1. SEO Tags: Relevant keywords for YouTube and Google Images.
2. Alt-Text: A descriptive alt-text for the image for accessibility (WCAG compliance).
3. Social Media Caption: A short, engaging caption to promote the video using this image.`,
    [Language.VI]: `Với tư cách là một chuyên gia marketing kỹ thuật số chuyên về SEO cho YouTube và Google Image Search, hãy phân tích hình ảnh thumbnail được cung cấp trong bối cảnh video của nó.
Tiêu đề Video: "${videoTitle}"
Kịch bản Video: "${videoScript}"
Nhiệm vụ của bạn là tạo siêu dữ liệu để tối đa hóa khả năng khám phá, khả năng truy cập và tương tác trên mạng xã hội, tuân theo các phương pháp SEO tốt nhất mới nhất. Cung cấp:
1. Thẻ SEO: Các từ khóa liên quan cho YouTube và Google Images.
2. Văn bản thay thế (Alt-Text): Một văn bản thay thế mô tả hình ảnh để đảm bảo khả năng truy cập (tuân thủ WCAG).
3. Chú thích mạng xã hội: Một chú thích ngắn, hấp dẫn để quảng bá video bằng hình ảnh này.`
  };
  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } };
    const textPart = { text: finalPrompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                seoTags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of relevant SEO keywords."
                },
                altText: {
                    type: Type.STRING,
                    description: "A descriptive alt-text for accessibility."
                },
                socialMediaCaption: {
                    type: Type.STRING,
                    description: "An engaging social media caption."
                }
            }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating image metadata:", error);
    const errorResult = {
      [Language.EN]: { seoTags: ['error'], altText: 'Could not generate alt-text.', socialMediaCaption: 'Failed to generate caption. Please check API key.' },
      [Language.VI]: { seoTags: ['lỗi'], altText: 'Không thể tạo văn bản thay thế.', socialMediaCaption: 'Không thể tạo chú thích. Vui lòng kiểm tra API key.' }
    };
    return errorResult[language];
  }
};

const ideaLabResultSchema = {
  type: Type.OBJECT,
  properties: {
    ideas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'A catchy and SEO-friendly title for the video.' },
          description: { type: Type.STRING, description: 'A brief 1-2 sentence description of the video concept.' },
          hook: { type: Type.STRING, description: 'A compelling 1-sentence engagement hook for the intro.' },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 5-7 relevant SEO keywords.' },
          monetization: { type: Type.STRING, description: 'A brief, actionable monetization strategy.' },
          visualConcepts: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 2-3 high-level visual concepts or B-roll ideas.' },
          sfxSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 2-3 suggestions for sound effects or motion graphics.' },
        },
      }
    },
    targetAudience: { type: Type.STRING, description: "A description of the primary target audience for content on this topic." },
    suggestedFormats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 suggested content formats." }
  },
};

const ideaLabErrorResult = (language: Language): IdeaLabResult => {
  const messages = {
    [Language.EN]: { title: "AI Error", description: "Could not generate ideas. Check API key and console.", hook: "", keywords: [], monetization: "", visualConcepts: [], sfxSuggestions: [] },
    [Language.VI]: { title: "Lỗi AI", description: "Không thể tạo ý tưởng. Kiểm tra API key và console.", hook: "", keywords: [], monetization: "", visualConcepts: [], sfxSuggestions: [] }
  };
  return { 
      ideas: [messages[language]],
      targetAudience: "N/A",
      suggestedFormats: []
  };
}

export const generateContentIdeas = async (topic: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<IdeaLabResult> => {
  const prompts = {
    [Language.EN]: `For the topic "${topic}", generate a list of 5 creative YouTube video ideas. For EACH idea, provide: a catchy title, a short description, a compelling 1-sentence engagement hook for the intro, a list of 5-7 relevant SEO keywords, a brief monetization strategy, a list of 2-3 high-level visual concepts (like B-roll shots or on-screen graphics), and a list of 2-3 suggestions for sound effects or simple animations/motion graphics. Also, provide an overall target audience description for the main topic and a list of 3-4 suitable content formats.`,
    [Language.VI]: `Với chủ đề "${topic}", hãy tạo một danh sách 5 ý tưởng video YouTube sáng tạo. Với MỖI ý tưởng, hãy cung cấp: một tiêu đề hấp dẫn, một mô tả ngắn, một câu "hook" thu hút trong 1 câu cho phần giới thiệu, một danh sách 5-7 từ khóa SEO liên quan, một chiến lược kiếm tiền ngắn gọn, một danh sách 2-3 ý tưởng hình ảnh cấp cao (như cảnh B-roll hoặc đồ họa trên màn hình), và một danh sách 2-3 gợi ý về hiệu ứng âm thanh hoặc hoạt ảnh/đồ họa chuyển động đơn giản. Đồng thời, mô tả đối tượng mục tiêu tổng thể cho chủ đề chính và đề xuất 3-4 định dạng nội dung phù hợp.`
  }
  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: finalPrompt,
       config: {
         responseMimeType: "application/json",
         responseSchema: ideaLabResultSchema,
       },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating content ideas:", error);
    return ideaLabErrorResult(language);
  }
};

export const analyzeImportedIdeas = async (fileContent: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<IdeaLabResult> => {
  const prompts = {
    [Language.EN]: `Analyze the following text, which contains one or more YouTube video ideas from a creator's notes. Your task is to process this text and structure it as a strategic brief. Extract up to 5 of the most distinct ideas. For EACH idea, generate: a catchy title, a short description, a compelling hook, relevant SEO keywords, a monetization strategy, a list of 2-3 high-level visual concepts (like B-roll shots or on-screen graphics), and a list of 2-3 suggestions for sound effects or simple animations/motion graphics. Also, provide an overall target audience description based on the text and suggest suitable content formats. The input text might be unstructured, so do your best to interpret it. Here is the text: \n\n"${fileContent}"`,
    [Language.VI]: `Phân tích văn bản sau, chứa một hoặc nhiều ý tưởng video YouTube từ ghi chú của một nhà sáng tạo. Nhiệm vụ của bạn là xử lý văn bản này và cấu trúc nó thành một bản tóm tắt chiến lược. Trích xuất tối đa 5 ý tưởng khác biệt nhất. Với MỖI ý tưởng, hãy tạo: một tiêu đề hấp dẫn, một mô tả ngắn, một câu "hook" thu hút, các từ khóa SEO liên quan, một chiến lược kiếm tiền, một danh sách 2-3 ý tưởng hình ảnh cấp cao (như cảnh B-roll hoặc đồ họa trên màn hình), và một danh sách 2-3 gợi ý về hiệu ứng âm thanh hoặc hoạt ảnh/đồ họa chuyển động đơn giản. Đồng thời, mô tả đối tượng mục tiêu tổng thể dựa trên văn bản và đề xuất các định dạng nội dung phù hợp. Văn bản đầu vào có thể không có cấu trúc, vì vậy hãy cố gắng hết sức để diễn giải nó. Đây là văn bản: \n\n"${fileContent}"`
  }
  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: finalPrompt,
       config: {
         responseMimeType: "application/json",
         responseSchema: ideaLabResultSchema,
       },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing imported ideas:", error);
    return ideaLabErrorResult(language);
  }
};

const viralClipsResultSchema = {
  type: Type.OBJECT,
  properties: {
    clips: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          clipScript: { type: Type.STRING, description: 'The exact script portion for the short video clip.' },
          suggestedTitle: { type: Type.STRING, description: 'A catchy, viral-style title or hook for the short video.' },
          viralityReason: { type: Type.STRING, description: 'A brief explanation of why this segment has high viral potential.' },
          suggestedHashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 3-5 relevant hashtags for platforms like TikTok or YouTube Shorts.' },
          visualIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 2-3 specific visual ideas, B-roll shots, or on-screen text callouts for the clip.' },
          sfxAndAnimations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 2-3 suggestions for sound effects, transitions, or simple motion graphics to enhance the clip.' },
        },
      }
    },
    overallSummary: { type: Type.STRING, description: "A brief summary of the script's potential for creating short-form content." },
  },
};


export const findViralClips = async (script: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<ViralClipsResult> => {
  const prompts = {
    [Language.EN]: `Act as a viral content strategist specializing in short-form video platforms like TikTok, YouTube Shorts, and Instagram Reels. I'm providing you with a script for a long-form video. Your task is to analyze this script and identify 3 to 5 of the most engaging, hook-worthy, or surprising moments that have the highest potential to become viral short clips.

For each identified clip, you must provide:
1.  **clipScript**: The exact text from the script for this short clip. The clip should be concise, typically under 60 seconds of speaking time.
2.  **suggestedTitle**: A highly engaging, catchy title or hook for the short video.
3.  **viralityReason**: A short, clear explanation of why this specific segment has viral potential (e.g., "strong emotional hook," "surprising plot twist," "controversial statement," "highly relatable problem," "satisfying resolution").
4.  **suggestedHashtags**: A list of 3-5 relevant and trending hashtags.
5.  **visualIdeas**: A list of 2-3 specific visual ideas, B-roll shots, or on-screen text callouts that should appear during the clip.
6.  **sfxAndAnimations**: A list of 2-3 suggestions for sound effects, transitions, or simple motion graphics to enhance the clip's impact.

Also, provide an **overallSummary** of the script's potential for creating engaging short-form content.

Here is the script: \n\n"${script}"`,
    [Language.VI]: `Hãy đóng vai một chiến lược gia nội dung viral chuyên về các nền tảng video dạng ngắn như TikTok, YouTube Shorts và Instagram Reels. Tôi sẽ cung cấp cho bạn một kịch bản cho một video dài. Nhiệm vụ của bạn là phân tích kịch bản này và xác định từ 3 đến 5 khoảnh khắc hấp dẫn nhất, có "hook" mạnh mẽ nhất, hoặc bất ngờ nhất có tiềm năng trở thành clip ngắn viral cao nhất.

Đối với mỗi clip được xác định, bạn phải cung cấp:
1.  **clipScript**: Đoạn văn bản chính xác từ kịch bản cho clip ngắn này. Clip phải ngắn gọn, thời gian nói thường dưới 60 giây.
2.  **suggestedTitle**: Một tiêu đề hoặc câu "hook" hấp dẫn, dễ viral cho video ngắn.
3.  **viralityReason**: Một lời giải thích ngắn gọn, rõ ràng về lý do tại sao phân đoạn cụ thể này có tiềm năng viral (ví dụ: "câu hook cảm xúc mạnh," "tình tiết bất ngờ," "phát ngôn gây tranh cãi," "vấn đề dễ đồng cảm," "giải pháp thỏa mãn").
4.  **suggestedHashtags**: Một danh sách 3-5 hashtag liên quan và đang thịnh hành.
5.  **visualIdeas**: Một danh sách 2-3 ý tưởng hình ảnh cụ thể, cảnh B-roll, hoặc chú thích văn bản trên màn hình nên xuất hiện trong clip.
6.  **sfxAndAnimations**: Một danh sách 2-3 gợi ý về hiệu ứng âm thanh, chuyển cảnh, hoặc đồ họa chuyển động đơn giản để tăng cường tác động của clip.

Đồng thời, cung cấp một **overallSummary** về tiềm năng của kịch bản trong việc tạo ra nội dung dạng ngắn hấp dẫn.

Đây là kịch bản: \n\n"${script}"`
  };
  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: finalPrompt,
       config: {
         responseMimeType: "application/json",
         responseSchema: viralClipsResultSchema,
       },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error finding viral clips:", error);
    const errorMessages = {
        [Language.EN]: { clips: [], overallSummary: 'Failed to analyze script for viral clips. Please check your API key and network connection.'},
        [Language.VI]: { clips: [], overallSummary: 'Không thể phân tích kịch bản để tìm clip viral. Vui lòng kiểm tra API key và kết nối mạng.'}
    };
    return errorMessages[language];
  }
};


export const optimizeContent = async (script: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<OptimizedContent> => {
    const prompts = {
      [Language.EN]: `Based on the following script, generate metadata for a YouTube video. Provide 5 catchy, SEO-friendly titles, one optimized video description (under 200 words), and a list of 10 relevant tags. Script: "${script}"`,
      [Language.VI]: `Dựa trên kịch bản sau, hãy tạo siêu dữ liệu cho một video YouTube. Cung cấp 5 tiêu đề hấp dẫn, thân thiện với SEO, một mô tả video được tối ưu hóa (dưới 200 từ) và danh sách 10 thẻ (tag) có liên quan. Kịch bản: "${script}"`
    }
    const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: finalPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        titles: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "5 catchy, SEO-friendly video titles."
                        },
                        description: {
                            type: Type.STRING,
                            description: "An optimized video description under 200 words."
                        },
                        tags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of 10 relevant tags (keywords)."
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error optimizing content:", error);
        const errorMessages = {
          [Language.EN]: {
            titles: ["AI Error"],
            description: "Could not generate optimized content. Check API key and console.",
            tags: ["error"]
          },
          [Language.VI]: {
            titles: ["Lỗi AI"],
            description: "Không thể tạo nội dung tối ưu hóa. Kiểm tra API key và console.",
            tags: ["lỗi"]
          }
        };
        return errorMessages[language];
    }
};

export const startVideoGeneration = async (prompt: string, presetContext?: string, isBrandLocked?: boolean): Promise<any> => {
    const finalPrompt = addPresetContextToPrompt(prompt, presetContext, isBrandLocked);
    try {
        const operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: finalPrompt,
            config: {
                numberOfVideos: 1
            }
        });
        return operation;
    } catch (error) {
        console.error("Error starting video generation:", error);
        throw error;
    }
};

export const checkVideoGenerationStatus = async (operation: any): Promise<any> => {
    try {
        const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });
        return updatedOperation;
    } catch (error) {
        console.error("Error checking video generation status:", error);
        throw error;
    }
};

export const analyzeAudienceAndEngagement = async (script: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<AudienceAnalysisResult> => {
  const prompts = {
    [Language.EN]: `Analyze the following video script for a content creator. Predict the primary target audience demographic including a likely age range and key interests. Provide an engagement analysis, predicting the overall sentiment (e.g., 'Positive', 'Inspirational', 'Humorous') and identifying up to 3 key emotional triggers. Suggest 3 open-ended questions to ask the audience in the video or description to boost comments. Finally, generate 3-4 versatile, automated replies that the creator can use for common viewer comments (e.g., "Great video!", "Thanks for sharing!"). The replies should be engaging and relevant to the script's content. Script:`,
    [Language.VI]: `Phân tích kịch bản video sau đây cho một nhà sáng tạo nội dung. Dự đoán nhân khẩu học của đối tượng mục tiêu chính bao gồm độ tuổi và sở thích chính. Cung cấp phân tích tương tác, dự đoán cảm xúc chung (ví dụ: 'Tích cực', 'Truyền cảm hứng', 'Hài hước') và xác định tối đa 3 yếu tố kích hoạt cảm xúc chính. Đề xuất 3 câu hỏi mở để hỏi khán giả trong video hoặc mô tả để tăng bình luận. Cuối cùng, tạo 3-4 câu trả lời tự động, linh hoạt mà nhà sáng tạo có thể sử dụng cho các bình luận phổ biến của người xem (ví dụ: "Video hay quá!", "Cảm ơn đã chia sẻ!"). Các câu trả lời phải hấp dẫn và liên quan đến nội dung của kịch bản. Kịch bản:`
  };

  const finalPrompt = addPresetContextToPrompt(`${prompts[language]} "${script}"`, presetContext, isBrandLocked);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedDemographics: {
              type: Type.OBJECT,
              properties: {
                ageRange: { type: Type.STRING, description: "The predicted age range of the target audience." },
                interests: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key interests for the target audience." },
              }
            },
            engagementAnalysis: {
              type: Type.OBJECT,
              properties: {
                predictedSentiment: { type: Type.STRING, description: "The likely overall sentiment the video will evoke." },
                emotionalTriggers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key emotional triggers in the script." },
              }
            },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Open-ended questions to boost engagement."
            },
            automatedCommentReplies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Versatile, automated replies for common viewer comments."
            }
          }
        }
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing audience and engagement:", error);
    const errorMessages = {
      [Language.EN]: {
        predictedDemographics: { ageRange: 'N/A', interests: ['Error fetching data'] },
        engagementAnalysis: { predictedSentiment: 'N/A', emotionalTriggers: ['Please check API key and network.'] },
        suggestedQuestions: ['Could not generate questions.'],
        automatedCommentReplies: ['Could not generate replies.'],
      },
      [Language.VI]: {
        predictedDemographics: { ageRange: 'Không có', interests: ['Lỗi khi lấy dữ liệu'] },
        engagementAnalysis: { predictedSentiment: 'Không có', emotionalTriggers: ['Vui lòng kiểm tra API key và mạng.'] },
        suggestedQuestions: ['Không thể tạo câu hỏi.'],
        automatedCommentReplies: ['Không thể tạo câu trả lời.'],
      }
    };
    return errorMessages[language];
  }
};

export const generateVideoPromptSuggestion = async (language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<string> => {
  const prompts = {
    [Language.EN]: "Generate a single, creative, and visually descriptive video prompt suitable for an AI video generator. The prompt should be a short sentence, under 20 words. Do not add any preamble, quotation marks, or extra text, just the prompt sentence itself. The prompt should be about a unique concept.",
    [Language.VI]: "Tạo một lời nhắc video duy nhất, sáng tạo và mô tả trực quan, phù hợp cho một trình tạo video AI. Lời nhắc phải là một câu ngắn, dưới 20 từ. Không thêm bất kỳ lời nói đầu, dấu ngoặc kép hoặc văn bản thừa nào, chỉ cần chính câu nhắc đó. Lời nhắc nên về một khái niệm độc đáo."
  };
  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        temperature: 0.9,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating video prompt suggestion:", error);
    const errorMessages = {
      [Language.EN]: "Failed to get an AI suggestion. Please try again.",
      [Language.VI]: "Không thể nhận gợi ý từ AI. Vui lòng thử lại."
    }
    return errorMessages[language];
  }
};


export const generateSubtitles = async (prompt: string, duration: number, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<string> => {
  const prompts = {
    [Language.EN]: `You are an expert subtitle creator. A short video has been generated from the prompt: "${prompt}". The video is exactly ${Math.round(duration)} seconds long. Your task is to create a synchronized subtitle track for this video in VTT format. The subtitles should be a creative narration that describes the events in the video based on the prompt. Create 2 to 4 subtitle cues. The timestamps must be in HH:MM:SS.sss format and must not exceed the total video duration. Output ONLY the raw VTT content, starting with "WEBVTT" and nothing else. Do not add any explanation or surrounding text.`,
    [Language.VI]: `Bạn là một chuyên gia tạo phụ đề. Một video ngắn đã được tạo từ mô tả: "${prompt}". Video có thời lượng chính xác là ${Math.round(duration)} giây. Nhiệm vụ của bạn là tạo một tệp phụ đề được đồng bộ hóa cho video này ở định dạng VTT. Phụ đề nên là một lời tường thuật sáng tạo mô tả các sự kiện trong video dựa trên mô tả. Tạo từ 2 đến 4 cue phụ đề. Dấu thời gian phải ở định dạng HH:MM:SS.sss và không được vượt quá tổng thời lượng video. Chỉ xuất ra nội dung VTT thô, bắt đầu bằng "WEBVTT" và không có gì khác. Không thêm bất kỳ lời giải thích hay văn bản bao quanh nào.`
  };
  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        temperature: 0.7,
      },
    });
    // Basic validation to ensure it looks like VTT
    const text = response.text.trim();
    if (text.startsWith('WEBVTT')) {
      return text;
    } else {
      // If the model adds extra text, try to find the VTT block
      const vttStartIndex = text.indexOf('WEBVTT');
      if (vttStartIndex !== -1) {
        return text.substring(vttStartIndex);
      }
      throw new Error("Generated content is not in valid VTT format.");
    }
  } catch (error) {
    console.error("Error generating subtitles:", error);
    const errorMessages = {
      [Language.EN]: "WEBVTT\n\n00:00:00.000 --> 00:00:05.000\n[Failed to generate subtitles]",
      [Language.VI]: "WEBVTT\n\n00:00:00.000 --> 00:00:05.000\n[Không thể tạo phụ đề]"
    }
    return errorMessages[language];
  }
};

export const generateChapters = async (script: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<Chapter[]> => {
  const prompts = {
    [Language.EN]: `Act as a YouTube content expert. I will provide a video script. Your task is to generate a list of YouTube video chapters. Analyze the script to identify the main sections. For each section, provide a concise, SEO-friendly title and an estimated timestamp. Assume an average speaking rate of 150 words per minute. Start the first chapter at "00:00". Format the output as a JSON array of objects, where each object has a "timestamp" (in "MM:SS" format) and a "title". Here is the script: \n\n"${script}"`,
    [Language.VI]: `Đóng vai một chuyên gia nội dung YouTube. Tôi sẽ cung cấp một kịch bản video. Nhiệm vụ của bạn là tạo một danh sách các chương video YouTube. Phân tích kịch bản để xác định các phần chính. Đối với mỗi phần, hãy cung cấp một tiêu đề ngắn gọn, thân thiện với SEO và một dấu thời gian ước tính. Giả sử tốc độ nói trung bình là 150 từ mỗi phút. Bắt đầu chương đầu tiên tại "00:00". Định dạng đầu ra dưới dạng một mảng JSON các đối tượng, trong đó mỗi đối tượng có một "timestamp" (định dạng "MM:SS") và một "title". Đây là kịch bản: \n\n"${script}"`,
  };
  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timestamp: { type: Type.STRING, description: 'The chapter start time in MM:SS format.' },
              title: { type: Type.STRING, description: 'The concise, SEO-friendly title of the chapter.' },
            },
          },
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error generating chapters:', error);
    const errorMessages = {
      [Language.EN]: [{ timestamp: '00:00', title: 'Error generating chapters. Please check API key.' }],
      [Language.VI]: [{ timestamp: '00:00', title: 'Lỗi tạo chương. Vui lòng kiểm tra API key.' }],
    };
    return errorMessages[language];
  }
};

export const analyzeComments = async (comments: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<CommentAnalysis> => {
  const prompts = {
    [Language.EN]: `As a YouTube community manager AI, analyze the following batch of user comments from a video. Your task is to synthesize this feedback into actionable insights. Provide:
1.  **overallSentiment**: A single word summarizing the general sentiment (e.g., "Positive", "Negative", "Mixed", "Neutral").
2.  **commonThemes**: A list of the top 3-5 most frequently discussed topics, questions, or points of confusion from the comments.
3.  **futureVideoIdeas**: A list of 2-3 concrete video ideas for future content based directly on the user questions and feedback.

Here are the comments, separated by newlines:\n\n"${comments}"`,
    [Language.VI]: `Với vai trò là AI quản lý cộng đồng YouTube, hãy phân tích lô bình luận sau đây từ một video. Nhiệm vụ của bạn là tổng hợp phản hồi này thành những hiểu biết có thể hành động. Cung cấp:
1.  **overallSentiment**: Một từ duy nhất tóm tắt cảm xúc chung (ví dụ: "Tích cực", "Tiêu cực", "Trái chiều", "Trung lập").
2.  **commonThemes**: Danh sách 3-5 chủ đề, câu hỏi hoặc điểm khó hiểu được thảo luận thường xuyên nhất từ các bình luận.
3.  **futureVideoIdeas**: Danh sách 2-3 ý tưởng video cụ thể cho nội dung trong tương lai dựa trực tiếp vào câu hỏi và phản hồi của người dùng.

Đây là các bình luận, được phân tách bằng dòng mới:\n\n"${comments}"`,
  };
  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSentiment: { type: Type.STRING, description: 'The overall sentiment of the comments.' },
            commonThemes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of common themes or questions.' },
            futureVideoIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of suggested video ideas.' },
          },
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error analyzing comments:', error);
    const errorMessages = {
      [Language.EN]: { overallSentiment: 'N/A', commonThemes: ['Failed to analyze comments.'], futureVideoIdeas: ['Please check API key.'] },
      [Language.VI]: { overallSentiment: 'Không xác định', commonThemes: ['Không thể phân tích bình luận.'], futureVideoIdeas: ['Vui lòng kiểm tra API key.'] },
    };
    return errorMessages[language];
  }
};


export const analyzeScriptForBrandSafety = async (script: string, language: Language, presetContext?: string, isBrandLocked?: boolean): Promise<BrandSafetyAnalysis> => {
  const prompts = {
    [Language.EN]: `Act as a brand safety and content moderation expert. Analyze the following video script for a content creator. Your task is to identify any elements that could be risky for brand sponsorships or monetization.
Provide:
1.  **overallTone**: A short phrase describing the overall tone of the script (e.g., "Educational and Enthusiastic", "Critical and Sarcastic", "Humorous and Lighthearted").
2.  **brandSafetySummary**: A brief summary assessing the content's general brand safety (e.g., "Generally brand-safe for most advertisers.", "Contains sensitive topics suitable only for specific brand categories.", "High-risk content due to controversial language.").
3.  **potentialIssues**: A list of specific quotes from the script that might be flagged. For each issue, provide the exact 'quote', the 'issueType' (e.g., "Strong Language", "Controversial Topic", "Political Statement", "Negative Sentiment towards a group", "Adult Theme"), and a brief 'explanation' of why it was flagged. If no issues are found, return an empty array for potentialIssues.

Here is the script: \n\n"${script}"`,
    [Language.VI]: `Hãy đóng vai một chuyên gia về an toàn thương hiệu và kiểm duyệt nội dung. Phân tích kịch bản video sau đây cho một nhà sáng tạo nội dung. Nhiệm vụ của bạn là xác định bất kỳ yếu tố nào có thể gây rủi ro cho các nhà tài trợ thương hiệu hoặc việc kiếm tiền.
Cung cấp:
1.  **overallTone**: Một cụm từ ngắn mô tả giọng điệu chung của kịch bản (ví dụ: "Giáo dục và Nhiệt tình", "Phê phán và Mỉa mai", "Hài hước và Nhẹ nhàng").
2.  **brandSafetySummary**: Một bản tóm tắt ngắn gọn đánh giá mức độ an toàn thương hiệu chung của nội dung (ví dụ: "Nhìn chung an toàn cho hầu hết các nhà quảng cáo.", "Chứa các chủ đề nhạy cảm chỉ phù hợp với các danh mục thương hiệu cụ thể.", "Nội dung có rủi ro cao do ngôn ngữ gây tranh cãi.").
3.  **potentialIssues**: Một danh sách các trích dẫn cụ thể từ kịch bản có thể bị gắn cờ. Đối với mỗi vấn đề, hãy cung cấp 'quote' (trích dẫn) chính xác, 'issueType' (loại vấn đề, ví dụ: "Ngôn ngữ nhạy cảm", "Chủ đề gây tranh cãi", "Tuyên bố chính trị", "Thái độ tiêu cực đối với một nhóm", "Chủ đề người lớn"), và một 'explanation' (giải thích) ngắn gọn về lý do nó bị gắn cờ. Nếu không tìm thấy vấn đề nào, hãy trả về một mảng trống cho potentialIssues.

Đây là kịch bản: \n\n"${script}"`,
  };

  const finalPrompt = addPresetContextToPrompt(prompts[language], presetContext, isBrandLocked);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallTone: { type: Type.STRING, description: 'A short phrase describing the overall tone.' },
            brandSafetySummary: { type: Type.STRING, description: 'A brief summary of the brand safety assessment.' },
            potentialIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING, description: 'The exact quote flagged.' },
                  issueType: { type: Type.STRING, description: 'The category of the issue.' },
                  explanation: { type: Type.STRING, description: 'A brief explanation of the issue.' },
                },
              },
              description: 'A list of potential brand safety issues.'
            },
          },
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error analyzing for brand safety:', error);
    const errorMessages = {
      [Language.EN]: { overallTone: 'N/A', brandSafetySummary: 'Failed to analyze script for brand safety. Please check API key.', potentialIssues: [] },
      [Language.VI]: { overallTone: 'Không xác định', brandSafetySummary: 'Không thể phân tích kịch bản về an toàn thương hiệu. Vui lòng kiểm tra API key.', potentialIssues: [] },
    };
    return errorMessages[language];
  }
};