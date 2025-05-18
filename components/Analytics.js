// components/Analytics.js - Компонент для аналитических графиков и экспорта

// Получаем компоненты из Recharts через глобальную переменную window
const { 
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area
} = window.Recharts;

// Получаем иконки из lucide через глобальную переменную window
const { 
    Download, Printer, AlertCircle, TrendingUp, Activity, Clock, AlertTriangle 
} = window.lucide;

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

// Делаем компонент Analytics доступным глобально
window.Analytics = ({ equipmentStats, eventTypeStats, timelineData, handleExportReport }) => {
    // Проверка наличия необходимых данных
    if (!equipmentStats || !eventTypeStats || !timelineData) {
        return (
            <div className="error-state">
                <AlertCircle size={24} className="text-red-500" />
                <p>Отсутствуют необходимые данные для отображения</p>
            </div>
        );
    }

    // Функция для определения цвета в зависимости от типа события
    const getEventTypeColor = (name) => {
        switch(name) {
            case 'Ремонт': return COLORS.repair;
            case 'Остановка': return COLORS.stop;
            case 'Работа': return COLORS.work;
            case 'Подготовка': return COLORS.preparation;
            case 'Заливка': return COLORS.pouring;
            default: return COLORS.info;
        }
    };

    // Компонент графика типов событий
    const EventTypeChart = () => (
        <div className="card">
            <h2 className="card-title">Типы событий</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={eventTypeStats}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {eventTypeStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getEventTypeColor(entry.name)} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Компонент графика активности по оборудованию
    const EquipmentActivityChart = () => (
        <div className="card">
            <h2 className="card-title">Активность по оборудованию</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={equipmentStats.slice(0, 7)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill={COLORS.work} name="Количество событий" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Компонент графика активности по времени
    const TimelineChart = () => (
        <div className="card lg:col-span-2">
            <h2 className="card-title">Активность по времени</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                        data={timelineData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="Ремонт" stackId="1" stroke={COLORS.repair} fill={COLORS.repair} />
                        <Area type="monotone" dataKey="Остановка" stackId="1" stroke={COLORS.stop} fill={COLORS.stop} />
                        <Area type="monotone" dataKey="Работа" stackId="1" stroke={COLORS.work} fill={COLORS.work} />
                        <Area type="monotone" dataKey="Подготовка" stackId="1" stroke={COLORS.preparation} fill={COLORS.preparation} />
                        <Area type="monotone" dataKey="Заливка" stackId="1" stroke={COLORS.pouring} fill={COLORS.pouring} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Компонент экспорта
    const ExportSection = () => (
        <div className="card lg:col-span-2">
            <div className="card-header">
                <h2 className="card-title">Экспорт аналитики</h2>
                <div className="flex space-x-2">
                    <button 
                        className="btn btn-primary flex items-center space-x-2"
                        onClick={() => handleExportReport('pdf')}
                    >
                        <Download size={16} />
                        <span>Экспорт PDF</span>
                    </button>
                    <button 
                        className="btn btn-success flex items-center space-x-2"
                        onClick={() => handleExportReport('excel')}
                    >
                        <Download size={16} />
                        <span>Экспорт Excel</span>
                    </button>
                    <button 
                        className="btn btn-secondary flex items-center space-x-2"
                        onClick={() => handleExportReport('print')}
                    >
                        <Printer size={16} />
                        <span>Печать</span>
                    </button>
                </div>
            </div>
            <p className="text-gray-600 mt-4">
                Экспортируйте данные аналитики для презентаций и отчетов. Включает все графики, статистику и рекомендации.
            </p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EventTypeChart />
                <EquipmentActivityChart />
                <TimelineChart />
                <ExportSection />
            </div>
        </div>
    );
};
