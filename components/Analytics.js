// components/Analytics.js - Компонент для аналитических графиков и экспорта

// Получаем компоненты Recharts из глобальной переменной
const { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
       XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } = window.Recharts;

// Получаем иконки из Lucide
const { Download, FileText, Printer, AlertCircle, TrendingUp, Activity, Clock, AlertTriangle } = window.lucide;

const Analytics = ({ equipmentStats, eventTypeStats, timelineData, handleExportReport }) => {
  const COLORS = {
    repair: '#ef4444',
    operation: '#22c55e',
    warning: '#f59e0b',
    error: '#dc2626',
    success: '#16a34a',
    neutral: '#6b7280',
    chart: {
      primary: '#3b82f6',
      secondary: '#10b981',
      tertiary: '#f59e0b',
      quaternary: '#8b5cf6'
    }
  };
  
  // Назначаем специфические цвета для типов событий
  const getEventTypeColor = (name) => {
    switch(name) {
      case 'Ремонт': return COLORS.repair;
      case 'Работа': return COLORS.operation;
      case 'Предупреждение': return COLORS.warning;
      case 'Ошибка': return COLORS.error;
      default: return COLORS.neutral;
    }
  };
  
  // Обработка ошибок при отсутствии данных
  if (!equipmentStats || !eventTypeStats || !timelineData) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-lg font-medium">Ошибка загрузки данных</h3>
        </div>
        <p className="mt-2 text-red-500">
          Не удалось загрузить данные для анализа. Пожалуйста, проверьте подключение и попробуйте снова.
        </p>
      </div>
    );
  }

  // Форматирование данных для графиков
  const pieData = Object.entries(eventTypeStats).map(([name, value]) => ({
    name,
    value
  }));

  const barData = Object.entries(equipmentStats).map(([name, value]) => ({
    name,
    value
  }));

  // Компонент для отображения экспорта
  const ExportSection = () => (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Экспорт данных</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          onClick={() => handleExportReport('pdf')}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FileText className="w-4 h-4" />
          PDF
        </button>
        <button
          onClick={() => handleExportReport('excel')}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Download className="w-4 h-4" />
          Excel
        </button>
        <button
          onClick={() => handleExportReport('print')}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <Printer className="w-4 h-4" />
          Печать
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Аналитика</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                <Bar dataKey="value" fill={COLORS.chart.primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Активность по времени</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Ремонт" stroke={COLORS.repair} />
                <Line type="monotone" dataKey="Работа" stroke={COLORS.operation} />
                <Line type="monotone" dataKey="Предупреждение" stroke={COLORS.warning} />
                <Line type="monotone" dataKey="Ошибка" stroke={COLORS.error} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Простой оборудования</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Простой" fill={COLORS.chart.tertiary} stroke={COLORS.chart.tertiary} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <ExportSection />
    </div>
  );
};
