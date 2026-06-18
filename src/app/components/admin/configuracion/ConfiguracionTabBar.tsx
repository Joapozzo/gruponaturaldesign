'use client';

export type ConfiguracionTabId = 'integraciones' | 'envios' | 'precios' | 'datos-bancarios';

const tabs: Array<{ id: ConfiguracionTabId; label: string }> = [
  { id: 'integraciones', label: 'Integraciones' },
  { id: 'envios', label: 'Envíos' },
  { id: 'precios', label: 'Precios' },
  { id: 'datos-bancarios', label: 'Datos bancarios' },
];

interface ConfiguracionTabBarProps {
  activeTab: ConfiguracionTabId;
  onChange: (tab: ConfiguracionTabId) => void;
}

export function ConfiguracionTabBar({ activeTab, onChange }: ConfiguracionTabBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded border px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === tab.id
              ? 'border-black bg-black text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-black'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
