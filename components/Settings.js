// components/Settings.js - Компонент для настроек пользователя

// Импортируем иконки из Lucide
const {
    Save,
    Key,
    Bell,
    Clock,
    Database,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Settings as SettingsIcon
} = window.lucide;

// Делаем Settings доступным глобально через window
window.Settings = ({ 
    apiKeys, 
    setApiKeys, 
    handleSaveApiKeys,
    analysisSettings,
    setAnalysisSettings,
    handleSaveAnalysisSettings
}) => {
    // Обработка ошибок при отсутствии данных
    if (!apiKeys || !analysisSettings) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="text-lg font-medium">Ошибка загрузки настроек</h3>
                </div>
                <p className="mt-2 text-red-500">
                    Не удалось загрузить настройки. Пожалуйста, проверьте подключение и попробуйте снова.
                </p>
            </div>
        );
    }

    // Компонент для отображения API ключей
    const ApiKeysSection = () => (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900">API Ключи</h3>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        OpenAI API Key
                    </label>
                    <input
                        type="password"
                        value={apiKeys.openai || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="sk-..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Anthropic API Key
                    </label>
                    <input
                        type="password"
                        value={apiKeys.anthropic || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="sk-ant-..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cohere API Key
                    </label>
                    <input
                        type="password"
                        value={apiKeys.cohere || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, cohere: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="..."
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSaveApiKeys}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Save className="w-4 h-4" />
                        Сохранить ключи
                    </button>
                </div>
            </div>
        </div>
    );

    // Компонент для отображения настроек анализа
    const AnalysisSettingsSection = () => (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <SettingsIcon className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900">Настройки анализа</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Интервал обновления (минуты)
                    </label>
                    <input
                        type="number"
                        value={analysisSettings.updateInterval || 5}
                        onChange={(e) => setAnalysisSettings({ 
                            ...analysisSettings, 
                            updateInterval: parseInt(e.target.value) || 5 
                        })}
                        min="1"
                        max="60"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Автоматические рекомендации
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={analysisSettings.autoRecommendations || false}
                            onChange={(e) => setAnalysisSettings({ 
                                ...analysisSettings, 
                                autoRecommendations: e.target.checked 
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500">
                            Включить автоматическую генерацию рекомендаций
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Уведомления
                    </label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={analysisSettings.notifications.email || false}
                                onChange={(e) => setAnalysisSettings({ 
                                    ...analysisSettings, 
                                    notifications: {
                                        ...analysisSettings.notifications,
                                        email: e.target.checked
                                    }
                                })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-500">Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={analysisSettings.notifications.telegram || false}
                                onChange={(e) => setAnalysisSettings({ 
                                    ...analysisSettings, 
                                    notifications: {
                                        ...analysisSettings.notifications,
                                        telegram: e.target.checked
                                    }
                                })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-500">Telegram</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Хранение истории
                    </label>
                    <select
                        value={analysisSettings.historyRetention || '30'}
                        onChange={(e) => setAnalysisSettings({ 
                            ...analysisSettings, 
                            historyRetention: e.target.value 
                        })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="7">7 дней</option>
                        <option value="30">30 дней</option>
                        <option value="90">90 дней</option>
                        <option value="365">1 год</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSaveAnalysisSettings}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Save className="w-4 h-4" />
                        Сохранить настройки
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Настройки</h2>
            
            <div className="grid grid-cols-1 gap-6">
                <ApiKeysSection />
                <AnalysisSettingsSection />
            </div>
        </div>
    );
};
