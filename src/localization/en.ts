export const en = {
  header: {
    title: "Creator's Suite",
    dashboard: 'Dashboard',
    ideaLab: 'Idea Lab',
    productionStudio: 'Production Studio',
    videoLab: 'Video Lab',
    analyticsHub: 'Analytics Hub',
    calendar: 'Calendar',
    help: 'Help',
    language: 'Language',
    english: 'English',
    vietnamese: 'Vietnamese',
  },
  dashboard: {
    welcome: 'Welcome, Creator!',
    commandCenter: "Here's your command center to manage your content pipeline.",
    myTasks: 'My Tasks',
    unsort: 'Unsort',
    sortByPriority: 'Sort by Priority',
    addTaskPlaceholder: 'Add a new to-do item...',
    lowPriority: 'Low',
    mediumPriority: 'Medium',
    highPriority: 'High',
    add: 'Add',
    noTasks: 'No tasks yet. Add one above!',
    exportTasks: 'Export Tasks',
    priority: 'Priority',
    deadline: 'Deadline',
    workflowGuide: {
      title: 'Your Content Workflow',
      step1Title: '1. Ideate',
      step1Description: 'Start with a new concept. Add an idea here or use the Idea Lab for AI-powered brainstorming.',
      step1Placeholder: 'Enter a new video idea...',
      step1Button: 'Go to Idea Lab',
      step2Title: '2. Plan',
      step2Description: 'Organize your ideas and schedule your content on the calendar.',
      step2Button: 'Open Calendar',
      step3Title: '3. Create',
      step3Description: 'Write scripts, generate thumbnails, and create video clips for your project.',
      step3Button: 'Go to Production Studio',
      step4Title: '4. Analyze',
      step4Description: 'Get AI-driven insights on your script to understand your audience and engagement.',
      step4Button: 'Go to Analytics Hub',
    },
    presetManager: {
        title: 'Company Preset Manager',
        description: 'Select a company preset to tailor all AI generation to a specific brand, or import/export your own.',
        activePreset: 'Active Preset',
        brandLockActive: 'Brand Lock Active',
        selectAriaLabel: 'Select Company Preset',
        importButton: 'Import Preset (.json)',
        exportButton: 'Export Selected',
        downloadTemplateButton: 'Download Template',
        exportError: "The 'None' preset cannot be exported as it contains no specific data.",
        importSuccess: 'Preset "{presetName}" imported successfully!',
        importErrorMalformed: 'Failed to import preset. The file may be malformed. Please use the template as a guide.',
        importErrorParse: 'Failed to parse the preset file. Make sure it is valid JSON.',
    },
  },
  ideaLab: {
    title: 'Idea Lab',
    description: 'Feeling stuck? Enter a broad topic or keyword, or import an existing idea file, and let AI generate creative video ideas, audience profiles, and format suggestions for you.',
    placeholder: "e.g., 'sustainable living', 'retro gaming'",
    generateFromTopic: 'Generate from a Topic',
    importTitle: 'Or Analyze Ideas from a File',
    importLabel: 'Import .txt or .md file',
    generateInsights: 'Analyze & Generate Insights',
    generating: 'Generating creative insights...',
    generatedIdeas: 'Generated Ideas',
    addToCalendar: 'Add to Calendar',
    targetAudience: 'Target Audience',
    suggestedFormats: 'Suggested Formats',
    engagementHook: 'Engagement Hook',
    keywords: 'Keywords',
    monetizationStrategy: 'Monetization Strategy',
    visualConcepts: 'Visual Concepts',
    sfxSuggestions: 'SFX & Animation Ideas',
    exportReport: 'Export Report',
    viralClipFinder: {
      title: 'Viral Clip Finder',
      description: "Upload a long-form video script (.txt, .md). The AI will identify 3-5 moments with the highest potential to become viral short-form videos for platforms like TikTok, YouTube Shorts, and Reels.",
      importLabel: 'Import Long-form Script',
      findClips: 'Find Viral Moments',
      finding: 'Analyzing script for viral moments...',
      resultsTitle: 'Potential Viral Clips',
      overallSummary: 'AI Summary',
      clipScript: 'Clip Script',
      copyScript: 'Copy Script',
      viralityReason: 'Why it could go viral',
      hashtags: 'Suggested Hashtags',
      visualIdeas: 'Visual Ideas',
      sfxAndAnimations: 'SFX & Animations',
      addToCalendarShorts: 'Add as Short',
    }
  },
  productionStudio: {
    title: 'Production Studio',
    description: 'Follow the steps to take your idea from script to ready-to-publish assets.',
    contentFormat: 'Content Format',
    longForm: 'Long-form (16:9)',
    shortForm: 'Short-form (9:16)',
    tabScript: 'Script',
    tabOptimize: 'Optimize',
    tabThumbnails: 'Thumbnails',
    // Script Editor
    scriptEditor: 'Script Editor',
    scriptPlaceholder: 'Paste your video script here, or use the voice-to-text feature...',
    transcriptionFeedback: 'Transcription Accuracy Feedback',
    analyzingTranscription: 'Analyzing transcription for errors...',
    aiScriptAnalysis: 'AI Script Analysis',
    analyzingScript: 'Analyzing script for pacing and clarity...',
    analysisAndPacing: 'Analysis & Pacing',
    readingTime: 'Estimated Reading Time',
    words: 'words',
    readingSpeed: 'Reading Speed',
    wpm: 'WPM',
    voiceToText: 'Voice-to-Text',
    english: 'English (US)',
    vietnamese: 'Vietnamese',
    stopRecording: 'Stop Recording',
    recordScript: 'Record Script',
    improveScript: 'Improve Script with AI',
    teleprompter: 'Teleprompter',
    sidebarTitle: 'AI Script Doctor',
    overallFeedback: 'Overall Feedback',
    rephrasingSuggestions: 'Rephrasing Suggestions',
    ctaSuggestions: 'Call-to-Action Ideas',
    seoMode: 'Enable SEO Pro Mode',
    seoModeDescription: 'When enabled, the AI will rewrite your entire script for maximum engagement and discoverability.',
    rewrittenScriptTitle: 'AI-Rewritten Script (SEO Pro)',
    useThisVersion: 'Use This Version',
    exportScript: 'Export Script',
    // Optimizer
    optimizerPrompt: 'Please write a script in the "Script" tab first.',
    metadataGeneration: 'Metadata Generation',
    generateMetadata: 'Generate Metadata',
    optimizing: 'Optimizing...',
    suggestedTitles: 'Suggested Titles',
    copy: 'Copy',
    videoDescription: 'Video Description',
    tags: 'Tags',
    optimizedContentPlaceholder: 'Your optimized content will appear here after generation.',
    chapterGeneratorTitle: 'AI Chapter Generator',
    chapterGeneratorDescription: 'Let AI analyze your script to automatically create chapters for your YouTube video, improving viewer experience and SEO.',
    generateChapters: 'Generate Chapters',
    generatingChapters: 'Generating chapters...',
    copyForYouTube: 'Copy for YouTube',
    exportMetadata: 'Export Metadata',
    // Thumbnail Studio
    generateFromScriptTitle: 'Generate Thumbnail from Script',
    generateFromScriptDescription: 'Let AI create a single, optimized thumbnail based on the full content of your script in the selected format.',
    generateFromScriptButton: 'Generate Thumbnail',
    generatingFromScript: 'Generating from script... this may take a moment.',
    generatedThumbnailTitle: 'Generated Thumbnail',
    abTest: 'A/B Test Thumbnails',
    abTestDescription: 'Upload your thumbnails or use the concepts generated below to compare them side-by-side.',
    thumbA: 'Thumbnail A',
    thumbB: 'Thumbnail B',
    uploadFile: 'Upload a file',
    dragDrop: 'or drag and drop',
    pngJpg: 'PNG, JPG',
    noImage: 'No image',
    generateConcepts: 'Generate Concepts from Title',
    titlePlaceholder: 'Enter video title...',
    generate: 'Generate Concepts',
    generating: 'Generating...',
    useA: 'Use for A',
    useB: 'Use for B',
    aiFeedback: 'AI Feedback',
    analyzeThumbs: 'Analyze Thumbnails',
    analyzing: 'Analyzing...',
    feedbackPlaceholder: 'Upload two thumbnails and click the button to get AI feedback.',
    exportFeedback: 'Export Feedback',
    metadataEngineTitle: 'Thumbnail Metadata Engine',
    metadataEngineDescription: 'Upload an image, and the AI will analyze it with your script and title to generate SEO tags, alt-text, and a social media caption.',
    uploadForMetadata: 'Upload Thumbnail for Analysis',
    generateMetadataButton: 'Generate Metadata',
    seoTags: 'SEO Tags',
    altText: 'Accessibility Alt-Text',
    socialCaption: 'Social Media Caption',
    exportMetadataReport: 'Export Report',
  },
  videoLab: {
    title: 'Video Lab',
    description: 'Generate short, engaging video clips from a text prompt. Ideal for social media teasers, intros, or animated concepts.',
    warningTitle: 'Important Note on Video Generation',
    warningContent: "Video generation is an advanced, resource-intensive process that can take several minutes to complete. Please be patient. Each generation consumes a significant amount of your API quota. Use this feature wisely.",
    promptLabel: 'Video Prompt',
    modeLabel: 'Generation Mode',
    presetLabel: 'Creative Preset',
    generateButton: 'Generate Video',
    downloadButton: 'Download Video',
    downloadSubtitlesButton: 'Download Subtitles',
    generateSubtitlesButton: 'Generate Subtitles',
    generatingTitle: 'Your video is being created...',
    errorTitle: 'An Error Occurred',
    tryAgain: 'Please try again.',
    playbackSpeed: 'Speed',
    loop: 'Loop',
    promptSuggestionsTitle: 'Need inspiration? Try one of these:',
    getAISuggestionButton: 'Get AI Suggestion',
    promptSuggestions: [
      'A drone shot flying over a serene mountain range at sunrise',
      'An animated sequence of a robot learning to paint',
      'A cinematic close-up of a dewdrop on a spiderweb',
      'A time-lapse of a flower blooming in vibrant colors',
      'An apple smoothly morphing into a butterfly',
    ],
    presets: {
      none: 'None (Custom)',
      trailer: 'Epic Movie Trailer',
      explainer: 'Cute Explainer Animation',
      product: 'Sleek Product Showcase',
      dreamscape: 'Surreal Dreamscape',
      food: 'Delicious Food Ad',
      noir_film: 'Film Noir',
      documentary: 'Nature Documentary',
      vaporwave: 'Vaporwave Aesthetic',
      pixel_art: 'Pixel Art',
    },
    presetPrompts: {
      trailer: 'A dramatic, cinematic trailer-style shot of [YOUR SUBJECT HERE], with intense lighting and slow motion.',
      explainer: 'A simple and friendly 2D animation of [YOUR SUBJECT HERE] explaining a concept, with clean lines and bright colors.',
      product: 'Sleek motion graphics showcasing [YOUR PRODUCT], with dynamic text overlays and a clean background.',
      dreamscape: 'A surreal, dream-like sequence of [YOUR SUBJECT HERE], with floating objects and shifting, vibrant colors.',
      food: 'A delicious, macro, slow-motion shot of [YOUR FOOD ITEM], with steam rising and perfect commercial lighting.',
      noir_film: 'A black and white, high-contrast film noir style shot of [YOUR SUBJECT HERE], with dramatic shadows and a mysterious atmosphere.',
      documentary: 'A beautiful, David Attenborough-style nature documentary shot of [YOUR SUBJECT HERE] in its natural habitat.',
      vaporwave: 'A vaporwave aesthetic animation of [YOUR SUBJECT HERE], with neon grids, pastel colors, and retro 80s computer graphics.',
      pixel_art: 'A retro pixel art animation of [YOUR SUBJECT HERE], like a scene from a 16-bit video game.',
    },
    modes: {
      cinematic: 'Cinematic',
      animation: 'Animation',
      motion_graphics: 'Motion Graphics',
      morph: 'Object Morph',
      timelapse: 'Time-lapse',
      hyperlapse: 'Hyperlapse',
      drone_shot: 'Drone Shot',
      vintage_film: 'Vintage Film',
    },
    promptHelpers: {
      cinematic: 'e.g., A cinematic shot of a lone astronaut on a red planet.',
      animation: 'e.g., A whimsical 2D animation of a cat DJing at a party.',
      motion_graphics: 'e.g., An elegant motion graphics sequence for a tech company logo reveal.',
      morph: 'e.g., An apple smoothly morphing into a butterfly.',
      timelapse: 'e.g., A time-lapse of a bustling city street from day to night.',
      hyperlapse: 'e.g., A hyperlapse video moving through a futuristic cityscape at night.',
      drone_shot: 'e.g., An aerial drone shot flying over a lush tropical jungle.',
      vintage_film: 'e.g., A vintage 8mm film look of a family picnic in the 1970s.',
    },
    loadingMessages: [
      "Warming up the digital director...",
      "Storyboarding your concept...",
      "Assembling the digital film crew...",
      "Rendering initial frames...",
      "Applying visual effects...",
      "Compositing the final scenes...",
      "This is taking a bit longer than usual, but great art takes time!",
      "Finalizing the audio-visual sync...",
      "Polishing the final cut...",
      "Almost there, just packing it up for you!"
    ],
  },
  analyticsHub: {
    title: 'Analytics Hub',
    description: "Get AI-powered predictions for your script. Understand your audience and ensure brand safety before you film.",
    inputLabel: 'Video Script or Detailed Concept',
    placeholder: 'Paste your complete video script or a detailed description of your video concept here...',
    placeholderAuto: 'Script from Production Studio is loaded automatically. Switch to Manual Mode to edit.',
    analyzing: 'Analyzing for insights...',
    exportReport: 'Export Report',
    initialPrompt: 'Enter your script above and choose an analysis to begin.',
    audienceAnalyzer: {
      title: 'Audience & Engagement Analysis',
      description: 'Predict your target audience, analyze the script’s emotional triggers, and get suggestions to boost viewer engagement.',
      button: 'Analyze Audience',
    },
    demographicsTitle: 'Predicted Audience Demographics',
    ageRange: 'Age Range',
    interests: 'Key Interests',
    engagementTitle: 'Engagement Analysis',
    sentiment: 'Predicted Sentiment',
    triggers: 'Emotional Triggers',
    questionsTitle: 'Engagement-Boosting Questions',
    automatedRepliesTitle: 'Automated Comment Replies',
    brandSafetyAnalyzer: {
      title: 'Brand Safety & Tone Analysis',
      description: 'Scan your script for sensitive topics, strong language, and overall tone to ensure your content is advertiser-friendly.',
      button: 'Analyze Brand Safety',
      analyzing: 'Analyzing for brand safety...',
      initialPrompt: 'Enter your script to analyze it for brand safety and tone.',
      overallTone: 'Overall Tone',
      safetySummary: 'Brand Safety Summary',
      potentialIssues: 'Potential Issues',
    },
    commentAnalyzer: {
        title: 'AI Comment Analyzer',
        description: 'Paste a batch of comments from a published video to understand audience sentiment, find common themes, and get ideas for future content.',
        placeholder: 'Paste comments here, one per line...',
        button: 'Analyze Comments',
        analyzing: 'Analyzing comments...',
        sentimentTitle: 'Overall Sentiment',
        themesTitle: 'Common Themes',
        ideasTitle: 'Future Video Ideas',
    }
  },
  calendar: {
    prevMonth: '<',
    nextMonth: '>',
    contentTools: 'Content Tools',
    generateIdeas: 'Generate Ideas',
    topicPlaceholder: "Enter a topic (e.g., 'vintage cameras')",
    platform: 'Platform',
    generateWithAI: 'Generate with AI',
    actions: 'Actions',
    export: 'Export to CSV',
    uploadEvents: 'Upload Events',
    statusKey: 'Status Key',
    weekdaysShort: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
  },
  eventModal: {
    addTitle: 'Add New Event',
    editTitle: 'Edit Event',
    titleLabel: 'Event Title',
    statusLabel: 'Status',
    platformLabel: 'Platform',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
  },
  taskModal: {
    editTitle: 'Edit Task',
    textLabel: 'Task',
    priorityLabel: 'Priority',
  },
  teleprompter: {
    exit: 'Exit Teleprompter',
    speed: 'Speed',
    fontSize: 'Font Size',
    mirror: 'Mirror Text (for rigs)',
  },
  help: {
    dashboardTitle: 'Dashboard Guide',
    ideaLabTitle: 'Idea Lab Guide',
    productionStudioTitle: 'Production Studio Guide',
    videoLabTitle: 'Video Lab Guide',
    analyticsHubTitle: 'Analytics Hub Guide',
    calendarTitle: 'Content Calendar Guide',
    close: 'Close help modal',
    dashboardContent: [
      {
        heading: 'Your Central Command Center',
        points: [
          "This is your main hub, designed to guide you from idea to analysis."
        ],
      },
      {
        heading: 'Workflow Guide',
        points: [
          "Follow the <b>4-step guide</b> (Ideate, Plan, Create, Analyze) to use the app's tools in a logical order.",
          "You can also <b>quick-add</b> a new idea directly from this guide to get started immediately."
        ],
      },
      {
        heading: 'My Tasks',
        points: [
          "A powerful to-do list to keep you organized. Add tasks with a priority, sort them, and mark them as complete.",
          "Click any task to <b>edit its details</b>, or use the trash icon to <b>delete</b> it."
        ]
      },
      {
        heading: 'Company Preset Manager',
        points: [
          "Select a preset to tailor all AI generation to a specific brand.",
          "You can <b>import</b>, <b>export</b>, or download a template to create your own brand presets."
        ]
      }
    ],
    ideaLabContent: [
      {
        heading: 'AI Idea Generation',
        points: [
          "Feeling stuck? Enter a topic or import a text file of your notes.",
          "The AI will generate a full strategic brief, including multiple video ideas, target audience analysis, and suggested formats."
        ]
      },
      {
        heading: 'Viral Clip Finder',
        points: [
          "Have a long video script? Upload it here. The AI will act as a viral content strategist and identify key moments that can be repurposed into high-potential short-form videos for TikTok, Shorts, or Reels."
        ]
      },
      {
        heading: 'Add to Calendar',
        points: [
          "For any idea or clip the AI generates, click the <b>Add to Calendar</b> button to instantly schedule it as a new 'Idea' in your Content Calendar."
        ]
      }
    ],
    productionStudioContent: [
      {
        heading: 'Step 1: Script',
        points: [
          "This is where you write and refine your script. Use the voice-to-text recorder and get AI feedback on transcription accuracy.",
          "Use the <b>Improve with AI</b> button for suggestions on pacing, clarity, and calls-to-action."
        ]
      },
      {
        heading: 'SEO Pro Mode',
        points: [
          "Activate this toggle before getting AI feedback to have the AI perform a complete rewrite of your script, optimizing it for maximum audience retention and viral potential."
        ]
      },
      {
        heading: 'Teleprompter',
        points: [
          "Once your script is ready, click the <b>Teleprompter</b> button to launch a full-screen, production-ready teleprompter with adjustable speed, font size, and mirroring for physical rigs."
        ]
      },
      {
        heading: 'Step 2: Optimize',
        points: [
          "After finalizing your script, the AI will generate multiple <b>SEO-friendly titles</b>, an <b>optimized video description</b>, and relevant <b>tags</b>.",
          "<b>AI Chapter Generator:</b> Save time by letting the AI automatically create YouTube video chapters from your script. A 'Copy for YouTube' button makes it easy to paste them into your video description."
        ]
      },
      {
        heading: 'Step 3: Thumbnails',
        points: [
          "Generate thumbnail concepts with AI based on your video title, or upload your own to <b>A/B test</b> them.",
          "Use the <b>AI Feedback</b> button to learn which thumbnail is more likely to get clicks.",
          "<b>Metadata Engine:</b> Upload your final thumbnail, and the AI will generate crucial metadata: SEO tags, alt-text, and a ready-to-use social media caption."
        ]
      }
    ],
    videoLabContent: [
      {
        heading: 'AI Video Generation',
        points: [
          "Create short videos from text prompts. Use a <b>Creative Preset</b> for a quick start, or write a detailed custom prompt and select a <b>Generation Mode</b> to influence the style.",
          "Use the <b>Get AI Suggestion</b> button to generate a unique prompt if you need inspiration."
        ]
      },
      {
        heading: 'AI Subtitle Generation',
        points: [
          "After your video is created, click the <b>Generate Subtitles</b> button. The AI will create a synchronized subtitle track (VTT file) based on your original prompt, making your video more accessible."
        ]
      },
      {
        heading: 'Important Warning',
        points: [
          "Video generation is a powerful and resource-intensive feature. It may take several minutes and consumes a significant amount of your API quota. <b>Use it thoughtfully.</b>"
        ]
      }
    ],
    analyticsHubContent: [
      {
        heading: 'Pre-Production Analysis',
        points: [
          "Paste in a script or detailed concept <b>before</b> you film. The AI will predict your target audience's demographics and interests, analyze the script's emotional triggers, and suggest questions to boost viewer engagement."
        ]
      },
      {
        heading: 'AI Comment Analyzer',
        points: [
          "After you've published a video, paste a batch of comments here. The AI will summarize the overall sentiment, identify common themes, and suggest concrete ideas for future videos based on real audience feedback."
        ]
      }
    ],
    calendarContent: [
      {
        heading: 'Visual Planning',
        points: [
          "This is your drag-and-drop content calendar. Click any day to add a new event, or click an existing event to edit its details.",
          "To reschedule, simply <b>click and drag</b> any event to move it to a different day."
        ]
      },
      {
        heading: 'AI Idea Integration',
        points: [
          "Use the <b>Generate Ideas</b> tool on the right sidebar to get AI-powered video ideas for a topic and add them directly to your calendar as 'Idea' events."
        ]
      },
      {
        heading: 'Data Management',
        points: [
          "Keep your calendar data portable. Use the <b>Export to CSV</b> button to download your schedule, or import events from a CSV file using the <b>Upload Events</b> button."
        ]
      }
    ]
  },
  footer: {
    quotes: [
      "Content is king, but engagement is queen, and the lady rules the house!",
      "The secret to getting ahead is getting started.",
      "Creativity is intelligence having fun.",
      "Don't find customers for your products, find products for your customers.",
      "The best marketing doesn't feel like marketing.",
      "You can't use up creativity. The more you use, the more you have.",
      "Done is better than perfect.",
      "Create something people want to share.",
      "Either write something worth reading or do something worth writing.",
      "The desire to create is one of the deepest yearnings of the human soul.",
      "An essential aspect of creativity is not being afraid to fail.",
      "Simplicity is the ultimate sophistication.",
      "Good content isn't about good storytelling. It's about telling a true story well.",
      "The best way to predict the future is to create it.",
      "Vulnerability is the birthplace of innovation, creativity and change.",
      "It's not where you take things from - it's where you take them to.",
      "The chief enemy of creativity is 'good' sense.",
      "Content is the reason search began in the first place.",
      "If you can't explain it simply, you don't understand it well enough.",
      "The currency of blogging is authenticity and trust.",
      "Creativity is a wild mind and a disciplined eye.",
      "Success is the sum of small efforts, repeated day in and day out.",
      "Consistency is one of the biggest factors in leading to accomplishment and success.",
      "Don't be afraid to get creative and experiment with your marketing."
    ]
  },
  // Enums and other dynamic text
  taskPriorities: {
    High: 'High',
    Medium: 'Medium',
    Low: 'Low',
  },
  contentStatuses: {
    Idea: 'Idea',
    Scripting: 'Scripting',
    Filming: 'Filming',
    Editing: 'Editing',
    Published: 'Published',
  }
};