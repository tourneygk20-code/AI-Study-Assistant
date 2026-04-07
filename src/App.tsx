/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Scissors,
  Copy, 
  Download, 
  FileText, 
  GraduationCap, 
  HelpCircle, 
  Lightbulb, 
  Loader2, 
  RefreshCcw, 
  RotateCcw, 
  Sparkles, 
  Trophy,
  AlertCircle,
  Upload,
  Languages,
  FileUp,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Translations ---
type Language = "en" | "vi";

const translations = {
  en: {
    appName: "AI Learning Assistant",
    heroTitle: "Master any topic",
    heroSubtitle: "in minutes.",
    heroDesc: "Paste your lecture notes, transcripts, or articles. We'll transform them into structured study materials, flashcards, and quizzes.",
    labelLessonTitle: "Lesson Title",
    placeholderLessonTitle: "e.g., Introduction to Quantum Mechanics",
    labelContent: "Content / Transcript",
    placeholderContent: "Paste your content here or upload a file...",
    btnUpload: "Upload File (.txt, .srt, .mp3, .wav, .mp4)",
    btnGenerate: "Generate Study Material",
    btnGenerating: "Analyzing Content (this may take a moment for media)...",
    errorEmpty: "Please provide a title and some content (text, audio, or video).",
    errorFileSize: "File is too large. Please upload a file smaller than 15MB.",
    errorFailed: "Failed to generate learning material. The file might be too large or complex. Please try a shorter clip or text.",
    badgeGenerated: "Generated Material",
    titleSections: "Key Sections",
    titleConcepts: "Core Concepts",
    titleNotes: "Study Notes",
    titleFlashcards: "Flashcards",
    titleQuiz: "Knowledge Check",
    titleStrategy: "Review Strategy",
    quizStep: "Question {current} of {total}",
    quizResult: "Quiz Complete!",
    quizScore: "You scored {score} out of {total}",
    btnTryAgain: "Try Again",
    btnNext: "Next Question",
    btnFinish: "Finish Quiz",
    btnExport: "Export PDF",
    btnCopy: "Copy JSON",
    btnNew: "Start New Lesson",
    btnHistory: "History",
    labelTopic: "Topic / Subject",
    placeholderTopic: "e.g., Physics, History, Programming...",
    btnCreateTopic: "Create New Topic",
    btnSelectTopic: "Select Topic",
    noTopicSelected: "Please select or create a topic first.",
    historyEmpty: "No history yet. Create a topic and generate your first lesson!",
    topicTitle: "Topic: {name}",
    lessonCount: "{count} lessons",
    footerDesc: "Powered by Gemini AI. Designed for long-term retention.",
    importanceHigh: "high",
    importanceMedium: "medium",
    importanceLow: "low",
    clickToFlip: "Click to flip",
    exampleLabel: "Example",
    personalizedStrategy: "Personalized for this content",
    labelParts: "Content Parts",
    partIndicator: "Part {current} of {total}",
    btnSplit: "Split Large File",
    splitSuccess: "File split into {count} parts. You can process them one by one."
  },
  vi: {
    appName: "Trợ lý Học tập AI",
    heroTitle: "Làm chủ mọi chủ đề",
    heroSubtitle: "trong vài phút.",
    heroDesc: "Dán ghi chú bài giảng, bản ghi âm hoặc bài báo. Chúng tôi sẽ chuyển đổi chúng thành tài liệu học tập có cấu trúc, thẻ ghi nhớ và câu đố.",
    labelLessonTitle: "Tiêu đề bài học",
    placeholderLessonTitle: "VD: Nhập môn Cơ học Lượng tử",
    labelContent: "Nội dung / Bản ghi",
    placeholderContent: "Dán nội dung vào đây hoặc tải lên tệp...",
    btnUpload: "Tải tệp lên (.txt, .srt, .mp3, .wav, .mp4)",
    btnGenerate: "Tạo tài liệu học tập",
    btnGenerating: "Đang phân tích nội dung (có thể mất chút thời gian cho đa phương tiện)...",
    errorEmpty: "Vui lòng cung cấp tiêu đề và nội dung (văn bản, âm thanh hoặc video).",
    errorFileSize: "Tệp quá lớn. Vui lòng tải lên tệp nhỏ hơn 15MB.",
    errorFailed: "Không thể tạo tài liệu học tập. Tệp có thể quá lớn hoặc phức tạp. Vui lòng thử một đoạn ngắn hơn hoặc văn bản.",
    badgeGenerated: "Tài liệu đã tạo",
    titleSections: "Các phần chính",
    titleConcepts: "Khái niệm cốt lõi",
    titleNotes: "Ghi chú học tập",
    titleFlashcards: "Thẻ ghi nhớ (Flashcards)",
    titleQuiz: "Kiểm tra kiến thức",
    titleStrategy: "Chiến lược ôn tập",
    quizStep: "Câu hỏi {current} trên {total}",
    quizResult: "Hoàn thành bài kiểm tra!",
    quizScore: "Bạn đạt {score} trên {total} điểm",
    btnTryAgain: "Thử lại",
    btnNext: "Câu tiếp theo",
    btnFinish: "Kết thúc",
    btnExport: "Xuất PDF",
    btnCopy: "Sao chép JSON",
    btnNew: "Bắt đầu bài học mới",
    btnHistory: "Lịch sử",
    labelTopic: "Chủ đề / Môn học",
    placeholderTopic: "VD: Vật lý, Lịch sử, Lập trình...",
    btnCreateTopic: "Tạo chủ đề mới",
    btnSelectTopic: "Chọn chủ đề",
    noTopicSelected: "Vui lòng chọn hoặc tạo chủ đề trước.",
    historyEmpty: "Chưa có lịch sử. Hãy tạo chủ đề và bài học đầu tiên của bạn!",
    topicTitle: "Chủ đề: {name}",
    lessonCount: "{count} bài học",
    footerDesc: "Được hỗ trợ bởi Gemini AI. Thiết kế để ghi nhớ lâu dài.",
    importanceHigh: "cao",
    importanceMedium: "trung bình",
    importanceLow: "thấp",
    clickToFlip: "Nhấn để lật",
    exampleLabel: "Ví dụ",
    personalizedStrategy: "Được cá nhân hóa cho nội dung này",
    labelParts: "Các phần nội dung",
    partIndicator: "Phần {current} trên {total}",
    btnSplit: "Cắt tệp lớn",
    splitSuccess: "Tệp đã được cắt thành {count} phần. Bạn có thể xử lý từng phần một."
  }
};

// --- Types ---
interface Section {
  title: string;
  key_points: string[];
}

interface Concept {
  name: string;
  explanation: string;
  example: string;
  importance: "low" | "medium" | "high";
}

interface Flashcard {
  question: string;
  answer: string;
}

interface QuizItem {
  question: string;
  options: string[];
  correct: string;
}

interface LearningMaterial {
  id: string;
  topicId: string;
  title: string;
  summary: string;
  sections: Section[];
  concepts: Concept[];
  learning_notes: string;
  flashcards: Flashcard[];
  quiz: QuizItem[];
  review_strategy: string;
  timestamp: number;
}

interface Topic {
  id: string;
  name: string;
  lessons: LearningMaterial[];
}

// --- Components ---

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "high" | "medium" | "low" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    high: "bg-rose-100 text-rose-700 border border-rose-200",
    medium: "bg-amber-100 text-amber-700 border border-amber-200",
    low: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

const FlashcardComponent = ({ card, lang }: { card: Flashcard, lang: Language }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const t = translations[lang];
  return (
    <div 
      className="perspective-1000 h-48 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm group-hover:border-indigo-300 transition-colors">
          <HelpCircle className="w-6 h-6 text-indigo-500 mb-3 opacity-50" />
          <p className="text-slate-800 font-medium leading-relaxed">{card.question}</p>
          <span className="absolute bottom-3 text-[10px] text-slate-400 font-medium uppercase tracking-widest">{t.clickToFlip}</span>
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm rotate-y-180">
          <CheckCircle2 className="w-6 h-6 text-indigo-600 mb-3" />
          <p className="text-indigo-900 font-medium leading-relaxed">{card.answer}</p>
        </div>
      </motion.div>
    </div>
  );
};

const QuizComponent = ({ quiz, lang }: { quiz: QuizItem[], lang: Language }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const t = translations[lang];

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    if (option === quiz[currentStep].correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < quiz.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.quizResult}</h3>
        <p className="text-slate-600 mb-6">{t.quizScore.replace("{score}", score.toString()).replace("{total}", quiz.length.toString())}</p>
        <button 
          onClick={reset}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" /> {t.btnTryAgain}
        </button>
      </div>
    );
  }

  const current = quiz[currentStep];

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-slate-500">
          {t.quizStep.replace("{current}", (currentStep + 1).toString()).replace("{total}", quiz.length.toString())}
        </span>
        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / quiz.length) * 100}%` }}
          />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{current.question}</h3>
      
      <div className="space-y-3">
        {current.options.map((option, idx) => {
          const isCorrect = option === current.correct;
          const isSelected = option === selectedOption;
          
          let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group";
          if (!showResult) {
            buttonClass += " border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30";
          } else {
            if (isCorrect) {
              buttonClass += " border-emerald-500 bg-emerald-50 text-emerald-900";
            } else if (isSelected) {
              buttonClass += " border-rose-500 bg-rose-50 text-rose-900";
            } else {
              buttonClass += " border-slate-100 opacity-50";
            }
          }

          return (
            <button 
              key={idx} 
              onClick={() => handleSelect(option)}
              disabled={showResult}
              className={buttonClass}
            >
              <span className="font-medium">{option}</span>
              {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {showResult && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-rose-600" />}
            </button>
          );
        })}
      </div>

      {showResult && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextQuestion}
          className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
        >
          {currentStep === quiz.length - 1 ? t.btnFinish : t.btnNext}
        </motion.button>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [lessonTitle, setLessonTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaData, setMediaData] = useState<{ data: string; mimeType: string; type: 'audio' | 'video' } | null>(null);
  const [contentChunks, setContentChunks] = useState<({ text: string } | { data: string; mimeType: string; type: 'audio' | 'video' })[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang];

  // Load history from localStorage
  useEffect(() => {
    const savedTopics = localStorage.getItem("learning_topics");
    if (savedTopics) {
      try {
        const parsed = JSON.parse(savedTopics);
        setTopics(parsed);
        if (parsed.length > 0) {
          setActiveTopicId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newMaterial: LearningMaterial) => {
    if (!activeTopicId) return;

    const updatedTopics = topics.map(topic => {
      if (topic.id === activeTopicId) {
        // Add new lesson, avoid duplicates by title within the same topic
        const filteredLessons = topic.lessons.filter(l => l.title !== newMaterial.title);
        return {
          ...topic,
          lessons: [newMaterial, ...filteredLessons].slice(0, 20)
        };
      }
      return topic;
    });

    setTopics(updatedTopics);
    localStorage.setItem("learning_topics", JSON.stringify(updatedTopics));
  };

  const createTopic = () => {
    if (!newTopicName.trim()) return;
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      name: newTopicName.trim(),
      lessons: []
    };
    const updatedTopics = [newTopic, ...topics];
    setTopics(updatedTopics);
    setActiveTopicId(newTopic.id);
    setNewTopicName("");
    localStorage.setItem("learning_topics", JSON.stringify(updatedTopics));
  };

  const deleteTopic = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTopics = topics.filter(t => t.id !== id);
    setTopics(updatedTopics);
    if (activeTopicId === id) {
      setActiveTopicId(updatedTopics.length > 0 ? updatedTopics[0].id : null);
    }
    localStorage.setItem("learning_topics", JSON.stringify(updatedTopics));
  };

  const splitFile = () => {
    if (content.trim()) {
      const chunks: ({ text: string } | { data: string; mimeType: string; type: 'audio' | 'video' })[] = [];
      const chunkSize = 20000;
      for (let i = 0; i < content.length; i += chunkSize) {
        chunks.push({ text: content.substring(i, i + chunkSize) });
      }
      setContentChunks(chunks);
      setCurrentChunkIndex(0);
      const firstChunk = chunks[0];
      if ('text' in firstChunk) setContent(firstChunk.text);
      setError(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isAudio = file.type.startsWith("audio/");
    const isVideo = file.type.startsWith("video/");

    // 15MB limit ONLY for video files
    const MAX_VIDEO_SIZE = 15 * 1024 * 1024;
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      setError(t.errorFileSize);
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result !== "string") return;

      if (isAudio || isVideo) {
        const base64 = result.split(",")[1];
        setMediaData({ 
          data: base64, 
          mimeType: file.type, 
          type: isAudio ? 'audio' : 'video' 
        });
        setContent(""); // Clear text content if media is uploaded
        setError(null);
      } else {
        setContent(result);
        setMediaData(null); // Clear media if text is uploaded
        setError(null);
      }

      if (!lessonTitle) {
        setLessonTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    };

    if (isAudio || isVideo) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const generateMaterial = async () => {
    if (!lessonTitle.trim() || (!content.trim() && !mediaData)) {
      setError(t.errorEmpty);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const parts: any[] = [];

      if (mediaData) {
        parts.push({
          inlineData: {
            data: mediaData.data,
            mimeType: mediaData.mimeType
          }
        });
      } else {
        parts.push({ text: `Content:\n"""\n${content}\n"""` });
      }

      parts.push({ 
        text: `Analyze the provided content for the lesson titled "${lessonTitle}" and transform it into structured learning material. 
        The output MUST be in ${lang === "en" ? "English" : "Vietnamese"}.
        
        IMPORTANT: 
        - Generate AT LEAST 10 flashcards (thẻ ghi nhớ).
        - Generate AT LEAST 10 quiz questions (câu hỏi trắc nghiệm).` 
      });

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction: `You are an expert AI Learning Assistant. Your goal is to transform raw text, transcripts, audio files, or video files into highly effective, structured learning materials that facilitate long-term memory and understanding. Ignore noise and repetitions. Be clear, concise, and insightful. Respond in ${lang === "en" ? "English" : "Vietnamese"}. ALWAYS generate at least 10 flashcards and 10 quiz questions for any content provided.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    key_points: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "key_points"]
                }
              },
              concepts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    example: { type: Type.STRING },
                    importance: { type: Type.STRING, enum: ["low", "medium", "high"] }
                  },
                  required: ["name", "explanation", "importance"]
                }
              },
              learning_notes: { type: Type.STRING, description: "Markdown formatted notes" },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  },
                  required: ["question", "answer"]
                }
              },
              quiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correct: { type: Type.STRING }
                  },
                  required: ["question", "options", "correct"]
                }
              },
              review_strategy: { type: Type.STRING }
            },
            required: ["title", "summary", "sections", "concepts", "learning_notes", "flashcards", "quiz", "review_strategy"]
          }
        }
      });
 
      if (!response.text) {
        throw new Error("Empty response from AI");
      }

      let data;
      try {
        data = JSON.parse(response.text);
      } catch (e) {
        console.error("Failed to parse JSON:", response.text);
        throw new Error("Invalid JSON response from AI");
      }
      const materialWithMeta: LearningMaterial = {
        ...data,
        id: crypto.randomUUID(),
        topicId: activeTopicId!,
        timestamp: Date.now()
      };
      setMaterial(materialWithMeta);
      saveToHistory(materialWithMeta);
      
      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(t.errorFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.appName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t.btnHistory}
            </button>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => setLang("en")}
                className={cn("px-3 py-1 text-xs font-bold rounded-md transition-all", lang === "en" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
              >
                EN
              </button>
              <button 
                onClick={() => setLang("vi")}
                className={cn("px-3 py-1 text-xs font-bold rounded-md transition-all", lang === "vi" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
              >
                VI
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <Card className="p-6 bg-slate-100/50 border-dashed border-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> {t.btnHistory}
                  </h3>
                  <button onClick={() => setShowHistory(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Close</button>
                </div>
                {topics.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">{t.historyEmpty}</p>
                ) : (
                  <div className="space-y-6">
                    {topics.map((topic) => (
                      <div key={topic.id} className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="font-bold text-indigo-600 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {topic.name}
                            <span className="text-[10px] font-normal text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full">
                              {t.lessonCount.replace("{count}", topic.lessons.length.toString())}
                            </span>
                          </h4>
                          <button 
                            onClick={(e) => deleteTopic(topic.id, e)}
                            className="text-[10px] font-bold text-rose-400 hover:text-rose-600 uppercase tracking-widest"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {topic.lessons.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setMaterial(item);
                                setActiveTopicId(topic.id);
                                setShowHistory(false);
                                setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                              }}
                              className="p-3 bg-white rounded-xl border border-slate-200 text-left hover:border-indigo-300 hover:shadow-sm transition-all group"
                            >
                              <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600">{item.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-1 truncate">{item.summary}</p>
                            </button>
                          ))}
                          {topic.lessons.length === 0 && (
                            <p className="text-xs text-slate-400 italic col-span-full">No lessons in this topic yet.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero / Input Section */}
        <section className="mb-16 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              {t.heroTitle} <br />
              <span className="text-indigo-600">{t.heroSubtitle}</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              {t.heroDesc}
            </p>
          </motion.div>

          {/* Topic Selection/Creation */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow relative">
                <input 
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder={t.placeholderTopic}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <button 
                onClick={createTopic}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                {t.btnCreateTopic}
              </button>
            </div>

            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopicId(topic.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold border transition-all",
                      activeTopicId === topic.id 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                    )}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Card className="p-6 text-left">
            <div className="space-y-6">
              {!activeTopicId ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">{t.noTopicSelected}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{t.labelLessonTitle}</label>
                    <input 
                      type="text" 
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder={t.placeholderLessonTitle}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">{t.labelContent}</label>
                        {content.length > 25000 && contentChunks.length === 0 && (
                          <button 
                            onClick={splitFile}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full transition-all"
                          >
                            <Scissors className="w-3 h-3" /> {t.btnSplit}
                          </button>
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        {t.btnUpload}
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept=".txt,.srt,.mp3,.wav,.m4a,.mp4,.webm" 
                        className="hidden" 
                      />
                    </div>
                    {mediaData && (
                      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 text-indigo-700 mb-4">
                        {mediaData.type === 'audio' ? <RefreshCcw className="w-5 h-5 animate-pulse" /> : <Video className="w-5 h-5 animate-pulse" />}
                        <p className="text-sm font-medium">{mediaData.type === 'audio' ? 'Audio' : 'Video'} file ready for analysis</p>
                        <button 
                          onClick={() => setMediaData(null)}
                          className="ml-auto text-xs font-bold text-indigo-400 hover:text-indigo-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <textarea 
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        if (e.target.value.trim()) {
                          setMediaData(null);
                          setContentChunks([]);
                        }
                      }}
                      placeholder={t.placeholderContent}
                      rows={8}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    />
                    {contentChunks.length > 1 && (
                      <div className="mt-4 flex items-center justify-between p-3 bg-slate-100/50 border border-slate-200 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                          {t.partIndicator.replace("{current}", (currentChunkIndex + 1).toString()).replace("{total}", contentChunks.length.toString())}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              const next = Math.max(0, currentChunkIndex - 1);
                              setCurrentChunkIndex(next);
                              const chunk = contentChunks[next];
                              if ('text' in chunk) setContent(chunk.text);
                              else {
                                setMediaData(chunk);
                                setContent("");
                              }
                            }}
                            disabled={currentChunkIndex === 0}
                            className="p-1.5 bg-white shadow-sm border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
                          >
                            <ChevronLeft className="w-4 h-4 text-slate-600" />
                          </button>
                          <button 
                            onClick={() => {
                              const next = Math.min(contentChunks.length - 1, currentChunkIndex + 1);
                              setCurrentChunkIndex(next);
                              const chunk = contentChunks[next];
                              if ('text' in chunk) setContent(chunk.text);
                              else {
                                setMediaData(chunk);
                                setContent("");
                              }
                            }}
                            disabled={currentChunkIndex === contentChunks.length - 1}
                            className="p-1.5 bg-white shadow-sm border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
                          >
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {error && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <button 
                    onClick={generateMaterial}
                    disabled={isLoading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        {t.btnGenerating}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        {t.btnGenerate}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </Card>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {material && (
            <motion.div 
              ref={resultsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pb-24"
            >
              {/* Summary & Title */}
              <div className="text-center max-w-3xl mx-auto">
                <Badge variant="medium">{t.badgeGenerated}</Badge>
                <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-4">{material.title}</h2>
                <p className="text-slate-600 text-lg italic">"{material.summary}"</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Sections & Concepts */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Sections */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <FileText className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-slate-900">{t.titleSections}</h3>
                    </div>
                    <div className="space-y-4">
                      {material.sections.map((section, idx) => (
                        <Card key={idx} className="p-6">
                          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs">{idx + 1}</span>
                            {section.title}
                          </h4>
                          <ul className="space-y-2">
                            {section.key_points.map((point, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-3 text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      ))}
                    </div>
                  </section>

                  {/* Concepts */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <Brain className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-slate-900">{t.titleConcepts}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {material.concepts.map((concept, idx) => (
                        <Card key={idx} className="p-5 flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-900">{concept.name}</h4>
                            <Badge variant={concept.importance as any}>{lang === "en" ? concept.importance : (translations.vi as any)[`importance${concept.importance.charAt(0).toUpperCase() + concept.importance.slice(1)}`]}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-4 flex-grow">{concept.explanation}</p>
                          {concept.example && (
                            <div className="mt-auto p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t.exampleLabel}</span>
                              <p className="text-xs text-slate-500 italic">{concept.example}</p>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </section>

                  {/* Learning Notes */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-slate-900">{t.titleNotes}</h3>
                    </div>
                    <Card className="p-8 prose prose-slate max-w-none prose-headings:text-slate-900 prose-strong:text-indigo-700">
                      <ReactMarkdown>{material.learning_notes}</ReactMarkdown>
                    </Card>
                  </section>
                </div>

                {/* Right Column: Flashcards, Quiz, Strategy */}
                <div className="space-y-8">
                  {/* Flashcards */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <RefreshCcw className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-slate-900">{t.titleFlashcards}</h3>
                    </div>
                    <div className="space-y-4">
                      {material.flashcards.map((card, idx) => (
                        <FlashcardComponent key={idx} card={card} lang={lang} />
                      ))}
                    </div>
                  </section>

                  {/* Quiz */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <HelpCircle className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-slate-900">{t.titleQuiz}</h3>
                    </div>
                    <Card className="p-6">
                      <QuizComponent quiz={material.quiz} lang={lang} />
                    </Card>
                  </section>

                  {/* Review Strategy */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <Lightbulb className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-slate-900">{t.titleStrategy}</h3>
                    </div>
                    <Card className="p-6 bg-indigo-600 text-white border-none shadow-indigo-200">
                      <p className="text-indigo-50 leading-relaxed mb-4">
                        {material.review_strategy}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-200 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        {t.personalizedStrategy}
                      </div>
                    </Card>
                  </section>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-12 border-t border-slate-200">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" /> {t.btnExport}
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(material, null, 2));
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 relative"
                >
                  <Copy className="w-5 h-5" /> 
                  {isCopied ? (lang === "en" ? "Copied!" : "Đã chép!") : t.btnCopy}
                </button>
                <button 
                  onClick={() => {
                    setMaterial(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> {t.btnNew}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <GraduationCap className="w-5 h-5" />
            <span className="font-bold tracking-tight">{t.appName}</span>
          </div>
          <p className="text-slate-400 text-sm">
            {t.footerDesc}
          </p>
        </div>
      </footer>

      {/* Custom Styles for 3D Flip */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
