import { Home, Calendar, CheckCircle2, BookUser, BarChart3, Trophy, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BottomBar({ activePage, onNavigate }) {
    const { t } = useTranslation();
    const navItems = [
        { icon: Home, label: t('nav.home'), page: 'home' },
        { icon: Calendar, label: t('nav.calendar'), page: 'calendar' },
        { icon: CheckCircle2, label: t('nav.tasks'), page: 'tasks' },
        { icon: BookUser, label: t('nav.learning'), page: 'learning' },
        { icon: BarChart3, label: t('nav.statistics'), page: 'statistics' },
        { icon: Trophy, label: t('nav.achievement'), page: 'achievement' },
        { icon: Settings, label: t('nav.settings'), page: 'settings'},
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 shadow-md md:static flex-shrink-0">
            <div className="flex justify-center gap-6">
                {navItems.map(item => (
                    <button
                        key={item.page}
                        onClick={() => onNavigate(item.page)}
                        className={`
                    flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors
                    ${['home', 'settings'].includes(item.page) ? 'hidden sm:flex' : 'flex'}
                    ${activePage === item.page ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </footer>
    );
}
