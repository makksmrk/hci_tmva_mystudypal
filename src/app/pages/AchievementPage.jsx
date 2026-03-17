import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserData } from '../store/useUserData';

export function AchievementPage() {
    const { t } = useTranslation();
    const { userData } = useUserData();
    const [selectedAchievement, setSelectedAchievement] = useState(null); // Manage between show or hide pop-up

    const ACHIEVEMENTS = userData.achievements || [];

    const getAchievementName = (achievement) => (
        t(`achievement.items.${achievement.id}.name`, {
            defaultValue: achievement.name ?? ''
        })
    );

    const getAchievementDescription = (achievement) => (
        t(`achievement.items.${achievement.id}.description`, {
            defaultValue: achievement.description ?? ''
        })
    );

    // Achievement icon modification
    const AchievementIcon = ({ achievement, size = 'w-24 h-24 text-4xl' }) => (
        <div className={`${size} rounded-full flex items-center justify-center shadow-lg ${
            achievement.achieved ? 'bg-gradient-to-br bg-blue-500' : 'bg-gray-400'
        }`}>
            {achievement.icon}
        </div>
    );

    // Begin of UI
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className={`flex-1 p-8 overflow-auto min-h-0 ${selectedAchievement ? 'blur-sm' : ''}`}>
                <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                    {ACHIEVEMENTS.map(achievement => (
                        <div
                            key={achievement.id}
                            onClick={() => setSelectedAchievement(achievement)}
                            className="flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <div className="relative mb-3">
                                <AchievementIcon achievement={achievement} />
                            </div>
                            <h3 className={`font-semibold text-sm mb-1 ${achievement.achieved ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-600'}`}>
                                {getAchievementName(achievement)}
                            </h3>
                            {achievement.progress && (
                                <p className="text-gray-400 dark:text-gray-500 text-xs">{achievement.progress}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {selectedAchievement && (
                <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setSelectedAchievement(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center mb-4">
                            <AchievementIcon achievement={selectedAchievement} size="w-20 h-20 text-4xl" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center mb-3">{getAchievementName(selectedAchievement)}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{getAchievementDescription(selectedAchievement)}</p>
                        <button
                            onClick={() => setSelectedAchievement(null)}
                            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            {t('achievement.close')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
