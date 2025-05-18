// components/Dashboard.js - Компонент дашборда

// Определяем палитру цветов для графиков
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000', '#82ca9d'];

// Извлекаем компоненты из библиотек Recharts и Lucide
const { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, 
      XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;

const Dashboard = ({ parsedData, equipmentStats, eventTypeStats, timelineData, recommendations, handleGenerateAIRecommendations }) => {
  const { AlertTriangle, TrendingUp, Database, Clock } = lucide;
  
  // Счетчики для статистики
  const repairsCount = parsedData.filter(item => item.eventType === 'Ремонт').length;
  const operationalCount = parsedData.filter(item => item.eventType === 'Работа').length;
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="card-title">Обзор журнала событий</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-blue stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Всего записей</h3>
              <Database size={20} color="#2563eb" />
            </div>
            <p className="stat-card-value">{parsedData.length}</p>
          </div>
          
          <div className="stat-orange stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Ремонты</h3>
              <AlertTriangle size={20} color="#ea580c" />
            </div>
            <p className="stat-card-value">{repairsCount}</p>
          </div>
          
          <div className="stat-green stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">В работе</h3>
              <Clock size={20} color="#059669" />
            </div>
            <p className="stat-card-value">{operationalCount}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График типов событий за период */}
        <div className="card">
          <h2 className="card-title">События по дням</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ремонт" stackId="a" fill="#FF8042" />
                <Bar dataKey="Остановка" stackId="a" fill="#FF0000" />
                <Bar dataKey="Работа" stackId="a" fill="#00C49F" />
                <Bar dataKey="Подготовка" stackId="a" fill="#0088FE" />
                <Bar dataKey="Заливка" stackId="a" fill="#FFBB28" />
                <Bar dataKey="Информация" stackId="a" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Распределение по оборудованию */}
        <div className="card">
          <h2 className="card-title">Распределение по оборудованию</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Секция рекомендаций */}
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
              className={
                rec.priority === 'Высокий' ? 'rec-high rec-card' : 
                rec.priority === 'Средний' ? 'rec-medium rec-card' : 
                'rec-low rec-card'
              }
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
    </div>
  );
};
