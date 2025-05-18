// components/Settings.js - Компонент для настроек пользователя

// Получаем иконки из Lucide
const { Save, Bell, Clock, Database } = window.lucide;

const Settings = ({ apiKeys, setApiKeys, handleSaveApiKeys }) => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="card-title">Настройки API нейросетей</h2>
        <p className="text-gray-600 mb-4">
          Для генерации расширенных рекомендаций и аналитики, введите ключи API. Ваши ключи хранятся локально и не передаются на сервер.
        </p>
        
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">OpenAI API ключ</label>
            <input
              type="password"
              value={apiKeys.openai}
              onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
              className="form-input"
              placeholder="sk-..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Anthropic API ключ</label>
            <input
              type="password"
              value={apiKeys.anthropic}
              onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
              className="form-input"
              placeholder="sk_ant-..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Cohere API ключ</label>
            <input
              type="password"
              value={apiKeys.cohere || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, cohere: e.target.value }))}
              className="form-input"
              placeholder="ck-..."
            />
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
      
      <div className="card">
        <h2 className="card-title">Настройки анализа</h2>
        
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label flex items-center space-x-2">
              <Clock size={16} />
              <span>Интервал обновления (минуты)</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="15"
              min="1"
              max="60"
              defaultValue="15"
            />
          </div>
          
          <div className="form-group">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-5 w-5 text-blue-600" />
              <span>Автоматически генерировать рекомендации</span>
            </label>
          </div>
          
          <div className="form-group">
            <label className="flex items-center space-x-2">
              <Bell size={16} />
              <span>Отправлять уведомления о критических проблемах</span>
            </label>
            <div className="mt-2 ml-7">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Email</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Telegram</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label className="flex items-center space-x-2">
              <Database size={16} />
              <span>Сохранять историю журнала</span>
            </label>
            <div className="mt-2 ml-7">
              <label className="form-label text-sm">Глубина хранения истории (дни)</label>
              <input
                type="number"
                className="form-input mt-1"
                placeholder="30"
                min="1"
                max="365"
                defaultValue="30"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="btn btn-primary">
            Сохранить настройки
          </button>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Схема анализа данных</h2>
        
        <p className="text-gray-600 mb-4">
          Настройте схему анализа данных для повышения точности распознавания событий в журнале диспетчера.
        </p>
        
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Шаблоны событий</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Введите шаблоны для распознавания событий..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Каждый шаблон должен быть на новой строке. Используйте {event} для обозначения типа события.
            </p>
          </div>
          
          <div className="form-group">
            <label className="form-label">Исключения</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Введите исключения для фильтрации ложных срабатываний..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Приоритеты событий</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-24">Критический:</span>
                <input type="text" className="form-input" placeholder="Ремонт, Авария" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-24">Высокий:</span>
                <input type="text" className="form-input" placeholder="Остановка" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-24">Средний:</span>
                <input type="text" className="form-input" placeholder="Подготовка" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-24">Низкий:</span>
                <input type="text" className="form-input" placeholder="Информация" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="btn btn-primary">
            Сохранить схему
          </button>
        </div>
      </div>
    </div>
  );
};
