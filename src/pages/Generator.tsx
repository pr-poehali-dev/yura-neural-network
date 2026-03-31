import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import funcUrls from "../../backend/func2url.json";

const GENERATE_URL = funcUrls["generate-code"];

const frameworks = [
  { id: "react", name: "React", icon: "Atom", color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10" },
  { id: "vue", name: "Vue", icon: "Triangle", color: "text-green-400 border-green-400/30 bg-green-400/10" },
  { id: "angular", name: "Angular", icon: "Shield", color: "text-red-400 border-red-400/30 bg-red-400/10" },
  { id: "svelte", name: "Svelte", icon: "Flame", color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
  { id: "nextjs", name: "Next.js", icon: "Globe", color: "text-white border-white/20 bg-white/5" },
  { id: "vanilla", name: "Vanilla JS", icon: "FileCode", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
];

const codeTypes = ["Компонент", "Хук", "Утилита", "API", "Страница", "Стили"];

const examplePrompts = [
  "Создай карточку товара с изображением, ценой и кнопкой купить",
  "Напиши хук useFetch для загрузки данных с обработкой ошибок",
  "Сделай адаптивный navbar с бургер-меню для мобильных",
  "Создай форму авторизации с валидацией полей",
];

const fileExtensions: Record<string, string> = {
  react: "Component.tsx",
  vue: "Component.vue",
  angular: "component.ts",
  svelte: "Component.svelte",
  nextjs: "page.tsx",
  vanilla: "script.js",
};

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("react");
  const [selectedType, setSelectedType] = useState("Компонент");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedCode("");
    setError("");
    setTokens(0);

    try {
      const resp = await fetch(GENERATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          framework: selectedFramework,
          codeType: selectedType,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || "Ошибка генерации");
        setIsGenerating(false);
        return;
      }

      const fullCode = data.code || "";
      setTokens(data.tokens || 0);

      let i = 0;
      const interval = setInterval(() => {
        setGeneratedCode(fullCode.slice(0, i));
        i += 12;
        if (i > fullCode.length) {
          clearInterval(interval);
          setIsGenerating(false);
          setGeneratedCode(fullCode);
        }
      }, 10);
    } catch {
      setError("Не удалось подключиться к серверу");
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">Генератор кода</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Опиши что нужно создать — ИИ напишет готовый код для любого фреймворка
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">Фреймворк</label>
              <div className="grid grid-cols-3 gap-2">
                {frameworks.map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => setSelectedFramework(fw.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      selectedFramework === fw.id
                        ? fw.color + " scale-105"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-secondary/50"
                    }`}
                  >
                    <Icon name={fw.icon} size={14} />
                    {fw.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">Тип кода</label>
              <div className="flex flex-wrap gap-2">
                {codeTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      selectedType === type
                        ? "bg-primary/20 text-primary border-primary/40"
                        : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-3">
            <label className="text-sm font-medium text-muted-foreground block">Описание задачи</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Например: создай карточку товара с изображением, названием, ценой и кнопкой добавить в корзину..."
              className="min-h-[120px] bg-secondary/50 border-border resize-none text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50"
            />
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors border border-border truncate max-w-[200px]"
                >
                  {ex.slice(0, 40)}...
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white glow-purple transition-all duration-300 disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Icon name="Loader2" size={18} className="animate-spin" />
                Генерирую код...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Icon name="Sparkles" size={18} />
                Сгенерировать код
              </span>
            )}
          </Button>

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 flex items-center gap-2 text-sm text-red-400">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {fileExtensions[selectedFramework] || "code.tsx"}
              </span>
              {generatedCode && !isGenerating && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                  Готово
                </Badge>
              )}
            </div>
            {generatedCode && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name={copied ? "Check" : "Copy"} size={14} />
                {copied ? "Скопировано!" : "Копировать"}
              </button>
            )}
          </div>

          <div className="flex-1 p-4 overflow-auto scrollbar-thin">
            {!generatedCode && !isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Icon name="Code2" size={28} className="text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Здесь появится ваш код</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">Опишите задачу и нажмите «Сгенерировать»</p>
                </div>
              </div>
            ) : (
              <pre className="text-sm font-mono text-foreground/90 whitespace-pre-wrap leading-relaxed">
                <code>{generatedCode}
                  {isGenerating && <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse" />}
                </code>
              </pre>
            )}
          </div>

          {generatedCode && !isGenerating && (
            <div className="px-4 py-3 border-t border-border bg-secondary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono">{generatedCode.split('\n').length} строк</span>
                {tokens > 0 && (
                  <span className="text-xs text-muted-foreground/60 font-mono">{tokens} токенов</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Icon name="RefreshCw" size={12} />
                  Перегенерировать
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
