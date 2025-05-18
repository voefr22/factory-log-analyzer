// app.js - Основной файл приложения

// Инициализация Lucide иконок (если доступно)
if (window.lucide && window.lucide.createIcons) {
  window.lucide.createIcons();
}

// Проверка наличия и доступности библиотек
if (!window.React) {
  console.error('React не загружен!');
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').innerHTML = '<h3>Произошла ошибка:</h3><p>Библиотека React не загружена</p>';
}

if (!window.ReactDOM) {
  console.error('ReactDOM не загружен!');
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').innerHTML = '<h3>Произошла ошибка:</h3><p>Библиотека ReactDOM не загружена</p>';
}

if (!window.Recharts) {
  console.error('Recharts не загружен!');
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').innerHTML = '<h3>Произошла ошибка:</h3><p>Библиотека Recharts не загружена</p>';
}

if (!window.lucide) {
  console.error('Lucide не загружен!');
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').innerHTML = '<h3>Произошла ошибка:</h3><p>Библиотека Lucide не загружена</p>';
}

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
    startDate: '',
    endDate: '',
    searchText: ''
  });
  const [equipmentStats, setEquipmentStats] = useState([]);
  const [eventTypeStats, setEventTypeStats] = useState({});
  const [timelineData, setTimelineData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    cohere: ''
  });
  const [analysisSettings, setAnalysisSettings] = useState({
    updateInterval: 5,
    autoRecommendations: false,
    notifications: {
      email: false,
      telegram: false
    },
    historyRetention: '30'
  });
  const [isLoading, setIsLoading] = useState(false);
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
  
  // Обработчики событий
  const handleLogDataChange = useCallback((data) => {
    setLogData(data);
    try {
      const parsed = parseLogData(data);
      setParsedData(parsed);
      setFilteredData(parsed);
      updateStats(parsed);
    } catch (error) {
      console.error('Ошибка при обработке данных журнала:', error);
      setError('Ошибка при обработке данных журнала');
    }
  }, []);
  
  const handleFilterChange = useCallback((key, value) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const applyFilters = useCallback(() => {
    try {
      const filtered = parsedData.filter(item => {
        const matchesEquipment = !filterOptions.equipment || item.equipment === filterOptions.equipment;
        const matchesEventType = !filterOptions.eventType || item.eventType === filterOptions.eventType;
        const matchesDate = (!filterOptions.startDate || new Date(item.timestamp) >= new Date(filterOptions.startDate)) &&
                          (!filterOptions.endDate || new Date(item.timestamp) <= new Date(filterOptions.endDate));
        const matchesSearch = !filterOptions.searchText || 
            item.description.toLowerCase().includes(filterOptions.searchText.toLowerCase());
        
        return matchesEquipment && matchesEventType && matchesDate && matchesSearch;
      });
      setFilteredData(filtered);
    } catch (error) {
      console.error('Ошибка при применении фильтров:', error);
      setError('Ошибка при применении фильтров');
    }
  }, [parsedData, filterOptions]);
  
  const resetFilters = useCallback(() => {
    setFilterOptions({
      equipment: '',
      eventType: '',
      startDate: '',
      endDate: '',
      searchText: ''
    });
    setFilteredData(parsedData);
  }, [parsedData]);
  
  const handleSaveApiKeys = useCallback(async () => {
    try {
      setIsLoading(true);
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
      setError(null);
    } catch (error) {
      console.error('Ошибка при сохранении API ключей:', error);
      setError('Не удалось сохранить API ключи');
    } finally {
      setIsLoading(false);
    }
  }, [apiKeys]);
  
  const handleSaveAnalysisSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      localStorage.setItem('analysisSettings', JSON.stringify(analysisSettings));
      setError(null);
    } catch (error) {
      console.error('Ошибка при сохранении настроек анализа:', error);
      setError('Не удалось сохранить настройки анализа');
    } finally {
      setIsLoading(false);
    }
  }, [analysisSettings]);
  
  const handleGenerateAIRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!apiKeys.openai && !apiKeys.anthropic && !apiKeys.cohere) {
        throw new Error('Необходимо указать хотя бы один API ключ');
      }
      
      // Здесь будет логика генерации рекомендаций
      const newRecommendations = await generateRecommendations(parsedData);
      setRecommendations(newRecommendations);
      setError(null);
    } catch (error) {
      console.error('Ошибка при генерации рекомендаций:', error);
      setError('Не удалось сгенерировать рекомендации');
    } finally {
      setIsLoading(false);
    }
  }, [parsedData, apiKeys]);
  
  const handleExportReport = useCallback(async (format) => {
    try {
      setIsLoading(true);
      // Здесь будет логика экспорта отчета
      await exportReport(format, {
        parsedData,
        equipmentStats,
        eventTypeStats,
        timelineData,
        recommendations
      });
      setError(null);
    } catch (error) {
      console.error('Ошибка при экспорте отчета:', error);
      setError('Не удалось экспортировать отчет');
    } finally {
      setIsLoading(false);
    }
  }, [parsedData, equipmentStats, eventTypeStats, timelineData, recommendations]);
  
  // Вспомогательные функции
  const updateStats = useCallback((data) => {
    try {
      // Обновление статистики по оборудованию
      const equipmentStats = calculateEquipmentStats(data);
      setEquipmentStats(equipmentStats);

      // Обновление статистики по типам событий
      const eventTypeStats = calculateEventTypeStats(data);
      setEventTypeStats(eventTypeStats);

      // Обновление данных для временной шкалы
      const timelineData = calculateTimelineData(data);
      setTimelineData(timelineData);
    } catch (error) {
      console.error('Ошибка при обновлении статистики:', error);
      setError('Ошибка при обновлении статистики');
    }
  }, []);
  
  // Компонент навигации
  const Navigation = () => (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ЗаводАналитикс</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Панель управления
              </button>
              <button
                onClick={() => setActiveTab('log')}
                className={`${
                  activeTab === 'log'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Журнал
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <BarChart2 className="w-5 h-5 mr-2" />
                Аналитика
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Settings className="w-5 h-5 mr-2" />
                Настройки
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <h3 class="text-lg font-medium">Ошибка</h3>
            </div>
            <p className="mt-2 text-red-500">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
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
            handleAnalyzeData={handleGenerateAIRecommendations}
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

// Безопасный рендеринг приложения с обработкой ошибок
try {
  ReactDOM.render(<App />, document.getElementById('root'));
} catch (error) {
  console.error('Ошибка при рендеринге приложения:', error);
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').innerHTML = 
      '<h3>Произошла ошибка при рендеринге приложения:</h3><p>' + error.message + '</p>';
}
