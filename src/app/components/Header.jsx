import { useState } from 'react';
import { User, Home, Settings } from 'lucide-react';
import ProfileMocked from './user/ProfileMocked';

export function Header({ title, onNavigate }) {
    // für gemockte User Profil
    const [userProfile, setUserProfile] = useState({
        nachname: 'Mustermann',
        vorname: 'Max',
        geburtstag: '1998-10-03',
        email: 'max.mustermann@mail.com',
        avatar: '',
        level: 5,
        currentXP: 350,
        xpToNextLevel: 500,
    });

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
    const formattedTime = currentDate.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
    });

    // Calculate progress percentage for level bar
    const progressPercentage = (userProfile.currentXP / userProfile.xpToNextLevel) * 100;

    return (
        <>
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 md:px-8 md:py-4 flex-shrink-0">
                <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                        {/* Mobile: Home + Settings */}
                        <button
                            onClick={() => onNavigate('home')}
                            className="md:hidden p-2 rounded text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-500"
                            title="Startseite"
                        >
                            <Home className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => onNavigate('settings')}
                            className="md:hidden p-2 rounded text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-500"
                            title="Einstellungen"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        {/* Desktop: Title */}
                        <h1 className="hidden md:block text-gray-900 dark:text-gray-100 font-medium">
                            {title}
                        </h1>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-6">
                        {/* Desktop: Date + Time */}
                        <div className="hidden md:flex items-center gap-4 text-gray-700 dark:text-gray-300">
                            <span>{formattedDate}</span>
                            <span>{formattedTime}</span>
                        </div>

                        {/* User Profile with Level Bar */}
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={() => setIsProfileOpen(true)}
                                className="w-10 h-10 rounded-full border-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title="User Profil"
                            >
                                <User className="w-5 h-5" />
                            </button>
                            
                            {/* Level Bar */}
                            <div className="flex flex-col items-center gap-0.5 w-16">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="bg-blue-500 h-full transition-all duration-300"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                    Lvl {userProfile.level}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <ProfileMocked
                open={isProfileOpen}
                values={userProfile}
                onChange={setUserProfile}
                onClose={() => setIsProfileOpen(false)}
                onSave={() => setIsProfileOpen(false)}
            />
        </>
    );
}