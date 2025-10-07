export const vi = {
  header: {
    title: "Bộ công cụ Sáng tạo",
    dashboard: 'Bảng điều khiển',
    ideaLab: 'Phòng ý tưởng',
    productionStudio: 'Xưởng sản xuất',
    videoLab: 'Phòng Video',
    analyticsHub: 'Hub Phân tích',
    calendar: 'Lịch nội dung',
    help: 'Trợ giúp',
    language: 'Ngôn ngữ',
    english: 'Tiếng Anh',
    vietnamese: 'Tiếng Việt',
  },
  dashboard: {
    welcome: 'Chào mừng, Nhà sáng tạo!',
    commandCenter: 'Đây là trung tâm điều khiển để quản lý quy trình nội dung của bạn.',
    myTasks: 'Việc cần làm',
    unsort: 'Bỏ sắp xếp',
    sortByPriority: 'Sắp xếp theo độ ưu tiên',
    addTaskPlaceholder: 'Thêm một công việc mới...',
    lowPriority: 'Thấp',
    mediumPriority: 'Trung bình',
    highPriority: 'Cao',
    add: 'Thêm',
    noTasks: 'Chưa có công việc nào. Hãy thêm một công việc ở trên!',
    exportTasks: 'Xuất công việc',
    priority: 'Ưu tiên',
    deadline: 'Hạn chót',
    workflowGuide: {
      title: 'Quy trình làm việc của bạn',
      step1Title: '1. Lên ý tưởng',
      step1Description: 'Bắt đầu với một ý tưởng mới. Thêm ý tưởng tại đây hoặc sử dụng Phòng ý tưởng để được AI hỗ trợ.',
      step1Placeholder: 'Nhập một ý tưởng video mới...',
      step1Button: 'Đến Phòng ý tưởng',
      step2Title: '2. Lập kế hoạch',
      step2Description: 'Sắp xếp các ý tưởng của bạn và lên lịch nội dung trên lịch làm việc.',
      step2Button: 'Mở Lịch',
      step3Title: '3. Sáng tạo',
      step3Description: 'Viết kịch bản, tạo ảnh bìa và tạo các video clip cho dự án của bạn.',
      step3Button: 'Đến Xưởng sản xuất',
      step4Title: '4. Phân tích',
      step4Description: 'Nhận thông tin chi tiết từ AI về kịch bản của bạn để hiểu khán giả và mức độ tương tác.',
      step4Button: 'Đến Hub Phân tích',
    },
    presetManager: {
        title: 'Quản lý Preset Công ty',
        description: 'Chọn một preset công ty để tùy chỉnh tất cả các kết quả từ AI theo một thương hiệu cụ thể, hoặc nhập/xuất preset của riêng bạn.',
        activePreset: 'Preset đang hoạt động',
        brandLockActive: 'Đã khóa Thương hiệu',
        selectAriaLabel: 'Chọn Preset Công ty',
        importButton: 'Nhập Preset (.json)',
        exportButton: 'Xuất Preset đã chọn',
        downloadTemplateButton: 'Tải Mẫu',
        exportError: "Preset 'Không có' không thể xuất vì nó không chứa dữ liệu cụ thể.",
        importSuccess: 'Đã nhập thành công preset "{presetName}"!',
        importErrorMalformed: 'Không thể nhập preset. Tệp có thể bị lỗi. Vui lòng sử dụng mẫu làm hướng dẫn.',
        importErrorParse: 'Không thể phân tích tệp preset. Hãy chắc chắn rằng đó là tệp JSON hợp lệ.',
    },
  },
  ideaLab: {
    title: 'Phòng ý tưởng',
    description: 'Cảm thấy bí ý tưởng? Nhập một chủ đề, từ khóa, hoặc nhập tệp ý tưởng có sẵn, và để AI tạo ra các ý tưởng video sáng tạo, hồ sơ khán giả và định dạng phù hợp.',
    placeholder: "VD: 'sống bền vững', 'game cổ điển'",
    generateFromTopic: 'Tạo từ Chủ đề',
    importTitle: 'Hoặc Phân tích Ý tưởng từ Tệp',
    importLabel: 'Nhập tệp .txt hoặc .md',
    generateInsights: 'Phân tích & Tạo ý tưởng',
    generating: 'Đang tạo ý tưởng sáng tạo...',
    generatedIdeas: 'Ý tưởng đã tạo',
    addToCalendar: 'Thêm vào Lịch',
    targetAudience: 'Đối tượng mục tiêu',
    suggestedFormats: 'Định dạng đề xuất',
    engagementHook: 'Câu Mở Đầu Thu Hút',
    keywords: 'Từ Khóa',
    monetizationStrategy: 'Chiến Lược Kiếm Tiền',
    visualConcepts: 'Ý tưởng Hình ảnh',
    sfxSuggestions: 'Ý tưởng SFX & Hoạt ảnh',
    exportReport: 'Xuất báo cáo',
    viralClipFinder: {
      title: 'Công cụ tìm Clip Viral',
      description: "Tải lên kịch bản video dài (.txt, .md). AI sẽ xác định 3-5 khoảnh khắc có tiềm năng cao nhất để trở thành video ngắn viral trên các nền tảng như TikTok, YouTube Shorts và Reels.",
      importLabel: 'Nhập kịch bản video dài',
      findClips: 'Tìm khoảnh khắc Viral',
      finding: 'Đang phân tích kịch bản để tìm khoảnh khắc viral...',
      resultsTitle: 'Các Clip Viral tiềm năng',
      overallSummary: 'Tóm tắt từ AI',
      clipScript: 'Kịch bản Clip',
      copyScript: 'Sao chép kịch bản',
      viralityReason: 'Lý do có thể viral',
      hashtags: 'Hashtag đề xuất',
      visualIdeas: 'Ý tưởng Hình ảnh',
      sfxAndAnimations: 'SFX & Hoạt ảnh',
      addToCalendarShorts: 'Thêm làm Short',
    }
  },
  productionStudio: {
    title: 'Xưởng sản xuất',
    description: 'Thực hiện theo các bước để biến ý tưởng của bạn từ kịch bản thành các tài sản sẵn sàng xuất bản.',
    contentFormat: 'Định dạng Nội dung',
    longForm: 'Dạng dài (16:9)',
    shortForm: 'Dạng ngắn (9:16)',
    tabScript: 'Kịch bản',
    tabOptimize: 'Tối ưu hóa',
    tabThumbnails: 'Ảnh bìa',
    // Script Editor
    scriptEditor: 'Trình soạn thảo kịch bản',
    scriptPlaceholder: 'Dán kịch bản video của bạn vào đây, hoặc sử dụng tính năng chuyển giọng nói thành văn bản...',
    transcriptionFeedback: 'Phản hồi độ chính xác phiên âm',
    analyzingTranscription: 'Đang phân tích lỗi phiên âm...',
    aiScriptAnalysis: 'AI phân tích kịch bản',
    analyzingScript: 'Đang phân tích kịch bản về nhịp độ và sự rõ ràng...',
    analysisAndPacing: 'Phân tích & Nhịp độ',
    readingTime: 'Thời gian đọc ước tính',
    words: 'từ',
    readingSpeed: 'Tốc độ đọc',
    wpm: 'từ/phút',
    voiceToText: 'Chuyển giọng nói thành văn bản',
    english: 'Tiếng Anh (Mỹ)',
    vietnamese: 'Tiếng Việt',
    stopRecording: 'Dừng ghi âm',
    recordScript: 'Ghi âm kịch bản',
    improveScript: 'Cải thiện kịch bản với AI',
    teleprompter: 'Máy nhắc chữ',
    sidebarTitle: 'Bác sĩ Kịch bản AI',
    overallFeedback: 'Phản hồi Tổng thể',
    rephrasingSuggestions: 'Gợi ý Diễn đạt lại',
    ctaSuggestions: 'Ý tưởng Kêu gọi Hành động',
    seoMode: 'Bật Chế độ SEO Pro',
    seoModeDescription: 'Khi được bật, AI sẽ viết lại toàn bộ kịch bản của bạn để tối đa hóa tương tác và khả năng được khám phá.',
    rewrittenScriptTitle: 'Kịch bản do AI viết lại (SEO Pro)',
    useThisVersion: 'Sử dụng phiên bản này',
    exportScript: 'Xuất kịch bản',
    // Optimizer
    optimizerPrompt: 'Vui lòng viết kịch bản trong tab "Kịch bản" trước.',
    metadataGeneration: 'Tạo Metadata',
    generateMetadata: 'Tạo Metadata',
    optimizing: 'Đang tối ưu hóa...',
    suggestedTitles: 'Tiêu đề đề xuất',
    copy: 'Sao chép',
    videoDescription: 'Mô tả video',
    tags: 'Thẻ (Tags)',
    optimizedContentPlaceholder: 'Nội dung được tối ưu hóa của bạn sẽ xuất hiện ở đây sau khi tạo.',
    chapterGeneratorTitle: 'AI Tạo Chương Video',
    chapterGeneratorDescription: 'Để AI phân tích kịch bản của bạn để tự động tạo các chương cho video YouTube, cải thiện trải nghiệm người xem và SEO.',
    generateChapters: 'Tạo Chương',
    generatingChapters: 'Đang tạo chương...',
    copyForYouTube: 'Sao chép cho YouTube',
    exportMetadata: 'Xuất Metadata',
    // Thumbnail Studio
    generateFromScriptTitle: 'Tạo Ảnh bìa từ Kịch bản',
    generateFromScriptDescription: 'Để AI tạo một ảnh bìa duy nhất, được tối ưu hóa dựa trên toàn bộ nội dung kịch bản của bạn theo định dạng đã chọn.',
    generateFromScriptButton: 'Tạo Ảnh bìa',
    generatingFromScript: 'Đang tạo từ kịch bản... việc này có thể mất một chút thời gian.',
    generatedThumbnailTitle: 'Ảnh bìa đã tạo',
    abTest: 'Kiểm tra A/B Ảnh bìa',
    abTestDescription: 'Tải lên ảnh bìa của bạn hoặc sử dụng các mẫu được tạo dưới đây để so sánh chúng.',
    thumbA: 'Ảnh bìa A',
    thumbB: 'Ảnh bìa B',
    uploadFile: 'Tải lên tệp',
    dragDrop: 'hoặc kéo và thả',
    pngJpg: 'PNG, JPG',
    noImage: 'Không có ảnh',
    generateConcepts: 'Tạo mẫu từ Tiêu đề',
    titlePlaceholder: 'Nhập tiêu đề video...',
    generate: 'Tạo Mẫu',
    generating: 'Đang tạo...',
    useA: 'Dùng cho A',
    useB: 'Dùng cho B',
    aiFeedback: 'Phản hồi từ AI',
    analyzeThumbs: 'Phân tích ảnh bìa',
    analyzing: 'Đang phân tích...',
    feedbackPlaceholder: 'Tải lên hai ảnh bìa và nhấp vào nút để nhận phản hồi từ AI.',
    exportFeedback: 'Xuất phản hồi',
    metadataEngineTitle: 'Công cụ Metadata cho Ảnh bìa',
    metadataEngineDescription: 'Tải lên một hình ảnh, và AI sẽ phân tích nó cùng với kịch bản và tiêu đề của bạn để tạo ra các thẻ SEO, văn bản thay thế (alt-text) và chú thích cho mạng xã hội.',
    uploadForMetadata: 'Tải ảnh bìa để phân tích',
    generateMetadataButton: 'Tạo Metadata',
    seoTags: 'Thẻ SEO',
    altText: 'Văn bản thay thế (Alt-Text)',
    socialCaption: 'Chú thích Mạng xã hội',
    exportMetadataReport: 'Xuất báo cáo',
  },
  videoLab: {
    title: 'Phòng Video',
    description: 'Tạo các video clip ngắn, hấp dẫn từ một đoạn mô tả văn bản. Lý tưởng cho các teaser trên mạng xã hội, video giới thiệu hoặc các concept hoạt hình.',
    warningTitle: 'Lưu ý Quan trọng về Việc Tạo Video',
    warningContent: "Tạo video là một quá trình nâng cao, tốn nhiều tài nguyên và có thể mất vài phút để hoàn thành. Vui lòng kiên nhẫn. Mỗi lần tạo sẽ tiêu tốn một lượng đáng kể hạn ngạch API của bạn. Hãy sử dụng tính năng này một cách khôn ngoan.",
    promptLabel: 'Mô tả Video',
    modeLabel: 'Chế độ Tạo',
    presetLabel: 'Mẫu Sáng tạo',
    generateButton: 'Tạo Video',
    downloadButton: 'Tải Video',
    downloadSubtitlesButton: 'Tải phụ đề',
    generateSubtitlesButton: 'Tạo Phụ đề',
    generatingTitle: 'Video của bạn đang được tạo...',
    errorTitle: 'Đã xảy ra lỗi',
    tryAgain: 'Vui lòng thử lại.',
    playbackSpeed: 'Tốc độ',
    loop: 'Lặp lại',
    promptSuggestionsTitle: 'Cần cảm hứng? Hãy thử một trong những gợi ý sau:',
    getAISuggestionButton: 'Nhận gợi ý từ AI',
    promptSuggestions: [
      'Cảnh quay từ drone bay qua một dãy núi thanh bình lúc bình minh',
      'Một chuỗi hoạt hình về một con robot học vẽ',
      'Cảnh quay điện ảnh cận cảnh một giọt sương trên mạng nhện',
      'Video tua nhanh thời gian một bông hoa đang nở với màu sắc rực rỡ',
      'Một quả táo biến hình mượt mà thành một con bướm',
    ],
    presets: {
      none: 'Không (Tùy chỉnh)',
      trailer: 'Trailer Phim Sử thi',
      explainer: 'Hoạt hình Giải thích Dễ thương',
      product: 'Trình diễn Sản phẩm Tinh tế',
      dreamscape: 'Cảnh mộng Siêu thực',
      food: 'Quảng cáo Món ăn Hấp dẫn',
      noir_film: 'Phim Noir',
      documentary: 'Phim tài liệu Thiên nhiên',
      vaporwave: 'Thẩm mỹ Vaporwave',
      pixel_art: 'Nghệ thuật Pixel',
    },
    presetPrompts: {
        trailer: 'Một cảnh quay kiểu trailer phim điện ảnh, kịch tính của [CHỦ THỂ CỦA BẠN], với ánh sáng mạnh và chuyển động chậm.',
        explainer: 'Một hoạt hình 2D đơn giản và thân thiện của [CHỦ THỂ CỦA BẠN] giải thích một khái niệm, với đường nét sạch sẽ và màu sắc tươi sáng.',
        product: 'Đồ họa chuyển động tinh tế giới thiệu [SẢN PHẨM CỦA BẠN], với các lớp văn bản động và nền sạch.',
        dreamscape: 'Một chuỗi cảnh siêu thực, giống như giấc mơ của [CHỦ THỂ CỦA BẠN], với các vật thể trôi nổi và màu sắc rực rỡ, thay đổi liên tục.',
        food: 'Một cảnh quay cận cảnh, chuyển động chậm, hấp dẫn của [MÓN ĂN CỦA BẠN], với hơi nước bốc lên và ánh sáng thương mại hoàn hảo.',
        noir_film: 'Một cảnh quay kiểu phim noir đen trắng, tương phản cao của [CHỦ THỂ CỦA BẠN], với bóng tối đầy kịch tính và không khí bí ẩn.',
        documentary: 'Một cảnh quay tài liệu thiên nhiên tuyệt đẹp kiểu David Attenborough về [CHỦ THỂ CỦA BẠN] trong môi trường sống tự nhiên của nó.',
        vaporwave: 'Một hoạt hình thẩm mỹ vaporwave của [CHỦ THỂ CỦA BẠN], với lưới neon, màu pastel, và đồ họa máy tính retro thập niên 80.',
        pixel_art: 'Một hoạt hình nghệ thuật pixel retro của [CHỦ THỂ CỦA BẠN], giống như một cảnh trong trò chơi video 16-bit.',
    },
    modes: {
      cinematic: 'Điện ảnh',
      animation: 'Hoạt hình',
      motion_graphics: 'Đồ họa chuyển động',
      morph: 'Biến hình đối tượng',
      timelapse: 'Tua nhanh thời gian (Time-lapse)',
      hyperlapse: 'Tua nhanh chuyển động (Hyperlapse)',
      drone_shot: 'Cảnh quay từ Drone',
      vintage_film: 'Phim cổ điển',
    },
    promptHelpers: {
      cinematic: 'VD: Một cảnh quay điện ảnh về một phi hành gia cô đơn trên hành tinh đỏ.',
      animation: 'VD: Một phim hoạt hình 2D kỳ ảo về một chú mèo làm DJ trong một bữa tiệc.',
      motion_graphics: 'VD: Một chuỗi đồ họa chuyển động thanh lịch cho việc tiết lộ logo của một công ty công nghệ.',
      morph: 'VD: Một quả táo biến hình mượt mà thành một con bướm.',
      timelapse: 'VD: Cảnh tua nhanh thời gian của một con phố thành phố nhộn nhịp từ ngày sang đêm.',
      hyperlapse: 'VD: Một video hyperlapse di chuyển qua một thành phố tương lai vào ban đêm.',
      drone_shot: 'VD: Cảnh quay từ trên không bằng drone bay qua một khu rừng nhiệt đới tươi tốt.',
      vintage_film: 'VD: Một video trông như phim 8mm cổ về một buổi dã ngoại gia đình những năm 1970.',
    },
    loadingMessages: [
      "Đang khởi động đạo diễn kỹ thuật số...",
      "Đang vẽ kịch bản phân cảnh cho ý tưởng của bạn...",
      "Đang tập hợp đoàn làm phim kỹ thuật số...",
      "Đang kết xuất các khung hình đầu tiên...",
      "Đang áp dụng hiệu ứng hình ảnh...",
      "Đang ghép các cảnh cuối cùng...",
      "Quá trình này mất nhiều thời gian hơn bình thường, nhưng nghệ thuật cần thời gian!",
      "Đang hoàn tất đồng bộ hóa âm thanh-hình ảnh...",
      "Đang hoàn thiện bản dựng cuối cùng...",
      "Sắp xong rồi, chỉ cần đóng gói lại cho bạn thôi!"
    ],
  },
  analyticsHub: {
    title: 'Hub Phân tích',
    description: "Nhận dự đoán từ AI cho kịch bản của bạn. Hiểu khán giả và đảm bảo an toàn thương hiệu trước khi quay phim.",
    inputLabel: 'Kịch bản Video hoặc Ý tưởng Chi tiết',
    placeholder: 'Dán kịch bản video hoàn chỉnh hoặc mô tả chi tiết về ý tưởng video của bạn vào đây...',
    placeholderAuto: 'Kịch bản từ Xưởng Sản xuất được tải tự động. Chuyển sang Chế độ Thủ công để chỉnh sửa.',
    analyzing: 'Đang phân tích...',
    exportReport: 'Xuất báo cáo',
    initialPrompt: 'Nhập kịch bản của bạn ở trên và chọn một phân tích để bắt đầu.',
    audienceAnalyzer: {
        title: 'Phân tích Khán giả & Tương tác',
        description: 'Dự đoán đối tượng mục tiêu, phân tích các yếu tố kích hoạt cảm xúc của kịch bản và nhận đề xuất để tăng cường tương tác của người xem.',
        button: 'Phân tích Khán giả',
    },
    demographicsTitle: 'Nhân khẩu học Khán giả Dự đoán',
    ageRange: 'Độ tuổi',
    interests: 'Sở thích Chính',
    engagementTitle: 'Phân tích Tương tác',
    sentiment: 'Cảm xúc Dự đoán',
    triggers: 'Yếu tố Kích hoạt Cảm xúc',
    questionsTitle: 'Câu hỏi Tăng cường Tương tác',
    automatedRepliesTitle: 'Phản hồi Bình luận Tự động',
    brandSafetyAnalyzer: {
        title: 'Phân tích An toàn Thương hiệu & Giọng điệu',
        description: 'Quét kịch bản của bạn để tìm các chủ đề nhạy cảm, ngôn ngữ mạnh và giọng điệu tổng thể để đảm bảo nội dung của bạn thân thiện với nhà quảng cáo.',
        button: 'Phân tích An toàn Thương hiệu',
        analyzing: 'Đang phân tích an toàn thương hiệu...',
        initialPrompt: 'Nhập kịch bản của bạn để phân tích an toàn thương hiệu và giọng điệu.',
        overallTone: 'Giọng điệu Tổng thể',
        safetySummary: 'Tóm tắt An toàn Thương hiệu',
        potentialIssues: 'Các vấn đề tiềm ẩn',
    },
    commentAnalyzer: {
        title: 'AI Phân tích Bình luận',
        description: 'Dán một loạt bình luận từ video đã đăng để hiểu cảm xúc của khán giả, tìm các chủ đề chung và nhận ý tưởng cho nội dung tương lai.',
        placeholder: 'Dán các bình luận vào đây, mỗi bình luận một dòng...',
        button: 'Phân tích Bình luận',
        analyzing: 'Đang phân tích bình luận...',
        sentimentTitle: 'Cảm xúc Tổng thể',
        themesTitle: 'Chủ đề Chung',
        ideasTitle: 'Ý tưởng Video Tương lai',
    }
  },
  calendar: {
    prevMonth: '<',
    nextMonth: '>',
    contentTools: 'Công cụ nội dung',
    generateIdeas: 'Tạo ý tưởng',
    topicPlaceholder: "Nhập chủ đề (VD: 'máy ảnh cổ')",
    platform: 'Nền tảng',
    generateWithAI: 'Tạo bằng AI',
    actions: 'Hành động',
    export: 'Xuất ra CSV',
    uploadEvents: 'Tải lên Sự kiện',
    statusKey: 'Chú thích trạng thái',
    weekdaysShort: 'CN,T2,T3,T4,T5,T6,T7',
  },
  eventModal: {
    addTitle: 'Thêm sự kiện mới',
    editTitle: 'Chỉnh sửa sự kiện',
    titleLabel: 'Tiêu đề sự kiện',
    statusLabel: 'Trạng thái',
    platformLabel: 'Nền tảng',
    save: 'Lưu',
    delete: 'Xóa',
    cancel: 'Hủy',
  },
  taskModal: {
    editTitle: 'Chỉnh sửa Công việc',
    textLabel: 'Công việc',
    priorityLabel: 'Độ ưu tiên',
  },
   teleprompter: {
    exit: 'Thoát Máy nhắc chữ',
    speed: 'Tốc độ',
    fontSize: 'Cỡ chữ',
    mirror: 'Lật chữ (cho máy chuyên dụng)',
  },
  help: {
    dashboardTitle: 'Hướng dẫn Bảng điều khiển',
    ideaLabTitle: 'Hướng dẫn Phòng ý tưởng',
    productionStudioTitle: 'Hướng dẫn Xưởng sản xuất',
    videoLabTitle: 'Hướng dẫn Phòng Video',
    analyticsHubTitle: 'Hướng dẫn Hub Phân tích',
    calendarTitle: 'Hướng dẫn Lịch nội dung',
    close: 'Đóng cửa sổ trợ giúp',
    dashboardContent: [
        {
            heading: 'Trung tâm Điều khiển của bạn',
            points: [
                "Đây là trung tâm chính của bạn, được thiết kế để hướng dẫn bạn từ ý tưởng đến phân tích."
            ],
        },
        {
            heading: 'Hướng dẫn Quy trình làm việc',
            points: [
                "Làm theo <b>hướng dẫn 4 bước</b> (Lên ý tưởng, Lập kế hoạch, Sáng tạo, Phân tích) để sử dụng các công cụ của ứng dụng một cách hợp lý.",
                "Bạn cũng có thể <b>thêm nhanh</b> một ý tưởng mới trực tiếp từ hướng dẫn này để bắt đầu ngay lập tức."
            ],
        },
        {
            heading: 'Việc cần làm',
            points: [
                "Một danh sách công việc mạnh mẽ để giúp bạn có tổ chức. Thêm công việc với độ ưu tiên, sắp xếp chúng và đánh dấu hoàn thành.",
                "Nhấp vào bất kỳ công việc nào để <b>chỉnh sửa chi tiết</b>, hoặc sử dụng biểu tượng thùng rác để <b>xóa</b> nó."
            ]
        },
        {
            heading: 'Quản lý Preset Công ty',
            points: [
                "Chọn một preset để tùy chỉnh tất cả các sản phẩm AI theo một thương hiệu cụ thể.",
                "Bạn có thể <b>nhập</b>, <b>xuất</b>, hoặc tải xuống một mẫu để tạo preset thương hiệu của riêng bạn."
            ]
        }
    ],
    ideaLabContent: [
        {
            heading: 'Tạo ý tưởng bằng AI',
            points: [
                "Cảm thấy bí ý tưởng? Nhập một chủ đề hoặc nhập một tệp văn bản chứa ghi chú của bạn.",
                "AI sẽ tạo một bản tóm tắt chiến lược đầy đủ, bao gồm nhiều ý tưởng video, phân tích đối tượng mục tiêu và các định dạng đề xuất."
            ]
        },
        {
            heading: 'Công cụ tìm Clip Viral',
            points: [
                "Có kịch bản video dài? Tải nó lên đây. AI sẽ đóng vai trò như một chiến lược gia nội dung lan truyền và xác định các khoảnh khắc quan trọng có thể được tái sử dụng thành các video dạng ngắn có tiềm năng cao cho TikTok, Shorts, hoặc Reels."
            ]
        },
        {
            heading: 'Thêm vào Lịch',
            points: [
                "Đối với bất kỳ ý tưởng hoặc clip nào do AI tạo ra, hãy nhấp vào nút <b>Thêm vào Lịch</b> để lên lịch ngay lập tức như một 'Ý tưởng' mới trong Lịch nội dung của bạn."
            ]
        }
    ],
    productionStudioContent: [
        {
            heading: 'Bước 1: Kịch bản',
            points: [
                "Đây là nơi bạn viết và tinh chỉnh kịch bản của mình. Sử dụng trình ghi âm giọng nói thành văn bản và nhận phản hồi từ AI về độ chính xác của phiên âm.",
                "Sử dụng nút <b>Cải thiện với AI</b> để nhận các đề xuất về nhịp độ, sự rõ ràng và lời kêu gọi hành động."
            ]
        },
        {
            heading: 'Chế độ SEO Pro',
            points: [
                "Kích hoạt công tắc này trước khi nhận phản hồi từ AI để AI thực hiện viết lại hoàn toàn kịch bản của bạn, tối ưu hóa nó để giữ chân khán giả tối đa và có tiềm năng lan truyền."
            ]
        },
        {
            heading: 'Máy nhắc chữ',
            points: [
                "Khi kịch bản của bạn đã sẵn sàng, hãy nhấp vào nút <b>Máy nhắc chữ</b> để khởi chạy một máy nhắc chữ toàn màn hình, sẵn sàng cho sản xuất với tốc độ, kích thước phông chữ và tính năng lật chữ có thể điều chỉnh cho các giàn máy vật lý."
            ]
        },
        {
            heading: 'Bước 2: Tối ưu hóa',
            points: [
                "Sau khi hoàn thiện kịch bản của bạn, AI sẽ tạo ra nhiều <b>tiêu đề thân thiện với SEO</b>, một <b>mô tả video được tối ưu hóa</b>, và các <b>thẻ (tag)</b> liên quan.",
                "<b>AI Tạo Chương Video:</b> Tiết kiệm thời gian bằng cách để AI tự động tạo các chương video YouTube từ kịch bản của bạn. Nút 'Sao chép cho YouTube' giúp bạn dễ dàng dán chúng vào mô tả video của mình."
            ]
        },
        {
            heading: 'Bước 3: Ảnh bìa',
            points: [
                "Tạo các ý tưởng ảnh bìa với AI dựa trên tiêu đề video của bạn, hoặc tải lên ảnh của riêng bạn để <b>kiểm tra A/B</b>.",
                "Sử dụng nút <b>Phản hồi từ AI</b> để biết ảnh bìa nào có khả năng nhận được nhiều nhấp chuột hơn.",
                "<b>Công cụ Metadata:</b> Tải lên ảnh bìa cuối cùng của bạn, và AI sẽ tạo ra các siêu dữ liệu quan trọng: thẻ SEO, văn bản thay thế (alt-text), và chú thích sẵn sàng sử dụng cho mạng xã hội."
            ]
        }
    ],
    videoLabContent: [
        {
            heading: 'Tạo video bằng AI',
            points: [
                "Tạo các video ngắn từ các mô tả văn bản. Sử dụng một <b>Mẫu Sáng tạo</b> để bắt đầu nhanh, hoặc viết một mô tả tùy chỉnh chi tiết và chọn <b>Chế độ Tạo</b> để ảnh hưởng đến phong cách.",
                "Sử dụng nút <b>Nhận gợi ý từ AI</b> để tạo một mô tả độc đáo nếu bạn cần cảm hứng."
            ]
        },
        {
            heading: 'Tạo Phụ đề bằng AI',
            points: [
                "Sau khi video của bạn được tạo, hãy nhấp vào nút <b>Tạo Phụ đề</b>. AI sẽ tạo một tệp phụ đề được đồng bộ hóa (tệp VTT) dựa trên mô tả ban đầu của bạn, giúp video của bạn dễ tiếp cận hơn."
            ]
        },
        {
            heading: 'Cảnh báo Quan trọng',
            points: [
                "Tạo video là một tính năng mạnh mẽ và tốn nhiều tài nguyên. Quá trình này có thể mất vài phút và tiêu tốn một lượng đáng kể hạn ngạch API của bạn. <b>Hãy sử dụng nó một cách cân nhắc.</b>"
            ]
        }
    ],
    analyticsHubContent: [
        {
            heading: 'Phân tích Tiền sản xuất',
            points: [
                "Dán kịch bản hoặc ý tưởng chi tiết <b>trước khi</b> bạn quay phim. AI sẽ dự đoán nhân khẩu học và sở thích của đối tượng mục tiêu, phân tích các yếu tố kích hoạt cảm xúc của kịch bản và đề xuất các câu hỏi để tăng cường tương tác của người xem."
            ]
        },
        {
            heading: 'AI Phân tích Bình luận',
            points: [
                "Sau khi bạn đã xuất bản video, dán một loạt bình luận vào đây. AI sẽ tóm tắt cảm xúc chung, xác định các chủ đề phổ biến và đề xuất các ý tưởng cụ thể cho các video trong tương lai dựa trên phản hồi thực tế của khán giả."
            ]
        }
    ],
    calendarContent: [
        {
            heading: 'Lập kế hoạch Trực quan',
            points: [
                "Đây là lịch nội dung kéo và thả của bạn. Nhấp vào bất kỳ ngày nào để thêm sự kiện mới, hoặc nhấp vào một sự kiện hiện có để chỉnh sửa chi tiết.",
                "Để lên lịch lại, chỉ cần <b>nhấp và kéo</b> bất kỳ sự kiện nào để di chuyển nó sang một ngày khác."
            ]
        },
        {
            heading: 'Tích hợp Ý tưởng AI',
            points: [
                "Sử dụng công cụ <b>Tạo ý tưởng</b> ở thanh bên phải để nhận các ý tưởng video do AI cung cấp cho một chủ đề và thêm chúng trực tiếp vào lịch của bạn dưới dạng sự kiện 'Ý tưởng'."
            ]
        },
        {
            heading: 'Quản lý Dữ liệu',
            points: [
                "Giữ cho dữ liệu lịch của bạn có thể di động. Sử dụng nút <b>Xuất ra CSV</b> để tải xuống lịch trình của bạn, hoặc nhập sự kiện từ tệp CSV bằng nút <b>Tải lên Sự kiện</b>."
            ]
        }
    ]
  },
  footer: {
    quotes: [
      "Nội dung là vua, nhưng tương tác là hoàng hậu, và người phụ nữ ấy cai quản ngôi nhà!",
      "Bí quyết để tiến về phía trước là hãy bắt đầu.",
      "Sáng tạo là trí thông minh đang vui đùa.",
      "Đừng tìm khách hàng cho sản phẩm của bạn, hãy tìm sản phẩm cho khách hàng của bạn.",
      "Marketing tốt nhất không có cảm giác như marketing.",
      "Bạn không thể dùng cạn sự sáng tạo. Càng dùng nhiều, bạn càng có nhiều.",
      "Hoàn thành tốt hơn hoàn hảo.",
      "Hãy tạo ra thứ mà mọi người muốn chia sẻ.",
      "Hoặc viết điều gì đó đáng đọc, hoặc làm điều gì đó đáng viết.",
      "Khát khao sáng tạo là một trong những khao khát sâu sắc nhất của tâm hồn con người.",
      "Một khía cạnh thiết yếu của sự sáng tạo là không sợ thất bại.",
      "Sự đơn giản là sự tinh tế tột cùng.",
      "Nội dung hay không phải là kể chuyện hay. Đó là kể một câu chuyện có thật một cách hay.",
      "Cách tốt nhất để dự đoán tương lai là tạo ra nó.",
      "Sự tổn thương là nơi khai sinh của sự đổi mới, sáng tạo và thay đổi.",
      "Vấn đề không phải là bạn lấy mọi thứ từ đâu - mà là bạn đưa chúng đến đâu.",
      "Kẻ thù chính của sự sáng tạo là 'lẽ thường'.",
      "Nội dung là lý do tìm kiếm bắt đầu ngay từ đầu.",
      "Nếu bạn không thể giải thích nó một cách đơn giản, bạn chưa hiểu nó đủ rõ.",
      "Tiền tệ của việc viết blog là sự chân thực và tin tưởng.",
      "Sáng tạo là một trí óc hoang dã và một con mắt kỷ luật.",
      "Thành công là tổng hợp của những nỗ lực nhỏ, được lặp đi lặp lại ngày này qua ngày khác.",
      "Sự kiên trì là một trong những yếu tố lớn nhất dẫn đến thành tựu và thành công.",
      "Đừng ngại sáng tạo và thử nghiệm với hoạt động marketing của bạn."
    ]
  },
  // Enums and other dynamic text
  taskPriorities: {
    High: 'Cao',
    Medium: 'Trung bình',
    Low: 'Thấp',
  },
  contentStatuses: {
    Idea: 'Ý tưởng',
    Scripting: 'Viết kịch bản',
    Filming: 'Quay phim',
    Editing: 'Chỉnh sửa',
    Published: 'Đã đăng',
  }
};
