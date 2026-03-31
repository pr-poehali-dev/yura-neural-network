import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

const categories = ["Все", "Компоненты", "Хуки", "Страницы", "Анимации", "API"];

const examples = [
  {
    id: 1,
    title: "Карточка товара",
    description: "Адаптивная карточка с изображением, ценой и кнопкой добавления в корзину",
    framework: "React",
    frameworkColor: "text-cyan-400",
    category: "Компоненты",
    lines: 52,
    difficulty: "Легко",
    difficultyColor: "text-green-400 bg-green-400/10 border-green-400/30",
    tags: ["TypeScript", "Tailwind"],
    code: `export function ProductCard({ image, title, price }) {
  return (
    <div className="rounded-2xl border p-4">
      <img src={image} className="w-full rounded-xl" />
      <h3 className="font-bold mt-3">{title}</h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xl font-bold">{price} ₽</span>
        <button className="btn-primary">В корзину</button>
      </div>
    </div>
  );
}`,
  },
  {
    id: 2,
    title: "useFetch хук",
    description: "Универсальный хук для загрузки данных с состояниями loading и error",
    framework: "React",
    frameworkColor: "text-cyan-400",
    category: "Хуки",
    lines: 38,
    difficulty: "Средне",
    difficultyColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    tags: ["TypeScript", "Generics"],
    code: `function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}`,
  },
  {
    id: 3,
    title: "Navbar с бургером",
    description: "Адаптивная навигация с анимированным бургер-меню для мобильных устройств",
    framework: "Vue",
    frameworkColor: "text-green-400",
    category: "Компоненты",
    lines: 87,
    difficulty: "Средне",
    difficultyColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    tags: ["Composition API", "CSS"],
    code: `<template>
  <nav class="navbar">
    <div class="brand">MyApp</div>
    <button @click="isOpen = !isOpen" class="burger">
      <span :class="{ 'rotate-45': isOpen }"></span>
    </button>
    <ul :class="{ 'open': isOpen }">
      <li v-for="link in links" :key="link.href">
        <a :href="link.href">{{ link.label }}</a>
      </li>
    </ul>
  </nav>
</template>`,
  },
  {
    id: 4,
    title: "Форма авторизации",
    description: "Готовая форма login/register с валидацией и анимациями переключения",
    framework: "React",
    frameworkColor: "text-cyan-400",
    category: "Страницы",
    lines: 124,
    difficulty: "Сложно",
    difficultyColor: "text-red-400 bg-red-400/10 border-red-400/30",
    tags: ["React Hook Form", "Zod"],
    code: `const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

export function AuthForm() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      <input {...register('password')} type="password" />
      <button type="submit">Войти</button>
    </form>
  );
}`,
  },
  {
    id: 5,
    title: "Анимированный счётчик",
    description: "Число плавно анимируется от 0 до заданного значения при появлении в зоне видимости",
    framework: "React",
    frameworkColor: "text-cyan-400",
    category: "Анимации",
    lines: 31,
    difficulty: "Легко",
    difficultyColor: "text-green-400 bg-green-400/10 border-green-400/30",
    tags: ["Intersection Observer"],
    code: `function AnimatedCounter({ target = 1000 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const step = target / 60;
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= target) { clearInterval(timer); return target; }
        return Math.min(prev + step, target);
      });
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{Math.round(count).toLocaleString()}</span>;
}`,
  },
  {
    id: 6,
    title: "REST API клиент",
    description: "Типизированный клиент для работы с REST API с интерцепторами и обработкой ошибок",
    framework: "Angular",
    frameworkColor: "text-red-400",
    category: "API",
    lines: 67,
    difficulty: "Сложно",
    difficultyColor: "text-red-400 bg-red-400/10 border-red-400/30",
    tags: ["HttpClient", "RxJS"],
    code: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(\`\${API_URL}/\${endpoint}\`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}`,
  },
];

export default function Examples() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = examples.filter(
    (e) => activeCategory === "Все" || e.category === activeCategory
  );

  const handleCopy = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">Примеры кода</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Готовые шаблоны и сниппеты для React, Vue, Angular и других фреймворков
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
              activeCategory === cat
                ? "bg-primary/20 text-primary border-primary/40 glow-purple"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((example) => (
          <div
            key={example.id}
            className="glass rounded-2xl overflow-hidden flex flex-col hover:border-primary/20 transition-all duration-300 group"
          >
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {example.title}
                  </h3>
                  <span className={`text-xs font-mono ${example.frameworkColor}`}>{example.framework}</span>
                </div>
                <Badge variant="outline" className={`text-xs ${example.difficultyColor}`}>
                  {example.difficulty}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {example.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {example.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">
                    {tag}
                  </span>
                ))}
              </div>

              {expandedId === example.id && (
                <div className="rounded-xl overflow-hidden border border-border bg-secondary/30 mb-3">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <span className="text-xs font-mono text-muted-foreground">{example.lines} строк</span>
                    <button
                      onClick={() => handleCopy(example.id, example.code)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <Icon name={copiedId === example.id ? "Check" : "Copy"} size={12} />
                      {copiedId === example.id ? "Скопировано!" : "Копировать"}
                    </button>
                  </div>
                  <pre className="p-3 text-xs font-mono text-foreground/80 overflow-x-auto scrollbar-thin max-h-48 leading-relaxed">
                    <code>{example.code}</code>
                  </pre>
                </div>
              )}
            </div>

            <div className="px-5 pb-4 flex items-center gap-2">
              <button
                onClick={() => setExpandedId(expandedId === example.id ? null : example.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <Icon name={expandedId === example.id ? "ChevronUp" : "Code2"} size={14} />
                {expandedId === example.id ? "Скрыть код" : "Смотреть код"}
              </button>
              <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-primary/20 text-primary border border-primary/30 text-sm font-medium hover:bg-primary/30 transition-all">
                <Icon name="Sparkles" size={14} />
                Изменить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
