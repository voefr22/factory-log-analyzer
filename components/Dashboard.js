// components/Dashboard.js - Компонент дашборда

// Получаем компоненты из Recharts через глобальную переменную window
const { 
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} = window.Recharts;

// Получаем иконки из lucide через глобальную переменную window
const { AlertTriangle, TrendingUp, Database, Clock } = window.lucide;

// Определяем палитру цветов для графиков
const COLORS = {
    repair: '#FF8042',
    stop: '#FF0000',
    work: '#00C49F',
    preparation: '#0088FE',
    pouring: '#FFBB28',
    info: '#8884d8',
    default: '#8884d8'
};

// Делаем компонент Dashboard доступным глобально
window.Dashboard = ({ parsedData, equipmentStats, eventTypeStats, timelineData, recommendations, handleGenerateAIRecommendations }) => {
    // Проверка наличия необходимых данных
    if (!parsedData || !equipmentStats || !eventTypeStats || !timelineData) {
        return (
            <div className="error-state">
                <AlertTriangle size={24} className="text-red-500" />
                <p>Отсутствуют необходимые данные для отображения</p>
            </div>
        );
    }

    // Счетчики для статистики
    const stats = {
        total: parsedData.length,
        repairs: parsedData.filter(item => item.eventType === 'Ремонт').length,
        operational: parsedData.filter(item => item.eventType === 'Работа').length
    };

    // Компонент карточки статистики
    const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
        <div className={`stat-card ${bgColor}`}>
            <div className="stat-card-header">
                <h3 className="stat-card-title">{title}</h3>
                <Icon size={20} color={color} />
            </div>
            <p className="stat-card-value">{value}</p>
        </div>
    );

    // Компонент графика событий
    const EventsChart = () => (
        <div className="card">
            <h2 className="card-title">События по дням</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Ремонт" stackId="a" fill={COLORS.repair} />
                        <Bar dataKey="Остановка" stackId="a" fill={COLORS.stop} />
                        <Bar dataKey="Работа" stackId="a" fill={COLORS.work} />
                        <Bar dataKey="Подготовка" stackId="a" fill={COLORS.preparation} />
                        <Bar dataKey="Заливка" stackId="a" fill={COLORS.pouring} />
                        <Bar dataKey="Информация" stackId="a" fill={COLORS.info} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Компонент графика распределения по оборудованию
    const EquipmentChart = () => (
        <div className="card">
            <h2 className="card-title">Распределение по оборудованию</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={equipmentStats.slice(0, 7)}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {equipmentStats.slice(0, 7).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Компонент рекомендаций
    const Recommendations = () => (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">Рекомендации</h2>
                <button 
                    className="btn btn-purple flex items-center space-x-2"
                    onClick={handleGenerateAIRecommendations}
                >
                    <TrendingUp size={16} />
                    <span>ИИ-анализ</span>
                </button>
            </div>
            
            <div className="space-y-4">
                {recommendations.map((rec, index) => (
                    <div 
                        key={index} 
                        className={`rec-card ${
                            rec.priority === 'Высокий' ? 'rec-high' : 
                            rec.priority === 'Средний' ? 'rec-medium' : 
                            'rec-low'
                        }`}
                    >
                        <div className="rec-card-inner">
                            <div className="rec-icon-container">
                                <AlertTriangle size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold">Приоритет: {rec.priority}</h3>
                                <p>{rec.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
                
                {recommendations.length === 0 && (
                    <p className="text-gray-500 italic">Нет рекомендаций</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Секция статистики */}
            <div className="card">
                <h2 className="card-title">Обзор журнала событий</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                        title="Всего записей"
                        value={stats.total}
                        icon={Database}
                        color="#2563eb"
                        bgColor="stat-blue"
                    />
                    <StatCard 
                        title="Ремонты"
                        value={stats.repairs}
                        icon={AlertTriangle}
                        color="#ea580c"
                        bgColor="stat-orange"
                    />
                    <StatCard 
                        title="В работе"
                        value={stats.operational}
                        icon={Clock}
                        color="#059669"
                        bgColor="stat-green"
                    />
                </div>
            </div>
            
            {/* Графики */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EventsChart />
                <EquipmentChart />
            </div>
            
            {/* Рекомендации */}
            <Recommendations />
        </div>
    );
};
