// app.js - Основной файл приложения

// Инициализация Lucide иконок (если доступно)
if (window.lucide && window.lucide.createIcons) {
  window.lucide.createIcons();
}

// Сообщение об инициализации приложения
console.log('Инициализация приложения...');
console.log('Проверка наличия необходимых библиотек:');
console.log('- React:', !!window.React);
console.log('- ReactDOM:', !!window.ReactDOM);
console.log('- Recharts:', !!window.Recharts);
console.log('- lucide:', !!window.lucide);
console.log('- Babel:', !!window.Babel);

// Основной компонент приложения
const App = () => {
  const { useState, useEffect, useCallback } = React;
  
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
  const [analysisSettings, setAnalysisSettings] = useState({
    updateInterval: parseInt(localStorage.getItem('updateInterval')) || 5,
    autoRecommendations: localStorage.getItem('autoRecommendations') === 'true',
    notifications: {
      email: localStorage.getItem('notifyEmail') === 'true',
      telegram: localStorage.getItem('notifyTelegram') === 'true'
    },
    historyRetention: parseInt(localStorage.getItem('historyRetention')) || 30
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Загрузка сохраненных данных при монтировании
  useEffect(() => {
    try {
      const savedApiKeys = localStorage.getItem('apiKeys');
      const savedAnalysisSettings = localStorage.getItem('analysisSettings');
      
      if (savedApiKeys) {
        setApiKeys(JSON.parse(savedApiKeys));
      }
      if (savedAnalysisSettings) {
        setAnalysisSettings(JSON.parse(savedAnalysisSettings));
      }
    } catch (error) {
      console.error('Ошибка при загрузке сохраненных данных:', error);
      setError('Не удалось загрузить сохраненные настройки');
    }
  }, []);
  
  // Загрузка демо-данных
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Загрузка демо-данных...');
        setLogData(demoLogData);
        await handleAnalyzeData(demoLogData);
      } catch (error) {
        console.error('Ошибка при загрузке демо-данных:', error);
        setError({
          title: 'Ошибка при загрузке демо-данных',
          message: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    loadDemoData();
  }, []);
  
  // Функции-обработчики
  const handleAnalyzeData = useCallback(async (inputData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Анализ данных
      const parsed = parseLogData(inputData);
      setParsedData(parsed);
      
      // Применяем текущие фильтры
      const filtered = applyFiltersToData(parsed, filterOptions);
      setFilteredData(filtered);
      
      // Обновляем статистику
      const stats = calculateStats(parsed);
      setEquipmentStats(stats.equipment);
      setEventTypeStats(stats.eventTypes);
      setTimelineData(stats.timeline);
      
      // Если включены автоматические рекомендации
      if (analysisSettings.autoRecommendations) {
        await handleGenerateAIRecommendations();
      }
    } catch (error) {
      console.error('Ошибка при анализе данных:', error);
      setError({
        title: 'Ошибка при анализе данных',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [filterOptions, analysisSettings.autoRecommendations]);
  
  const handleLogDataChange = useCallback((e) => {
    setLogData(e.target.value);
  }, []);
  
  const handleFilterChange = useCallback((name, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const applyFilters = useCallback(() => {
    try {
      const filtered = applyFiltersToData(parsedData, filterOptions);
      setFilteredData(filtered);
    } catch (error) {
      console.error('Ошибка при применении фильтров:', error);
      setError({
        title: 'Ошибка при применении фильтров',
        message: error.message
      });
    }
  }, [parsedData, filterOptions]);
  
  const resetFilters = useCallback(() => {
    setFilterOptions({
      equipment: '',
      eventType: '',
      dateFrom: '',
      dateTo: '',
      searchText: ''
    });
    setFilteredData(parsedData);
  }, [parsedData]);
  
  const handleSaveApiKeys = useCallback(() => {
    try {
      localStorage.setItem('apiKey_openai', apiKeys.openai || '');
      localStorage.setItem('apiKey_anthropic', apiKeys.anthropic || '');
      localStorage.setItem('apiKey_cohere', apiKeys.cohere || '');
      alert('API ключи сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении API ключей:', error);
      setError({
        title: 'Ошибка при сохранении API ключей',
        message: error.message
      });
    }
  }, [apiKeys]);
  
  const handleSaveAnalysisSettings = useCallback(() => {
    try {
      localStorage.setItem('updateInterval', analysisSettings.updateInterval);
      localStorage.setItem('autoRecommendations', analysisSettings.autoRecommendations);
      localStorage.setItem('notifyEmail', analysisSettings.notifications.email);
      localStorage.setItem('notifyTelegram', analysisSettings.notifications.telegram);
      localStorage.setItem('historyRetention', analysisSettings.historyRetention);
      alert('Настройки анализа сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      setError({
        title: 'Ошибка при сохранении настроек',
        message: error.message
      });
    }
  }, [analysisSettings]);
  
  const handleExportReport = useCallback(async (format) => {
    try {
      setLoading(true);
      await exportReport(format);
    } catch (error) {
      console.error('Ошибка при экспорте отчета:', error);
      setError({
        title: 'Ошибка при экспорте отчета',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleGenerateAIRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const aiRecs = await generateAIRecommendations(apiKeys, parsedData);
      setRecommendations(prev => [...prev, ...aiRecs]);
    } catch (error) {
      console.error('Ошибка при генерации рекомендаций:', error);
      setError({
        title: 'Ошибка при генерации рекомендаций',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [apiKeys, parsedData]);
  
  // Компонент навигации
  const Navigation = () => (
    <header>
      <div className="header-container">
        <h1 className="app-title">ЗаводАналитикс</h1>
        <div className="nav-buttons">
          {['dashboard', 'log', 'analytics', 'settings'].map(tab => (
            <button 
              key={tab}
              className={`nav-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'dashboard' ? 'Дашборд' :
               tab === 'log' ? 'Журнал' :
               tab === 'analytics' ? 'Аналитика' : 'Настройки'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
  
  // Обработка ошибок
  if (error) {
    return (
      <div className="error-container">
        <h3>{error.title}</h3>
        <p>{error.message}</p>
        <button 
          className="btn btn-primary"
          onClick={() => setError(null)}
        >
          Закрыть
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <Navigation />
      
      <main>
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
            <p>Загрузка...</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <window.Dashboard 
            parsedData={parsedData}
            equipmentStats={equipmentStats}
            eventTypeStats={eventTypeStats}
            timelineData={timelineData}
            recommendations={recommendations}
            handleGenerateAIRecommendations={handleGenerateAIRecommendations}
          />
        )}
        
        {activeTab === 'log' && (
          <window.LogViewer 
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
          <window.Analytics 
            equipmentStats={equipmentStats}
            eventTypeStats={eventTypeStats}
            timelineData={timelineData}
            handleExportReport={handleExportReport}
          />
        )}
        
        {activeTab === 'settings' && (
          <window.Settings 
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
            handleSaveApiKeys={handleSaveApiKeys}
            analysisSettings={analysisSettings}
            setAnalysisSettings={setAnalysisSettings}
            handleSaveAnalysisSettings={handleSaveAnalysisSettings}
          />
        )}
      </main>
    </div>
  );
};

// Рендеринг приложения после загрузки компонентов
document.addEventListener('DOMContentLoaded', function() {
  // Проверка наличия всех необходимых компонентов
  const requiredComponents = ['Dashboard', 'LogViewer', 'Analytics', 'Settings'];
  const missingComponents = requiredComponents.filter(comp => !window[comp]);
  
  if (missingComponents.length > 0) {
    console.error('Ошибка: Не найдены следующие компоненты:', missingComponents);
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
      errorDiv.style.display = 'block';
      errorDiv.innerHTML = `
        <h3>Ошибка: Не найдены следующие компоненты:</h3>
        <ul>${missingComponents.map(comp => `<li>${comp}</li>`).join('')}</ul>
        <p>Проверьте, что все файлы компонентов правильно загружены.</p>
      `;
    }
    return;
  }
  
  // Рендеринг приложения
  try {
    console.log('Рендеринг приложения...');
    ReactDOM.render(<App />, document.getElementById('root'));
    console.log('Приложение успешно отрендерено!');
  } catch (error) {
    console.error('Ошибка при рендеринге приложения:', error);
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
      errorDiv.style.display = 'block';
      errorDiv.innerHTML = `
        <h3>Ошибка при рендеринге приложения:</h3>
        <p>${error.message}</p>
      `;
    }
  }
});
