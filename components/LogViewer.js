// components/LogViewer.js - Компонент для просмотра и фильтрации логов

// Получаем иконки из глобальной переменной
const { Search, Filter, ArrowUpDown } = window.lucide;

const LogViewer = ({ logData, parsedData, filteredData, filterOptions, handleLogDataChange, handleFilterChange, applyFilters, resetFilters, handleAnalyzeData }) => {
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
            rows={10}
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
              <Search size={20} />
            </button>
            <button 
              className="btn bg-gray-100 text-gray-600"
              onClick={resetFilters}
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="form-group">
              <label className="form-label">Оборудование</label>
              <select 
                className="form-input"
                value={filterOptions.equipment}
                onChange={(e) => handleFilterChange('equipment', e.target.value)}
              >
                <option value="">Все</option>
                {[...new Set(parsedData.map(item => item.equipment).filter(Boolean))].map(equip => (
                  <option key={equip} value={equip}>{equip}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Тип события</label>
              <select 
                className="form-input"
                value={filterOptions.eventType}
                onChange={(e) => handleFilterChange('eventType', e.target.value)}
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
            
            <div className="form-group">
              <label className="form-label">Дата от</label>
              <input 
                type="date" 
                className="form-input"
                value={filterOptions.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Дата до</label>
              <input 
                type="date" 
                className="form-input"
                value={filterOptions.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="table-container mt-4">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">
                  <div className="sort-button">
                    <span>Дата</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-4 py-2">
                  <div className="sort-button">
                    <span>Время</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-4 py-2">
                  <div className="sort-button">
                    <span>Оборудование</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-4 py-2">
                  <div className="sort-button">
                    <span>Тип события</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-4 py-2">Сообщение</th>
                <th className="px-4 py-2">Источник</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.time}</td>
                  <td className="px-4 py-2">{item.equipment}</td>
                  <td className="px-4 py-2">
                    <span className={`badge badge-${getEventTypeBadgeColor(item.eventType)}`}>
                      {item.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-2">{item.message}</td>
                  <td className="px-4 py-2">{item.source}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
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

// Вспомогательная функция для определения цвета бейджа в зависимости от типа события
const getEventTypeBadgeColor = (eventType) => {
  switch(eventType) {
    case 'Ремонт': return 'red';
    case 'Остановка': return 'orange';
    case 'Работа': return 'green';
    case 'Подготовка': return 'blue';
    case 'Заливка': return 'yellow';
    default: return 'gray';
  }
};
