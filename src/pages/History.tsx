import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

const historyItems = [
  {
    id: 1,
    prompt: "Создай карточку товара с изображением, ценой и кнопкой купить",
    framework: "React",
    frameworkColor: "text-cyan-400",
    type: "Компонент",
    lines: 52,
    date: "Сегодня, 14:32",
    status: "success",
    saved: true,
  },
  {
    id: 2,
    prompt: "Напиши хук useFetch для загрузки данных с обработкой ошибок",
    framework: "React",
    frameworkColor: "text-cyan-400",
    type: "Хук",
    lines: 38,
    date: "Сегодня, 13:15",
    status: "success",
    saved: false,
  },
  {
    id: 3,
    prompt: "Адаптивный navbar с бургер-меню для мобильных устройств",
    framework: "Vue",
    frameworkColor: "text-green-400",
    type: "Компонент",
    lines: 87,
    date: "Вчера, 19:44",
    status: "success",
    saved: true,
  },
  {
    id: 4,
    prompt: "Форма авторизации с валидацией и переключением между login/register",
    framework: "React",
    frameworkColor: "text-cyan-400",
    type: "Страница",
    lines: 124,
    date: "Вчера, 16:20",
    status: "success",
    saved: false,
  },
  {
    id: 5,
    prompt: "Дашборд с графиками продаж и статистикой пользователей",
    framework: "Angular",
    frameworkColor: "text-red-400",
    type: "Страница",
    lines: 0,
    date: "28 марта, 11:05",
    status: "error",
    saved: false,
  },
  {
    id: 6,
    prompt: "Компонент таблицы с сортировкой, фильтрацией и пагинацией",
    framework: "React",
    frameworkColor: "text-cyan-400",
    type: "Компонент",
    lines: 196,
    date: "27 марта, 09:30",
    status: "success",
    saved: true,
  },
];

const stats = [
  { label: "Всего генераций", value: "24", icon: "Sparkles", color: "text-purple-400" },
  { label: "Успешных", value: "21", icon: "CheckCircle", color: "text-green-400" },
  { label: "Строк кода", value: "2.4k", icon: "Code2", color: "text-cyan-400" },
  { label: "Сохранено", value: "8", icon: "Bookmark", color: "text-pink-400" },
];

export default function History() {
  const [filter, setFilter] = useState<"all" | "saved">("all");
  const [savedItems, setSavedItems] = useState<number[]>(
    historyItems.filter((i) => i.saved).map((i) => i.id)
  );

  const toggleSave = (id: number) => {
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filtered = historyItems.filter((item) =>
    filter === "all" ? true : savedItems.includes(item.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">История</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Все ваши генерации и сохранённые проекты
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4 text-center">
            <Icon name={stat.icon} size={24} className={`${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === "all"
                ? "bg-primary/20 text-primary border-primary/40"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            Все генерации
          </button>
          <button
            onClick={() => setFilter("saved")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-1.5 ${
              filter === "saved"
                ? "bg-pink-500/20 text-pink-400 border-pink-400/40"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Icon name="Bookmark" size={14} />
            Сохранённые
          </button>
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} записей</span>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Icon name="BookmarkX" size={40} className="text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Нет сохранённых генераций</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="glass rounded-2xl p-5 flex items-start gap-4 hover:border-primary/20 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                item.status === "success"
                  ? "bg-green-400/10 text-green-400"
                  : "bg-red-400/10 text-red-400"
              }`}>
                <Icon name={item.status === "success" ? "CheckCircle" : "XCircle"} size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {item.prompt}
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className={`text-xs font-mono ${item.frameworkColor}`}>{item.framework}</span>
                  <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                    {item.type}
                  </Badge>
                  {item.lines > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Code2" size={11} />
                      {item.lines} строк
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Clock" size={11} />
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleSave(item.id)}
                  className={`p-2 rounded-lg border transition-all ${
                    savedItems.includes(item.id)
                      ? "bg-pink-400/10 text-pink-400 border-pink-400/30"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon name={savedItems.includes(item.id) ? "Bookmark" : "BookmarkPlus"} size={15} />
                </button>
                {item.status === "success" && (
                  <button className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all">
                    <Icon name="RefreshCw" size={15} />
                  </button>
                )}
                <button className="p-2 rounded-lg border border-border text-muted-foreground hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all">
                  <Icon name="Trash2" size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
