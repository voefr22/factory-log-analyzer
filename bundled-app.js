// bundled-app.js

// Проверка наличия необходимых библиотек
console.log('Инициализация приложения...');
console.log('Проверка библиотек:');
console.log('- React:', !!window.React);
console.log('- ReactDOM:', !!window.ReactDOM);
console.log('- Recharts:', !!window.Recharts);
console.log('- lucide:', !!window.lucide);

// Инициализация Lucide иконок
if (window.lucide && window.lucide.createIcons) {
  window.lucide.createIcons();
}

// Компоненты для Recharts и иконки для всего приложения
const AppComponents = {};

// Только если Recharts доступен, инициализируем его компоненты
if (window.Recharts) {
  AppComponents.Recharts = {
    ResponsiveContainer: window.Recharts.ResponsiveContainer,
    BarChart: window.Recharts.BarChart,
    Bar: window.Recharts.Bar,
    PieChart: window.Recharts.PieChart,
    Pie: window.Recharts.Pie,
    Cell: window.Recharts.Cell,
    LineChart: window.Recharts.LineChart,
    Line: window.Recharts.Line,
    XAxis: window.Recharts.XAxis,
    YAxis: window.Recharts.YAxis,
    CartesianGrid: window.Recharts.CartesianGrid,
    Tooltip: window.Recharts.Tooltip,
    Legend: window.Recharts.Legend
  };
}

// Только если lucide доступен, инициализируем его иконки
if (window.lucide) {
  AppComponents.Lucide = {
    AlertTriangle: window.lucide.AlertTriangle,
    TrendingUp: window.lucide.TrendingUp,
    Database: window.lucide.Database,
    Clock: window.lucide.Clock,
    Search: window.lucide.Search,
    Filter: window.lucide.Filter,
    ArrowUpDown: window.lucide.ArrowUpDown,
    Save: window.lucide.Save,
    Download: window.lucide.Download,
    Printer: window.lucide.Printer,
    Settings: window.lucide.Settings,
    Bell: window.lucide.Bell,
    Key: window.lucide.Key,
    AlertCircle: window.lucide.AlertCircle
  };
}

// Общие константы
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000', '#82ca9d'];

// Компонент Dashboard
const Dashboard = ({ parsedData, equipmentStats, eventTypeStats, timelineData, recommendations, handleGenerateAIRecommendations }) => {
  // Используем иконки и компоненты через AppComponents
  const { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = AppComponents.Recharts || {};
  const { AlertTriangle, TrendingUp, Database, Clock } = AppComponents.Lucide || {};
  
  // Счетчики для статистики
  const repairsCount = parsedData.filter(item => item.eventType === 'Ремонт').length;
  const operationalCount = parsedData.filter(item => item.eventType === 'Работа').length;
  
  // Проверяем наличие необходимых компонентов
  const hasRecharts = !!ResponsiveContainer && !!BarChart;
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="card-title">Обзор журнала событий</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-blue stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Всего записей</h3>
              {Database && <Database size={20} color="#2563eb" />}
            </div>
            <p className="stat-card-value">{parsedData.length}</p>
          </div>
          
          <div className="stat-orange stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Ремонты</h3>
              {AlertTriangle && <AlertTriangle size={20} color="#ea580c" />}
            </div>
            <p className="stat-card-value">{repairsCount}</p>
          </div>
          
          <div className="stat-green stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">В работе</h3>
              {Clock && <Clock size={20} color="#059669" />}
            </div>
            <p className="stat-card-value">{operationalCount}</p>
          </div>
        </div>
      </div>
      
      {/* График секции (только если Recharts доступен) */}
      {hasRecharts ? (
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
      ) : (
        <div className="card">
          <h2 className="card-title">Информация по журналу</h2>
          <p>
            Проанализировано {parsedData.length} записей. 
            {eventTypeStats.length > 0 && " Основные типы событий: " + 
              eventTypeStats.map(item => item.name).join(", ")
            }
          </p>
        </div>
      )}
      
      {/* Секция рекомендаций */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Рекомендации</h2>
          <button 
            className="btn btn-purple flex items-center space-x-2"
            onClick={handleGenerateAIRecommendations}
          >
            {TrendingUp && <TrendingUp size={16} />}
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
                  {AlertTriangle && <AlertTriangle size={18} />}
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

// Компонент LogViewer
const LogViewer = ({ logData, parsedData, filteredData, filterOptions, handleLogDataChange, handleFilterChange, applyFilters, resetFilters, handleAnalyzeData }) => {
  const { Search, Filter, ArrowUpDown } = AppComponents.Lucide || {};
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="card-title">Ввод данных журнала</h2>
        <div className="mb-4">
          <textarea 
            value={logData}
            onChange={handleLogDataChange}
            className="form-textarea"
            placeholder="Вставьте журнал диспетчера здесь..."
          />
        </div>
        <div className="flex justify-end">
          <button 
            className="btn btn-primary"
            onClick={() => handleAnalyzeData(logData)}
          >
            Анализировать данные
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Журнал событий</h2>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Поиск..." 
              className="form-input px-3 py-2"
              value={filterOptions.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
            />
            <button 
              className="btn bg-blue-100 text-blue-600"
              onClick={applyFilters}
            >
              {Search && <Search size={20} />}
              <span className="ml-1">Поиск</span>
            </button>
            <button 
              className="btn bg-gray-100 text-gray-600"
              onClick={resetFilters}
            >
              {Filter && <Filter size={20} />}
              <span className="ml-1">Сброс</span>
            </button>
          </div>
        </div>
        
        {/* Фильтры и таблица данных */}
        <div className="table-container mt-4">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th>Дата</th>
                <th>Время</th>
                <th>Оборудование</th>
                <th>Тип события</th>
                <th>Сообщение</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.eventTime}</td>
                  <td>{entry.equipment || '-'}</td>
                  <td>
                    <span className={
                      entry.eventType === 'Ремонт' ? 'badge badge-red' : 
                      entry.eventType === 'Остановка' ? 'badge badge-orange' : 
                      entry.eventType === 'Работа' ? 'badge badge-green' : 
                      entry.eventType === 'Подготовка' ? 'badge badge-blue' : 
                      entry.eventType === 'Заливка' ? 'badge badge-yellow' : 
                      'badge badge-gray'
                    }>
                      {entry.eventType}
                    </span>
                  </td>
                  <td>{entry.message}</td>
                </tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 italic py-4">
                    Нет данных для отображения
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Компонент Analytics
const Analytics = ({ equipmentStats, eventTypeStats, timelineData, handleExportReport }) => {
  const { Download, Printer } = AppComponents.Lucide || {};
  
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Экспорт аналитики</h2>
          <div className="flex space-x-2">
            <button 
              className="btn btn-primary flex items-center space-x-2"
              onClick={() => handleExportReport('pdf')}
            >
              {Download && <Download size={16} />}
              <span>Экспорт PDF</span>
            </button>
            <button 
              className="btn btn-secondary flex items-center space-x-2"
              onClick={() => handleExportReport('print')}
            >
              {Printer && <Printer size={16} />}
              <span>Печать</span>
            </button>
          </div>
        </div>
        <p className="text-gray-600 mt-4">
          Экспортируйте данные аналитики для презентаций и отчетов.
        </p>
      </div>
      
      {/* Упрощенное содержимое для стабильности */}
      <div className="card">
        <h2 className="card-title">Аналитика обработанных данных</h2>
        <p>
          Обработано записей: {eventTypeStats.reduce((sum, item) => sum + item.value, 0)}
        </p>
        <p>
          Типы событий: {eventTypeStats.map(item => `${item.name} (${item.value})`).join(', ')}
        </p>
        <p>
          Оборудование: {equipmentStats.slice(0, 5).map(item => item.name).join(', ')}
          {equipmentStats.length > 5 ? ' и др.' : ''}
        </p>
      </div>
    </div>
  );
};

// Компонент Settings
const Settings = ({ apiKeys, setApiKeys, handleSaveApiKeys }) => {
  const { Save } = AppComponents.Lucide || {};
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="card-title">Настройки API нейросетей</h2>
        <p className="text-gray-600 mb-4">
          Для генерации расширенных рекомендаций и аналитики, введите ключи API. Ваши ключи хранятся локально и не передаются на сервер.
        </p>
        
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">OpenAI API ключ</label>
            <input
              type="password"
              value={apiKeys.openai}
              onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
              className="form-input"
              placeholder="sk-..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Anthropic API ключ</label>
            <input
              type="password"
              value={apiKeys.anthropic}
              onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
              className="form-input"
              placeholder="sk_ant-..."
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            className="btn btn-primary flex items-center space-x-2"
            onClick={handleSaveApiKeys}
          >
            {Save && <Save size={16} />}
            <span>Сохранить настройки</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Основной компонент приложения
const App = () => {
  const { useState, useEffect } = React;
  
  // Состояние приложения
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logData, setLogData] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    equipment: '',
    eventType: '',
    dateFrom: '',
    dateTo: '',
    searchText: ''
  });
  const [equipmentStats, setEquipmentStats] = useState([]);
  const [eventTypeStats, setEventTypeStats] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('apiKey_openai') || '',
    anthropic: localStorage.getItem('apiKey_anthropic') || '',
    cohere: localStorage.getItem('apiKey_cohere') || ''
  });
  
  // Для демонстрации загружаем пример данных при монтировании компонента
  useEffect(() => {
    try {
      console.log('Загрузка демо-данных...');
      setLogData(demoLogData);
      handleAnalyzeData(demoLogData);
    } catch (error) {
      console.error('Ошибка при загрузке демо-данных:', error);
    }
  }, []);
  
  // Парсинг и анализ данных
  const handleAnalyzeData = (inputData) => {
    try {
      console.log('Анализ данных...');
      const lines = inputData.split('\n').filter(line => line.trim());
      const parsed = lines.map(parseLogEntry).filter(entry => entry !== null);
      
      setParsedData(parsed);
      setFilteredData(parsed);
      
      // Анализируем данные для статистики и графиков
      const stats = analyzeData(parsed);
      
      setEquipmentStats(stats.equipmentStats);
      setEventTypeStats(stats.eventTypeStats);
      setTimelineData(stats.timelineData);
      
      // Генерация рекомендаций
      const recs = generateRecommendations(parsed);
      setRecommendations(recs);
    } catch (error) {
      console.error('Ошибка при анализе данных:', error);
    }
  };
  
  // Обработчик изменения текста лога
  const handleLogDataChange = (e) => {
    setLogData(e.target.value);
  };
  
  // Изменение значения фильтра
  const handleFilterChange = (name, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Применение фильтров
  const applyFilters = () => {
    try {
      const filtered = applyFiltersToData(parsedData, filterOptions);
      setFilteredData(filtered);
    } catch (error) {
      console.error('Ошибка при применении фильтров:', error);
    }
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    setFilterOptions({
      equipment: '',
      eventType: '',
      dateFrom: '',
      dateTo: '',
      searchText: ''
    });
    
    setFilteredData(parsedData);
  };
  
  // Сохранение настроек API ключей
  const handleSaveApiKeys = () => {
    localStorage.setItem('apiKey_openai', apiKeys.openai || '');
    localStorage.setItem('apiKey_anthropic', apiKeys.anthropic || '');
    localStorage.setItem('apiKey_cohere', apiKeys.cohere || '');
    
    alert('API ключи сохранены');
  };
  
  // Экспорт отчета
  const handleExportReport = (format) => {
    try {
      exportReport(format);
    } catch (error) {
      console.error('Ошибка при экспорте отчета:', error);
      alert('Произошла ошибка при экспорте отчета: ' + error.message);
    }
  };
  
  // Генерация расширенных рекомендаций с использованием API нейросети
  const handleGenerateAIRecommendations = () => {
    try {
      generateAIRecommendations(apiKeys, parsedData, (aiRecs) => {
        setRecommendations(prev => [...prev, ...aiRecs]);
      });
    } catch (error) {
      console.error('Ошибка при генерации AI-рекомендаций:', error);
      alert('Произошла ошибка при генерации AI-рекомендаций: ' + error.message);
    }
  };
  
  return (
    <div>
      {/* Верхняя навигационная панель */}
      <header>
        <div className="header-container">
          <h1 className="app-title">ЗаводАналитикс</h1>
          <div className="nav-buttons">
            <button 
              className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Дашборд
            </button>
            <button 
              className={`nav-button ${activeTab === 'log' ? 'active' : ''}`}
              onClick={() => setActiveTab('log')}
            >
              Журнал
            </button>
            <button 
              className={`nav-button ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Аналитика
            </button>
            <button 
              className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Настройки
            </button>
          </div>
        </div>
      </header>
      
      {/* Основное содержимое */}
      <main>
        {activeTab === 'dashboard' && (
          <Dashboard 
            parsedData={parsedData}
            equipmentStats={equipmentStats}
            eventTypeStats={eventTypeStats}
            timelineData={timelineData}
            recommendations={recommendations}
            handleGenerateAIRecommendations={handleGenerateAIRecommendations}
          />
        )}
        
        {activeTab === 'log' && (
          <LogViewer 
            logData={logData}
            parsedData={parsedData}
            filteredData={filteredData}
            filterOptions={filterOptions}
            handleLogDataChange={handleLogDataChange}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
            handleAnalyzeData={handleAnalyzeData}
          />
        )}
        
        {activeTab === 'analytics' && (
          <Analytics 
            equipmentStats={equipmentStats}
            eventTypeStats={eventTypeStats}
            timelineData={timelineData}
            handleExportReport={handleExportReport}
          />
        )}
        
        {activeTab === 'settings' && (
          <Settings 
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
            handleSaveApiKeys={handleSaveApiKeys}
          />
        )}
      </main>
    </div>
  );
};

// Рендеринг приложения
window.addEventListener('DOMContentLoaded', function() {
  try {
    ReactDOM.render(<App />, document.getElementById('root'));
    console.log('Приложение успешно запущено!');
  } catch (error) {
    console.error('Ошибка при рендеринге приложения:', error);
    document.getElementById('error').style.display = 'block';
    document.getElementById('error').innerHTML = 
      '<h3>Ошибка при рендеринге приложения:</h3>' +
      '<button onclick="this.parentNode.style.display=\'none\'">×</button>' +
      '<p>' + error.message + '</p>';
  }
});
