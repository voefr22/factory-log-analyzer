// components/Analytics.js - Компонент для аналитических графиков и экспорта

// Извлекаем компоненты из библиотек Recharts и Lucide
const { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
      XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;
const { Download, Printer } = lucide;

const Analytics = ({ equipmentStats, eventTypeStats, timelineData, handleExportReport }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000', '#82ca9d'];
  
  // Назначаем специфические цвета для типов событий
  const getEventTypeColor = (name) => {
    switch(name) {
      case 'Ремонт': return '#FF8042';
      case 'Остановка': return '#FF0000';
      case 'Работа': return '#00C49F';
      case 'Подготовка': return '#0088FE';
      case 'Заливка': return '#FFBB28';
      default: return '#8884d8';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График типов событий */}
        <div className="card">
          <h2 className="card-title">Типы событий</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
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
        
        {/* График активности по оборудованию */}
        <div className="card">
          <h2 className="card-title">Активность по оборудованию</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
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
                <Bar dataKey="value" fill="#8884d8" name="Количество событий" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Линейный график активности */}
        <div className="card lg:col-span-2">
          <h2 className="card-title">Активность по времени</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Ремонт" stroke="#FF8042" />
                <Line type="monotone" dataKey="Остановка" stroke="#FF0000" />
                <Line type="monotone" dataKey="Работа" stroke="#00C49F" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Анализ простоя оборудования */}
        <div className="card">
          <h2 className="card-title">Время простоя оборудования</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={equipmentStats.slice(0, 5)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#FF0000" name="Часы простоя" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-gray-500 mt-2 text-sm">* Примерные данные для демонстрации</p>
        </div>
        
        {/* Прогноз неисправностей */}
        <div className="card">
          <h2 className="card-title">Прогноз неисправностей</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { name: 'Янв', ЦМ8: 65, ИЧТ3: 40, ЛЛ2: 20 },
                  { name: 'Фев', ЦМ8: 70, ИЧТ3: 45, ЛЛ2: 25 },
                  { name: 'Мар', ЦМ8: 80, ИЧТ3: 60, ЛЛ2: 40 },
                  { name: 'Апр', ЦМ8: 95, ИЧТ3: 70, ЛЛ2: 45 },
                  { name: 'Май', ЦМ8: 85, ИЧТ3: 75, ЛЛ2: 55 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ЦМ8" stroke="#8884d8" />
                <Line type="monotone" dataKey="ИЧТ3" stroke="#82ca9d" />
                <Line type="monotone" dataKey="ЛЛ2" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-gray-500 mt-2 text-sm">* На основе ИИ-анализа. Требуются дополнительные данные для точного прогноза.</p>
        </div>
        
        {/* Экспорт отчета */}
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
      </div>
    </div>
  );
};
