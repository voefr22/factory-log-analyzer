// components/LogViewer.js - Компонент для просмотра и фильтрации логов

// Получаем иконки из lucide через глобальную переменную window
const { 
    Search, Filter, ArrowUpDown, X, Calendar, Clock,
    AlertCircle, CheckCircle2, XCircle, RefreshCw
} = window.lucide;

// Делаем компонент LogViewer доступным глобально
window.LogViewer = ({ 
    logData, 
    parsedData, 
    filteredData, 
    filterOptions, 
    handleLogDataChange, 
    handleFilterChange, 
    applyFilters, 
    resetFilters, 
    handleAnalyzeData 
}) => {
    // Проверка наличия необходимых данных
    if (!logData || !parsedData || !filteredData) {
        return (
            <div className="error-state">
                <AlertCircle size={24} className="text-red-500" />
                <p>Отсутствуют необходимые данные для отображения</p>
            </div>
        );
    }

    // Функция для определения цвета бейджа в зависимости от типа события
    const getEventTypeBadgeColor = (type) => {
        switch (type) {
            case 'Ремонт': return 'badge-red';
            case 'Остановка': return 'badge-orange';
            case 'Работа': return 'badge-green';
            case 'Подготовка': return 'badge-blue';
            case 'Заливка': return 'badge-yellow';
            default: return 'badge-gray';
        }
    };

    // Компонент секции фильтров
    const FilterSection = () => (
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
                    <div className="relative">
                        <input 
                            type="date" 
                            className="form-input pl-8"
                            value={filterOptions.dateFrom}
                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        />
                        <Calendar size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                
                <div className="form-group">
                    <label className="form-label">Дата до</label>
                    <div className="relative">
                        <input 
                            type="date" 
                            className="form-input pl-8"
                            value={filterOptions.dateTo}
                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        />
                        <Calendar size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );

    // Компонент таблицы данных
    const DataTable = () => (
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
                        <tr key={index} className="hover:bg-gray-50">
                            <td>{entry.date}</td>
                            <td>{entry.eventTime}</td>
                            <td>{entry.equipment || '-'}</td>
                            <td>
                                <span className={`badge ${getEventTypeBadgeColor(entry.eventType)}`}>
                                    {entry.eventType}
                                </span>
                            </td>
                            <td className="max-w-md truncate">{entry.message}</td>
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
    );

    return (
        <div className="space-y-6">
            {/* Секция ввода данных */}
            <div className="card">
                <h2 className="card-title">Ввод данных журнала</h2>
                <div className="mb-4">
                    <textarea 
                        value={logData}
                        onChange={handleLogDataChange}
                        className="form-textarea"
                        placeholder="Вставьте журнал диспетчера здесь..."
                        rows={6}
                    />
                </div>
                <div className="flex justify-end">
                    <button 
                        className="btn btn-primary flex items-center space-x-2"
                        onClick={() => handleAnalyzeData(logData)}
                    >
                        <RefreshCw size={16} />
                        <span>Анализировать данные</span>
                    </button>
                </div>
            </div>
            
            {/* Секция просмотра данных */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Журнал событий</h2>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Поиск..." 
                                className="form-input pl-8"
                                value={filterOptions.searchText}
                                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                            />
                            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button 
                            className="btn btn-blue flex items-center space-x-2"
                            onClick={applyFilters}
                        >
                            <Filter size={16} />
                            <span>Применить</span>
                        </button>
                        <button 
                            className="btn btn-gray flex items-center space-x-2"
                            onClick={resetFilters}
                        >
                            <X size={16} />
                            <span>Сбросить</span>
                        </button>
                    </div>
                </div>
                
                <FilterSection />
                <DataTable />
            </div>
        </div>
    );
};
