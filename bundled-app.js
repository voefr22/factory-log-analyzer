// app.js - Упрощенная версия приложения ЗаводАналитикс

// Инициализация Lucide иконок
if (window.lucide && window.lucide.createIcons) {
  window.lucide.createIcons();
  console.log("Lucide иконки инициализированы");
}

// Доступ к компонентам из библиотек
const {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} = window.Recharts || {};

// Доступ к иконкам Lucide
const {
  AlertTriangle, TrendingUp, Database, Clock, Search, 
  Filter, ArrowUpDown, Save, Download, Printer, Settings
} = window.lucide || {};

// Цвета для графиков
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000', '#82ca9d'];

// Пример данных для журнала
const DEMO_LOG_DATA = `[03.01, 21:03] Диспетчер: 21:00 ППО-2 Начали подъём температуры.
[06.01, 09:02] Диспетчер: 9:00 ИЧТ-3 Включена на сушку-спекание
[07.01, 13:30] Диспетчер: 13:25. ИЧТ-3 - замена токоведущего шланга.
[07.01, 15:09] Диспетчер: 15:05. Печь в работе.
[08.01, 21:39] +7 904 699-39-59: 19:00 -7:00 плавильное отделение - в смене 1 машинист крана.
[08.01, 23:14] Диспетчер: 23:15. ОЦЛ БД - начали заливку (ДУ500v,ДУ1000v).
[08.01, 23:41] Диспетчер: 23:30. ЦМ-8 - ремонт крепления датчика на опускание лифта.
[08.01, 23:44] Диспетчер: 23:40. ЛЛ-2 - зацеп конвейера.
[08.01, 23:50] Диспетчер: 22:30-23:30. ЛЦ-2 - подготовка к работе.
[08.01, 23:58] Диспетчер: 0:00. В работе.
[09.01, 00:28] Диспетчер: 0:20. ЦМ-8 - нет перевода желобов.
[09.01, 00:50] Диспетчер: 0:50. В работе.
[09.01, 01:33] Диспетчер: 1:20. В работе.
[09.01, 01:33] Диспетчер: 1:30. ЛЦ-2 - промывка первичного бетоносмесителя.
[09.01, 01:36] Диспетчер: 22:30-1:00. Транспортная линия №2 - не снимается помеха на пульте управления конвейеров №5,6,7.
[09.01, 01:47] Диспетчер: 1:40. ОЦЛ - остановка заливки из-за ремонта трансферта.
[09.01, 02:47] Диспетчер: 2:45. В работе.`;

// Функция для парсинга строки журнала
function parseLogEntry(entry) {
  const regex = /\[(\d{2}\.\d{2}), (\d{2}:\d{2})\] ([^:]+): (.+)/;
  const match = entry.match(regex);
  
  if (match) {
    const message = match[4];
    
    // Попытка извлечь время события из сообщения
    const timeRegex = /^(\d{1,2}:\d{2})\s*(.*)/;
    const timeMatch = message.match(timeRegex);
    
    let eventTime = '';
    let cleanMessage = message;
    
    if (timeMatch) {
      eventTime = timeMatch[1];
      cleanMessage = timeMatch[2];
    }
    
    // Попытка извлечь оборудование и статус
    const equipmentRegex = /([А-ЯЁ]{2,}-\d+|[А-ЯЁ]{3,}\d*)/;
    const equipmentMatch = cleanMessage.match(equipmentRegex);
    
    let equipment = '';
    if (equipmentMatch) {
      equipment = equipmentMatch[0];
    }
    
    // Определение типа события
    let eventType = 'Информация';
    const lowerMsg = cleanMessage.toLowerCase();
    
    if (lowerMsg.includes('ремонт') || lowerMsg.includes('замена')) {
      eventType = 'Ремонт';
    } else if (lowerMsg.includes('не работает') || lowerMsg.includes('остановка')) {
      eventType = 'Остановка';
    } else if (lowerMsg.includes('в работе') || lowerMsg.includes('включена')) {
      eventType = 'Работа';
    } else if (lowerMsg.includes('подготовка')) {
      eventType = 'Подготовка';
    } else if (lowerMsg.includes('заливка')) {
      eventType = 'Заливка';
    }
    
    return {
      date: match[1],
      loggingTime: match[2],
      eventTime: eventTime || match[2],
      source: match[3],
      message: cleanMessage,
      equipment,
      eventType
    };
  }
  
  return null;
}

// Функция для анализа данных журнала
function analyzeLogData(entries) {
  // Анализ оборудования
  const equipmentCounts = {};
  entries.forEach(entry => {
    if (entry.equipment) {
      equipmentCounts[entry.equipment] = (equipmentCounts[entry.equipment] || 0) + 1;
    }
  });
  
  const equipmentStats = Object.keys(equipmentCounts).map(key => ({
    name: key,
    value: equipmentCounts[key]
  })).sort((a, b) => b.value - a.value);
  
  // Анализ типов событий
  const eventTypeCounts = {};
  entries.forEach(entry => {
    eventTypeCounts[entry.eventType] = (eventTypeCounts[entry.eventType] || 0) + 1;
  });
  
  const eventTypeStats = Object.keys(eventTypeCounts).map(key => ({
    name: key,
    value: eventTypeCounts[key]
  }));
  
  // Данные для графика по дням
  const dateEventCounts = {};
  entries.forEach(entry => {
    const date = entry.date;
    if (!dateEventCounts[date]) {
      dateEventCounts[date] = {
        date,
        'Ремонт': 0,
        'Остановка': 0,
        'Работа': 0,
        'Информация': 0,
        'Подготовка': 0,
        'Заливка': 0
      };
    }
    
    dateEventCounts[date][entry.eventType]++;
  });
  
  const timelineData = Object.values(dateEventCounts);
  
  return {
    equipmentStats,
    eventTypeStats,
    timelineData
  };
}

// Функция для генерации рекомендаций
function generateRecommendations(entries) {
  const recommendations = [];
  
  // Анализ частоты ремонтов оборудования
  const repairCountByEquipment = {};
  entries.forEach(entry => {
    if (entry.eventType === 'Ремонт' && entry.equipment) {
      repairCountByEquipment[entry.equipment] = (repairCountByEquipment[entry.equipment] || 0) + 1;
    }
  });
  
  // Выявление оборудования с частыми ремонтами
  const frequentRepairs = Object.entries(repairCountByEquipment)
    .filter(([_, count]) => count >= 2)
    .map(([equipment, count]) => ({ equipment, count }));
  
  if (frequentRepairs.length > 0) {
    frequentRepairs.forEach(item => {
      recommendations.push({
        priority: 'Высокий',
        text: `Оборудование ${item.equipment} ремонтировалось ${item.count} раз. Рекомендуется провести комплексную диагностику.`
      });
    });
  }
  
  // Анализ остановок
  const stopsByEquipment = {};
  entries.forEach(entry => {
    if (entry.eventType === 'Остановка' && entry.equipment) {
      stopsByEquipment[entry.equipment] = (stopsByEquipment[entry.equipment] || 0) + 1;
    }
  });
  
  const frequentStops = Object.entries(stopsByEquipment)
    .filter(([_, count]) => count >= 2)
    .map(([equipment, count]) => ({ equipment, count }));
  
  if (frequentStops.length > 0) {
    frequentStops.forEach(item => {
      recommendations.push({
        priority: 'Средний',
        text: `Оборудование ${item.equipment} останавливалось ${item.count} раз. Проверьте стабильность работы.`
      });
    });
  }
  
  // Добавляем общие рекомендации
  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'Низкий',
      text: 'Значительных проблем не выявлено. Рекомендуется плановое обслуживание оборудования.'
    });
  }
  
  return recommendations;
}

// Функция для экспорта отчета (заглушка)
function exportReport(format) {
  console.log(`Экспорт отчета в формате ${format}`);
  alert(`Отчет будет экспортирован в формате: ${format}`);
}

// Функция для эмуляции AI-рекомендаций
function generateAIRecommendations(apiKeys, data, callback) {
  setTimeout(() => {
    const aiRecs = [
      {
        priority: 'Высокий',
        text: 'ИИ-анализ: На основе частоты ремонтов ЦМ-8 рекомендуется провести комплексную замену датчиков и проверку электрической системы.'
      },
      {
        priority: 'Средний',
        text: 'ИИ-анализ: Выявлена корреляция между остановками ОЦЛ и проблемами с заливкой. Рекомендуется проверить систему подачи.'
      }
    ];
    
    callback(aiRecs);
  }, 1000);
}

// Функция для фильтрации данных
function applyFilters(entries, filters) {
  let filtered = [...entries];
  
  if (filters.equipment) {
    filtered = filtered.filter(entry => 
      entry.equipment && entry.equipment.toLowerCase().includes(filters.equipment.toLowerCase())
    );
  }
  
  if (filters.eventType) {
    filtered = filtered.filter(entry => entry.eventType === filters.eventType);
  }
  
  if (filters.searchText) {
    filtered = filtered.filter(entry => 
      entry.message.toLowerCase().includes(filters.searchText.toLowerCase())
    );
  }
  
  return filtered;
}

//
// Компоненты React
//

// Компонент Dashboard - показывает обзор и рекомендации
const Dashboard = ({ entries, stats, recommendations, onAIRecommendations }) => {
  const repairsCount = entries.filter(item => item.eventType === 'Ремонт').length;
  const operationalCount = entries.filter(item => item.eventType === 'Работа').length;
  
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
            <p className="stat-card-value">{entries.length}</p>
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
      
      {ResponsiveContainer && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* График типов событий за период */}
          <div className="card">
            <h2 className="card-title">События по дням</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={stats.timelineData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Ремонт" fill="#FF8042" />
                  <Bar dataKey="Остановка" fill="#FF0000" />
                  <Bar dataKey="Работа" fill="#00C49F" />
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
                    data={stats.equipmentStats.slice(0, 7)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.equipmentStats.slice(0, 7).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {!ResponsiveContainer && (
        <div className="card">
          <h2 className="card-title">Информация о событиях</h2>
          <p>
            В журнале найдено {entries.length} записей.
            {stats.eventTypeStats.length > 0 && (
              <>
                <br />
                Типы событий: {stats.eventTypeStats.map(item => `${item.name} (${item.value})`).join(', ')}.
              </>
            )}
            {stats.equipmentStats.length > 0 && (
              <>
                <br />
                Основное оборудование: {stats.equipmentStats.slice(0, 5).map(item => item.name).join(', ')}.
              </>
            )}
          </p>
        </div>
      )}
      
      {/* Секция рекомендаций */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Рекомендации</h2>
          <button 
            className="btn btn-purple flex items-center space-x-2"
            onClick={onAIRecommendations}
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

// Компонент LogViewer - показывает и фильтрует журнал
const LogViewer = ({ 
  logData, entries, filteredEntries, filters,
  onLogDataChange, onFilterChange, onApplyFilters, onResetFilters, onAnalyze 
}) => {
  const uniqueEquipment = [...new Set(entries.map(item => item.equipment).filter(Boolean))];
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="card-title">Ввод данных журнала</h2>
        <div className="mb-4">
          <textarea 
            value={logData}
            onChange={onLogDataChange}
            className="form-textarea"
            placeholder="Вставьте журнал диспетчера здесь..."
          />
        </div>
        <div className="flex justify-end">
          <button 
            className="btn btn-primary"
            onClick={() => onAnalyze(logData)}
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
              value={filters.searchText}
              onChange={(e) => onFilterChange('searchText', e.target.value)}
            />
            <button 
              className="btn bg-blue-100 text-blue-600"
              onClick={onApplyFilters}
            >
              {Search && <Search size={20} />}
              <span className="ml-1">Поиск</span>
            </button>
            <button 
              className="btn bg-gray-100 text-gray-600"
              onClick={onResetFilters}
            >
              {Filter && <Filter size={20} />}
              <span className="ml-1">Сброс</span>
            </button>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="form-group">
              <label className="form-label">Оборудование</label>
              <select 
                className="form-input"
                value={filters.equipment}
                onChange={(e) => onFilterChange('equipment', e.target.value)}
              >
                <option value="">Все</option>
                {uniqueEquipment.map(equip => (
                  <option key={equip} value={equip}>{equip}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Тип события</label>
              <select 
                className="form-input"
                value={filters.eventType}
                onChange={(e) => onFilterChange('eventType', e.target.value)}
              >
                <option value="">Все</option>
                <option value="Ремонт">Ремонт</option>
                <option value="Остановка">Остановка</option>
                <option value="Работа">Работа</option>
                <option value="Подготовка">Подготовка</option>
                <option value="Заливка">Заливка</option>
                <option value="Информация">Информация</option>
              </select>
            </div>
          </div>
        </div>
        
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
              {filteredEntries.map((entry, index) => (
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
              
              {filteredEntries.length === 0 && (
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

// Компонент Analytics - показывает данные аналитики и экспорт
const Analytics = ({ stats, onExportReport }) => {
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Экспорт аналитики</h2>
          <div className="flex space-x-2">
            <button 
              className="btn btn-primary flex items-center space-x-2"
              onClick={() => onExportReport('pdf')}
            >
              {Download && <Download size={16} />}
              <span>Экспорт PDF</span>
            </button>
            <button 
              className="btn btn-secondary flex items-center space-x-2"
              onClick={() => onExportReport('print')}
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
      
      {ResponsiveContainer && stats.eventTypeStats.length > 0 && (
        <div className="card">
          <h2 className="card-title">Распределение типов событий</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.eventTypeStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.eventTypeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {ResponsiveContainer && stats.timelineData.length > 0 && (
        <div className="card">
          <h2 className="card-title">Тренды событий по времени</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.timelineData}
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
      )}
      
      {!ResponsiveContainer && (
        <div className="card">
          <h2 className="card-title">Сводная статистика</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold">Типы событий:</h3>
              <ul className="list-disc ml-5">
                {stats.eventTypeStats.map((item, index) => (
                  <li key={index}>{item.name}: {item.value}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Основное оборудование:</h3>
              <ul className="list-disc ml-5">
                {stats.equipmentStats.slice(0, 7).map((item, index) => (
                  <li key={index}>{item.name}: {item.value} событий</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
