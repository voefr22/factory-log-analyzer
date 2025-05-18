// components/LogViewer.js - Компонент для просмотра и фильтрации логов

// Импортируем иконки из Lucide
const {
    Search,
    Filter,
    ArrowUpDown,
    X,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    RefreshCw
} = window.lucide;

// Делаем LogViewer доступным глобально через window
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
    // Обработка ошибок при отсутствии данных
    if (!logData || !parsedData) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="text-lg font-medium">Ошибка загрузки данных</h3>
                </div>
                <p className="mt-2 text-red-500">
                    Не удалось загрузить данные журнала. Пожалуйста, проверьте подключение и попробуйте снова.
                </p>
            </div>
        );
    }

    // Функция для определения цвета бейджа в зависимости от типа события
    const getEventTypeBadgeColor = (type) => {
        switch (type) {
            case 'Ремонт': return 'bg-red-100 text-red-800';
            case 'Работа': return 'bg-green-100 text-green-800';
            case 'Предупреждение': return 'bg-yellow-100 text-yellow-800';
            case 'Ошибка': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Компонент для отображения фильтров
    const FilterSection = () => (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Фильтры</h3>
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                    <RefreshCw className="w-4 h-4" />
                    Сбросить
                </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Фильтр по оборудованию */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Оборудование
                    </label>
                    <select
                        value={filterOptions.equipment || ''}
                        onChange={(e) => handleFilterChange('equipment', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Все</option>
                        {Array.from(new Set(parsedData.map(item => item.equipment))).map(equipment => (
                            <option key={equipment} value={equipment}>{equipment}</option>
                        ))}
                    </select>
                </div>

                {/* Фильтр по типу события */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Тип события
                    </label>
                    <select
                        value={filterOptions.eventType || ''}
                        onChange={(e) => handleFilterChange('eventType', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Все</option>
                        {Array.from(new Set(parsedData.map(item => item.eventType))).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Фильтр по дате */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата начала
                    </label>
                    <input
                        type="date"
                        value={filterOptions.startDate || ''}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата окончания
                    </label>
                    <input
                        type="date"
                        value={filterOptions.endDate || ''}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={applyFilters}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Применить фильтры
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопка анализа */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Просмотр журнала</h2>
                <button
                    onClick={handleAnalyzeData}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Анализировать данные
                </button>
            </div>

            {/* Ввод данных */}
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ввод данных журнала</h3>
                <textarea
                    value={logData}
                    onChange={(e) => handleLogDataChange(e.target.value)}
                    placeholder="Вставьте данные журнала здесь..."
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={10}
                />
            </div>

            {/* Фильтры */}
            <FilterSection />

            {/* Таблица данных */}
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Результаты</h3>
                {filteredData && filteredData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Дата
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Оборудование
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Тип события
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Описание
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.equipment}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEventTypeBadgeColor(item.eventType)}`}>
                                                {item.eventType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Нет данных для отображения</p>
                    </div>
                )}
            </div>
        </div>
    );
};
