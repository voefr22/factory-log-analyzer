// utils.js - Вспомогательные функции

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

// Генерация рекомендаций на основе анализа данных
function generateRecommendations(data) {
  // Массив для хранения рекомендаций
  const recs = [];
  
  // Анализ частоты ремонтов оборудования
  const repairCountByEquipment = {};
  
  data.forEach(entry => {
    if (entry.eventType === 'Ремонт' && entry.equipment) {
      repairCountByEquipment[entry.equipment] = (repairCountByEquipment[entry.equipment] || 0) + 1;
    }
  });
  
  // Выявление оборудования с частыми ремонтами (более 1 раза)
  const frequentRepairs = Object.entries(repairCountByEquipment)
    .filter(([_, count]) => count >= 2)
    .map(([equipment, count]) => ({ equipment, count }));
  
  if (frequentRepairs.length > 0) {
    frequentRepairs.forEach(item => {
      recs.push({
        priority: 'Высокий',
        text: `Оборудование ${item.equipment} ремонтировалось ${item.count} раз. Рекомендуется провести комплексную диагностику.`
      });
    });
  }
  
  // Анализ остановок
  const stopsByEquipment = {};
  
  data.forEach(entry => {
    if (entry.eventType === 'Остановка' && entry.equipment) {
      stopsByEquipment[entry.equipment] = (stopsByEquipment[entry.equipment] || 0) + 1;
    }
  });
  
  const frequentStops = Object.entries(stopsByEquipment)
    .filter(([_, count]) => count >= 2)
    .map(([equipment, count]) => ({ equipment, count }));
  
  if (frequentStops.length > 0) {
    frequentStops.forEach(item => {
      recs.push({
        priority: 'Средний',
        text: `Оборудование ${item.equipment} останавливалось ${item.count} раз. Проверьте стабильность работы.`
      });
    });
  }
  
  // Добавляем общие рекомендации
  if (recs.length === 0) {
    recs.push({
      priority: 'Низкий',
      text: 'Значительных проблем не выявлено. Рекомендуется плановое обслуживание оборудования.'
    });
  }
  
  return recs;
}

// Экспорт отчета в различных форматах
function exportReport(format) {
  alert(`Отчет будет экспортирован в формате: ${format}`);
  // Здесь должен быть код для экспорта в разных форматах
}

// Генерация расширенных рекомендаций с использованием API нейросети
function generateAIRecommendations(apiKeys, data, callback) {
  // Проверяем, есть ли ключи API
  if (!apiKeys.openai && !apiKeys.anthropic) {
    alert('Для использования ИИ-анализа необходимо добавить API ключи в настройках');
    return;
  }
  
  // Эмуляция запроса к API нейросети
  setTimeout(() => {
    const aiRecs = [
      {
        priority: 'Высокий',
        text: 'ИИ-анализ: На основе частоты ремонтов ЦМ-8 рекомендуется провести комплексную замену датчиков и проверку электрической системы. График плановых ремонтов может быть оптимизирован.'
      },
      {
        priority: 'Средний',
        text: 'ИИ-анализ: Выявлена корреляция между остановками ОЦЛ и проблемами с заливкой. Рекомендуется проверить систему подачи и увеличить частоту профилактики.'
      }
    ];
    
    callback(aiRecs);
  }, 1000);
  
  // В реальном приложении здесь будет код для обращения к API OpenAI или Anthropic
  /*
  // Пример запроса к API OpenAI
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKeys.openai}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          "role": "system",
          "content": "Ты опытный инженер по обслуживанию промышленного оборудования. Проанализируй данные журнала событий и выдай рекомендации."
        },
        {
          "role": "user",
          "content": JSON.stringify(data)
        }
      ]
    })
  })
  .then(response => response.json())
  .then(result => {
    // Обработка результатов от API
    const aiRecs = parseAIResponse(result);
    callback(aiRecs);
  })
  .catch(error => {
    console.error('Ошибка при запросе к API:', error);
    alert('Произошла ошибка при обращении к API нейросети');
  });
  */
}

// Функция для применения фильтров к данным
function applyFiltersToData(data, filters) {
  let filtered = [...data];
  
  if (filters.equipment) {
    filtered = filtered.filter(entry => 
      entry.equipment.toLowerCase().includes(filters.equipment.toLowerCase())
    );
  }
  
  if (filters.eventType) {
    filtered = filtered.filter(entry => 
      entry.eventType === filters.eventType
    );
  }
  
  if (filters.searchText) {
    filtered = filtered.filter(entry => 
      entry.message.toLowerCase().includes(filters.searchText.toLowerCase())
    );
  }
  
  if (filters.dateFrom) {
    // Преобразуем формат даты для сравнения
    const dateFrom = filters.dateFrom.split('.').reverse().join('-');
    filtered = filtered.filter(entry => {
      const entryDate = `20${entry.date.split('.')[1]}-${entry.date.split('.')[0]}`;
      return entryDate >= dateFrom;
    });
  }
  
  if (filters.dateTo) {
    // Преобразуем формат даты для сравнения
    const dateTo = filters.dateTo.split('.').reverse().join('-');
    filtered = filtered.filter(entry => {
      const entryDate = `20${entry.date.split('.')[1]}-${entry.date.split('.')[0]}`;
      return entryDate <= dateTo;
    });
  }
  
  return filtered;
}

// Функция для анализа данных и подготовки статистики
function analyzeData(data) {
  // Анализ оборудования
  const equipmentCounts = {};
  
  data.forEach(entry => {
    if (entry.equipment) {
      equipmentCounts[entry.equipment] = (equipmentCounts[entry.equipment] || 0) + 1;
    }
  });
  
  const equipmentData = Object.keys(equipmentCounts).map(key => ({
    name: key,
    value: equipmentCounts[key]
  })).sort((a, b) => b.value - a.value);
  
  // Анализ типов событий
  const eventTypeCounts = {};
  
  data.forEach(entry => {
    eventTypeCounts[entry.eventType] = (eventTypeCounts[entry.eventType] || 0) + 1;
  });
  
  const eventTypeData = Object.keys(eventTypeCounts).map(key => ({
    name: key,
    value: eventTypeCounts[key]
  }));
  
  // Данные для графика по дням
  const dateEventCounts = {};
  
  data.forEach(entry => {
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
    equipmentStats: equipmentData,
    eventTypeStats: eventTypeData,
    timelineData: timelineData
  };
}

// Примеры данных для демонстрации
const demoLogData = `[03.01, 21:03] Диспетчер: 21:00 ППО-2Начали подъём температуры.
[06.01, 09:02] Диспетчер: 9:00 ИЧТ-3Включена на сушку-спекание
[07.01, 13:30] Диспетчер: 13:25. ИЧТ-3 - замена токоведущего шланга.
[07.01, 15:09] Диспетчер: 15:05. Печь в работе.
[08.01, 21:39] +7 904 699-39-59: 19:00 -7:00плавильное отделение - в смене 1 машинист крана.
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
