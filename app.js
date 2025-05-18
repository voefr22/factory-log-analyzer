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
      setLogData(demoLogData);
      handleAnalyzeData(demoLogData);
    } catch (error) {
      console.error('Ошибка при загрузке демо-данных:', error);
      document.getElementById('error').style.display = 'block';
      document.getElementById('error').innerHTML = 
          '<h3>Произошла ошибка:</h3><p>' + error.message + '</p>';
    }
  }, []);
  
  // Парсинг и анализ данных
  const handleAnalyzeData = (inputData) => {
    try {
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
      document.getElementById('error').style.display = 'block';
      document.getElementById('error').innerHTML = 
          '<h3>Произошла ошибка при анализе данных:</h3><p>' + error.message + '</p>';
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
      document.getElementById('error').style.display = 'block';
      document.getElementById('error').innerHTML = 
          '<h3>Произошла ошибка при фильтрации:</h3><p>' + error.message + '</p>';
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
    try {
      localStorage.setItem('apiKey_openai', apiKeys.openai || '');
      localStorage.setItem('apiKey_anthropic', apiKeys.anthropic || '');
      localStorage.setItem('apiKey_cohere', apiKeys.cohere || '');
      
      // Показываем уведомление об успешном сохранении
      const notification = document.createElement('div');
      notification.className = 'notification success';
      notification.textContent = 'API ключи успешно сохранены';
      document.body.appendChild(notification);
      
      // Удаляем уведомление через 3 секунды
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (error) {
      console.error('Ошибка при сохранении API ключей:', error);
      document.getElementById('error').style.display = 'block';
      document.getElementById('error').innerHTML = 
          '<h3>Произошла ошибка при сохранении настроек:</h3><p>' + error.message + '</p>';
    }
  };
  
  // Экспорт отчета
  const handleExportReport = (format) => {
    try {
      exportReport(format);
    } catch (error) {
      console.error('Ошибка при экспорте отчета:', error);
      document.getElementById('error').style.display = 'block';
      document.getElementById('error').innerHTML = 
          '<h3>Произошла ошибка при экспорте:</h3><p>' + error.message + '</p>';
    }
  };
  
  // Генерация расширенных рекомендаций с использованием API нейросети
  const handleGenerateAIRecommendations = async () => {
    try {
      // Проверяем наличие API ключей
      if (!apiKeys.openai && !apiKeys.anthropic && !apiKeys.cohere) {
        throw new Error('Необходимо указать хотя бы один API ключ в настройках');
      }
      
      // Показываем индикатор загрузки
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'loading-indicator';
      loadingIndicator.textContent = 'Генерация рекомендаций...';
      document.body.appendChild(loadingIndicator);
      
      // Генерируем рекомендации
      const aiRecs = await generateAIRecommendations(apiKeys, parsedData);
      
      // Обновляем список рекомендаций
      setRecommendations(prev => [...prev, ...aiRecs]);
      
      // Удаляем индикатор загрузки
      loadingIndicator.remove();
      
      // Показываем уведомление об успехе
      const notification = document.createElement('div');
      notification.className = 'notification success';
      notification.textContent = 'Рекомендации успешно сгенерированы';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (error) {
      console.error('Ошибка при генерации рекомендаций:', error);
      document.getElementById('error').style.display = 'block';
      document.getElementById('error').innerHTML = 
          '<h3>Произошла ошибка при генерации рекомендаций:</h3><p>' + error.message + '</p>';
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
        {/* Условный рендеринг активного компонента */}
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

// Безопасный рендеринг приложения с обработкой ошибок
try {
  ReactDOM.render(<App />, document.getElementById('root'));
} catch (error) {
  console.error('Ошибка при рендеринге приложения:', error);
  document.getElementById('error').style.display = 'block';
  document.getElementById('error').innerHTML = 
      '<h3>Произошла ошибка при рендеринге приложения:</h3><p>' + error.message + '</p>';
}
