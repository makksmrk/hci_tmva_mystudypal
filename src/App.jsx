import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './app/components/Header';
import { BottomBar } from './app/components/BottomBar';
import { HomePage } from './app/pages/HomePage';
import { TodoPage } from './app/pages/TodoPage';
import { StatisticsPage } from './app/pages/StatisticsPage';
import { LearningModePage } from './app/pages/LearningModePage';
import { SettingsPage } from './app/pages/SettingsPage';
import { CalendarPage } from './app/pages/CalendarPage';
import { AchievementPage } from './app/pages/AchievementPage';

export default function App() {
    const { t } = useTranslation();
    const [activePage, setActivePage] = useState('home');

    const onNavigate = (page) => {
        setActivePage(page);
    };

    const pageTitles = {
        home: t('app.pageTitle.home'),
        tasks: t('app.pageTitle.tasks'),
        calendar: t('app.pageTitle.calendar'),
        learning: t('app.pageTitle.learning'),
        statistics: t('app.pageTitle.statistics'),
        achievement: t('app.pageTitle.achievement'),
        settings: t('app.pageTitle.settings'),
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <Header title={pageTitles[activePage]} onNavigate={onNavigate} />

            <main className="flex-1 overflow-y-auto pb-20 bg-gray-100 dark:bg-gray-900">
                {activePage === 'home' && <HomePage />}
                {activePage === 'tasks' && <TodoPage />}
                {activePage === 'calendar' && <CalendarPage />}
                {activePage === 'learning' && <LearningModePage />}
                {activePage === 'statistics' && <StatisticsPage />}
                {activePage === 'achievement' && <AchievementPage />}
                {activePage === 'settings' && <SettingsPage />}
            </main>

            <BottomBar activePage={activePage} onNavigate={setActivePage} />
        </div>
    );
}
