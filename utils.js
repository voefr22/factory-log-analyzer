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
