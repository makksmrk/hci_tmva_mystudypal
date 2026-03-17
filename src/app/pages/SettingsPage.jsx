import { useUserData } from '../store/useUserData';
import { useTranslation } from 'react-i18next';

// Toggle switch component for on/off settings
const ToggleSwitch = ({ checked, onChange }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            checked ? 'bg-blue-500' : 'bg-gray-300'
        }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                checked ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </button>
);

// Row container for a single setting with label and control
const SettingRow = ({ label, children, layout = "stack" }) => (
    <div
        className={`py-4 border-b border-gray-200 dark:border-gray-700 ${
            layout === "inline"
                ? "flex items-center justify-between gap-4"
                : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        }`}
    >
        <span className="text-gray-800 dark:text-gray-200 font-medium">{label}</span>
        <div className={layout === "inline" ? "w-auto" : "w-full sm:w-auto"}>{children}</div>
    </div>
);

// Dropdown select component for settings with multiple options
const SelectDropdown = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 border-2 border-gray-800 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 sm:min-w-[220px]"
    >
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

export function SettingsPage() {
    const { t } = useTranslation();
    const { userData, updateSettings, toggleDarkMode } = useUserData();
    const settings = userData.settings;

    // Toggles the block messages setting
    const handleToggleBlockMessages = () => {
        updateSettings('blockMessages', !settings.blockMessages);
    };

    // Configuration array for all settings with their components
    const settingsConfig = [
        {
            label: t('settings.darkMode'),
            component: <ToggleSwitch checked={settings.darkMode} onChange={toggleDarkMode} />,
            layout: "inline",
        },
        {
            label: t('settings.blockMessages'),
            component: <ToggleSwitch checked={settings.blockMessages} onChange={handleToggleBlockMessages} />,
            layout: "inline",
        },
        {
            label: t('settings.learningReminder'),
            component: <SelectDropdown 
                value={settings.learningReminder} 
                onChange={(val) => updateSettings('learningReminder', val)}
                options={[
                    { value: '30 min (Standard)', label: '30 min (Standard)' },
                    { value: '15 min', label: '15 min' },
                    { value: '45 min', label: '45 min' },
                    { value: '60 min', label: '60 min' },
                    { value: 'Aus', label: 'Aus' },
                ]}
            />
        },
        {
            label: t('settings.language'),
            component: <SelectDropdown 
                value={settings.language} 
                onChange={(val) => updateSettings('language', val)}
                options={[
                    { value: 'de', label: 'Deutsch' },
                    { value: 'en', label: 'English' },
                ]}
            />
        }
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="flex-1 p-4 sm:p-8 overflow-auto min-h-0 flex justify-center">
                <div className="max-w-2xl w-full">
                    {settingsConfig.map(({ label, component, layout }) => (
                        <SettingRow key={label} label={label} layout={layout}>
                            {component}
                        </SettingRow>
                    ))}
                </div>
            </div>
        </div>
    );
}
