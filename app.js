// app.js - Основной файл приложения

// Инициализация Lucide иконок
lucide.createIcons();

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
    setLogData(demoLogData);
    handleAnalyzeData(demoLogData);
  }, []);
  
  // Парсинг и анализ данных
  const handleAnalyzeData = (inputData) => {
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
    const filtered = applyFiltersToData(parsedData, filterOptions);
    setFilteredData(filtered);
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
    exportReport(format);
  };
  
  // Генерация расширенных рекомендаций с использованием API нейросети
  const handleGenerateAIRecommendations = () => {
    generateAIRecommendations(apiKeys, parsedData, (aiRecs) => {
      setRecommendations(prev => [...prev, ...aiRecs]);
    });
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
        {/* Панель дашборда */}
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
        
        {/* Вкладка журнала */}
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
        
        {/* Вкладка аналитики */}
        {activeTab === 'analytics' && (
          <Analytics 
            equipmentStats={equipmentStats}
            eventTypeStats={eventTypeStats}
            timelineData={timelineData}
            handleExportReport={handleExportReport}
          />
        )}
        
        {/* Вкладка настроек */}
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

// Рендеринг приложения в DOM
ReactDOM.render(<App />, document.getElementById('root'));
