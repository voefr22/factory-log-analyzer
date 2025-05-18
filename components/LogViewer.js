// components/LogViewer.js - Компонент для просмотра и фильтрации логов

// Извлекаем компоненты из библиотеки Lucide
const { Search, Filter, ArrowUpDown } = lucide;

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
                {/* Создаем список уникального оборудования */}
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
        
        <div className="table-container">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th>
                  <div className="sort-button">
                    <span>Дата</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th>
                  <div className="sort-button">
                    <span>Время</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th>
                  <div className="sort-button">
                    <span>Оборудование</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th>
                  <div className="sort-button">
                    <span>Тип события</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th>Сообщение</th>
                <th>Источник</th>
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
                  <td>{entry.source}</td>
                </tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 italic py-4">
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
