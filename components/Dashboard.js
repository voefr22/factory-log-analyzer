// components/Dashboard.js - Компонент дашборда

// Импортируем компоненты из Recharts
const {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line
} = window.Recharts;

// Импортируем иконки из Lucide
const {
    AlertTriangle,
    TrendingUp,
    Database,
    Clock,
    Activity,
    AlertCircle,
    CheckCircle2,
    XCircle
} = window.lucide;

// Цветовая палитра для графиков
const COLORS = {
    repair: '#ef4444',
    operation: '#22c55e',
    warning: '#f59e0b',
    error: '#dc2626',
    success: '#16a34a',
    neutral: '#6b7280'
};

// Делаем Dashboard доступным глобально через window
window.Dashboard = ({ 
    parsedData, 
    equipmentStats, 
    eventTypeStats, 
    timelineData, 
    recommendations, 
    handleGenerateAIRecommendations 
}) => {
    // Обработка ошибок при отсутствии данных
    if (!parsedData || !equipmentStats || !eventTypeStats || !timelineData) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="text-lg font-medium">Ошибка загрузки данных</h3>
                </div>
                <p className="mt-2 text-red-500">
                    Не удалось загрузить данные для отображения. Пожалуйста, проверьте подключение и попробуйте снова.
                </p>
            </div>
        );
    }

    // Счетчики для статистики
    const stats = {
        repairs: parsedData.filter(item => item.eventType === 'Ремонт').length,
        operational: parsedData.filter(item => item.eventType === 'Работа').length,
        warnings: parsedData.filter(item => item.eventType === 'Предупреждение').length,
        errors: parsedData.filter(item => item.eventType === 'Ошибка').length
    };

    // Форматирование данных для графиков
    const pieData = Object.entries(eventTypeStats).map(([name, value]) => ({
        name,
        value
    }));

    const barData = Object.entries(equipmentStats).map(([name, value]) => ({
        name,
        value
    }));

    // Функция для определения цвета в зависимости от типа события
    const getEventTypeColor = (type) => {
        switch (type) {
            case 'Ремонт': return COLORS.repair;
            case 'Работа': return COLORS.operation;
            case 'Предупреждение': return COLORS.warning;
            case 'Ошибка': return COLORS.error;
            default: return COLORS.neutral;
        }
    };

    // Компонент для отображения статистики
    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${color}-50`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопка генерации рекомендаций */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Панель управления</h2>
                <button
                    onClick={handleGenerateAIRecommendations}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Сгенерировать рекомендации
                </button>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Ремонты"
                    value={stats.repairs}
                    icon={AlertTriangle}
                    color="red"
                />
                <StatCard
                    title="Рабочие операции"
                    value={stats.operational}
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Предупреждения"
                    value={stats.warnings}
                    icon={AlertCircle}
                    color="yellow"
                />
                <StatCard
                    title="Ошибки"
                    value={stats.errors}
                    icon={XCircle}
                    color="red"
                />
            </div>

            {/* Графики */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* График распределения по типам событий */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Распределение по типам событий</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getEventTypeColor(entry.name)} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* График активности оборудования */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Активность оборудования</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill={COLORS.operation} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Рекомендации */}
            {recommendations && recommendations.length > 0 && (
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Рекомендации</h3>
                    <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-900">{rec}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
