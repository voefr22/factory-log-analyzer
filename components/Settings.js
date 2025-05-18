// components/Settings.js - Компонент для настроек пользователя

// Извлекаем компоненты из библиотеки Lucide
const { Save } = lucide;

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
            <label className="form-label">Интервал обновления (минуты)</label>
            <input
              type="number"
              className="form-input"
              placeholder="15"
              min="1"
              max="60"
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
              <input type="checkbox" className="h-5 w-5 text-blue-600" />
              <span>Отправлять уведомления о критических проблемах</span>
            </label>
          </div>
          
          <div className="form-group">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-5 w-5 text-blue-600" defaultChecked />
              <span>Сохранять историю журнала</span>
            </label>
          </div>
          
          <div className="form-group">
            <label className="form-label">Глубина хранения истории (дни)</label>
            <input
              type="number"
              className="form-input"
              placeholder="30"
              min="1"
              max="365"
              defaultValue="30"
            />
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
            <label className="form-label">Шаблоны типов событий</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="form-input"
                  defaultValue="ремонт, замена, диагностика"
                  placeholder="Ключевые слова для ремонта"
                />
                <span className="badge badge-red">Ремонт</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="form-input"
                  defaultValue="остановка, не работает, отключено"
                  placeholder="Ключевые слова для остановки"
                />
                <span className="badge badge-orange">Остановка</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="form-input"
                  defaultValue="в работе, включена, запуск"
                  placeholder="Ключевые слова для работы"
                />
                <span className="badge badge-green">Работа</span>
              </div>
<div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="form-input"
                  defaultValue="подготовка, настройка, регулировка"
                  placeholder="Ключевые слова для подготовки"
                />
                <span className="badge badge-blue">Подготовка</span>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Распознавание оборудования</label>
            <textarea
              className="form-textarea h-32"
              defaultValue="ППО-1, ППО-2, ИЧТ-1, ИЧТ-2, ИЧТ-3, ЦМ-7, ЦМ-8, ЛЛ-1, ЛЛ-2, ЛЦ-1, ЛЦ-2, ЛЦ-3, ОЦЛ, ОУОЦ"
              placeholder="Введите список оборудования через запятую"
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">Для улучшения распознавания введите известные модели оборудования</p>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="btn btn-primary">
            Сохранить настройки схемы
          </button>
        </div>
      </div>
    </div>
  );
};
