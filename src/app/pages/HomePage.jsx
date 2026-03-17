import { useUserData } from '../store/useUserData';

// Formats current date as "Day, DD.MM.YY" in German locale
const formatCurrentDate = () => {
    const date = new Date();
    const weekday = date.toLocaleDateString('de-DE', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
    return `${weekday}, ${dateStr}`;
};

// Reusable widget container with title and content
const Widget = ({ title, children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 ${className}`}>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
        {children}
    </div>
);

// Displays a single schedule item with time and title
const ScheduleItem = ({ time, title }) => (
    <div className="flex items-center gap-4">
        <span className="text-gray-600 dark:text-gray-400 font-medium">{time}</span>
        <span className="text-gray-800 dark:text-gray-200">{title}</span>
    </div>
);

// Displays a single challenge item with icon and name
const ChallengeItem = ({ name, icon }) => (
    <div className="flex items-center gap-4">
        <span className="text-gray-600 dark:text-gray-400 font-medium">{icon}</span>
        <span className="text-gray-800 dark:text-gray-200">{name}</span>
    </div>
)

export function HomePage() {
    const { getEventsForDay } = useUserData();
    const today = new Date().getDate();
    const todayEvents = getEventsForDay(today);

    const challenges = [
        {name: 'Absolvieren Sie eine Selbstlernphase.', icon: '️📚'},
        {name: 'Absolvieren Sie einen Todo.', icon: '️✅', progress: '1 of 1'}
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="flex-1 p-8 overflow-auto min-h-0">
                <div className="flex flex-col gap-6 max-w-7xl mx-auto">
                    <Widget title={`🗓️ ${formatCurrentDate()}`}>
                        <div className="space-y-3">
                            {todayEvents.length > 0 ? (
                                todayEvents.map((event, idx) => (
                                    <ScheduleItem key={idx} time={`${event.startTime} - ${event.endTime}`} title={event.name} />
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    Sie haben noch keine Ereignisse für heute hinzugefügt!
                                </div>
                            )}
                        </div>
                    </Widget>

                    <Widget title="🔥Tages Herausforderung🔥">
                        <div className="space-y-3">
                            {challenges.map((item, idx) => (
                                <ChallengeItem key={idx} {...item} />
                            ))}
                            <div className="text-gray-400 dark:text-gray-500 text-sm">...</div>
                        </div>
                    </Widget>
                </div>
            </div>
        </div>
    );
}