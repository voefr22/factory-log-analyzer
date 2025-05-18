// components/Settings.js - Компонент для настроек пользователя

// Получаем иконки из lucide через глобальную переменную window
const { 
    Save, Bell, Clock, Database, Key, AlertCircle, Settings as SettingsIcon 
} = window.lucide;

// Делаем компонент Settings доступным глобально
window.Settings = ({ 
    apiKeys, 
    setApiKeys, 
    handleSaveApiKeys,
    analysisSettings,
    setAnalysisSettings,
    handleSaveAnalysisSettings
}) => {
    // Проверка наличия необходимых данных
    if (!apiKeys || !analysisSettings) {
        return (
            <div className="error-state">
                <AlertCircle size={24} className="text-red-500" />
                <p>Отсутствуют необходимые данные для отображения</p>
            </div>
        );
    }

    // Компонент настроек API ключей
    const ApiKeysSection = () => (
        <div className="card">
            <h2 className="card-title">Настройки API нейросетей</h2>
            <p className="text-gray-600 mb-4">
                Для генерации расширенных рекомендаций и аналитики, введите ключи API. 
                Ваши ключи хранятся локально и не передаются на сервер.
            </p>
            
            <div className="space-y-4">
                <div className="form-group">
                    <label className="form-label">OpenAI API ключ</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={apiKeys.openai}
                            onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                            className="form-input pl-8"
                            placeholder="sk-..."
                        />
                        <Key size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                
                <div className="form-group">
                    <label className="form-label">Anthropic API ключ</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={apiKeys.anthropic}
                            onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
                            className="form-input pl-8"
                            placeholder="sk_ant-..."
                        />
                        <Key size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                
                <div className="form-group">
                    <label className="form-label">Cohere API ключ</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={apiKeys.cohere || ''}
                            onChange={(e) => setApiKeys(prev => ({ ...prev, cohere: e.target.value }))}
                            className="form-input pl-8"
                            placeholder="ck-..."
                        />
                        <Key size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>
            
            <div className="mt-6">
                <button 
                    className="btn btn-primary flex items-center space-x-2"
                    onClick={handleSaveApiKeys}
                >
                    <Save size={16} />
                    <span>Сохранить настройки</span>
                </button>
            </div>
        </div>
    );

    // Компонент настроек анализа
    const AnalysisSettingsSection = () => (
        <div className="card">
            <h2 className="card-title">Настройки анализа</h2>
            
            <div className="space-y-6">
                <div className="form-group">
                    <label className="form-label">Интервал обновления (минуты)</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={analysisSettings.updateInterval}
                            onChange={(e) => setAnalysisSettings(prev => ({ 
                                ...prev, 
                                updateInterval: parseInt(e.target.value) || 0 
                            }))}
                            className="form-input pl-8"
                            min="1"
                            max="60"
                        />
                        <Clock size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Автоматические рекомендации</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={analysisSettings.autoRecommendations}
                            onChange={(e) => setAnalysisSettings(prev => ({ 
                                ...prev, 
                                autoRecommendations: e.target.checked 
                            }))}
                            className="form-checkbox"
                        />
                        <span className="text-gray-700">Включить автоматическую генерацию рекомендаций</span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Уведомления</label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={analysisSettings.notifications.email}
                                onChange={(e) => setAnalysisSettings(prev => ({ 
                                    ...prev, 
                                    notifications: {
                                        ...prev.notifications,
                                        email: e.target.checked
                                    }
                                }))}
                                className="form-checkbox"
                            />
                            <span className="text-gray-700">Email уведомления</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={analysisSettings.notifications.telegram}
                                onChange={(e) => setAnalysisSettings(prev => ({ 
                                    ...prev, 
                                    notifications: {
                                        ...prev.notifications,
                                        telegram: e.target.checked
                                    }
                                }))}
                                className="form-checkbox"
                            />
                            <span className="text-gray-700">Telegram уведомления</span>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Хранение истории</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={analysisSettings.historyRetention}
                            onChange={(e) => setAnalysisSettings(prev => ({ 
                                ...prev, 
                                historyRetention: parseInt(e.target.value) || 0 
                            }))}
                            className="form-input pl-8"
                            min="1"
                            max="365"
                        />
                        <Database size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Количество дней хранения истории</p>
                </div>
            </div>

            <div className="mt-6">
                <button 
                    className="btn btn-primary flex items-center space-x-2"
                    onClick={handleSaveAnalysisSettings}
                >
                    <Save size={16} />
                    <span>Сохранить настройки</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <ApiKeysSection />
            <AnalysisSettingsSection />
        </div>
    );
};
