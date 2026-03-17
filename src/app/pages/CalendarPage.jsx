import { useState, useMemo} from 'react';
import { useUserData } from '../store/useUserData';
import { useTranslation } from 'react-i18next';

const HOURS_IN_DAY = 24;
const MINUTES_PER_HOUR = 60;
const HOUR_HEIGHT = 60;
const CALENDAR_GRID_SIZE = 35;

// Helper functions
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * MINUTES_PER_HOUR + minutes;
};

const eventsOverlap = (e1, e2) => {
    const [start1, end1] = [timeToMinutes(e1.startTime), timeToMinutes(e1.endTime)];
    const [start2, end2] = [timeToMinutes(e2.startTime), timeToMinutes(e2.endTime)];
    return start1 < end2 && start2 < end1;
};

const generateCalendarDays = () => {
    const now = new Date();
    const [year, month] = [now.getFullYear(), now.getMonth()];

    const firstDay = new Date(year, month, 1);
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    return [
        ...Array.from({ length: firstDayOfWeek }, (_, i) => ({
            day: daysInPrevMonth - firstDayOfWeek + i + 1,
            isCurrentMonth: false
        })),
        ...Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            isCurrentMonth: true
        })),
        ...Array.from({ length: CALENDAR_GRID_SIZE - firstDayOfWeek - daysInMonth }, (_, i) => ({
            day: i + 1,
            isCurrentMonth: false
        }))
    ];
};



// Calculate event layout with overlap handling
const calculateEventLayout = (dayEvents, allEvents) => {
    if (dayEvents.length === 0) return [];

    const findOverlapGroup = (event, processed) => {
        const group = new Set([event]);
        const queue = [event];

        while (queue.length > 0) {
            const current = queue.pop();
            dayEvents.forEach(other => {
                if (!group.has(other) && eventsOverlap(current, other)) {
                    group.add(other);
                    queue.push(other);
                }
            });
        }
        group.forEach(e => processed.add(e));
        return Array.from(group);
    };

    const processed = new Set();
    const groups = dayEvents
        .filter(e => !processed.has(e))
        .map(e => findOverlapGroup(e, processed));

    return groups.flatMap(group => {
        const columns = [];
        const sorted = [...group].sort(
            (a, b) => allEvents.indexOf(a) - allEvents.indexOf(b)
        );

        const items = sorted.map(event => {
            const colIndex = columns.findIndex(col =>
                col.every(e => !eventsOverlap(event, e))
            );

            const assignedColumn = colIndex === -1 ? columns.length : colIndex;

            if (!columns[assignedColumn]) columns[assignedColumn] = [];
            columns[assignedColumn].push(event);

            return {
                event,
                column: assignedColumn,
                index: allEvents.indexOf(event)
            };
        });

        return items.map(item => ({
            ...item,
            totalColumns: columns.length
        }));
    });

};

// View Toggle Component
const ViewToggle = ({ view, setView, onAddClick, options }) => (
    <div className="flex justify-between items-center p-8 pb-6 flex-shrink-0">
        <div className="flex-1" />
        <div className="flex gap-4">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => setView(option.value)}
                    className={`px-8 py-2 rounded-full font-medium transition-colors ${
                        view === option.value ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
        <div className="flex-1 flex justify-end">
            <button
                onClick={onAddClick}
                className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors text-2xl"
            >
                +
            </button>
        </div>
    </div>
);

const FormField = ({ label, type, value, onChange, placeholder }) => (
    <div className="mb-4">
        {label && (
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        )}
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
        />
    </div>
);

// Event Popup Component
const EventPopup = ({ eventName, setEventName, startTime, setStartTime, endTime, setEndTime, onSave, onCancel, onDelete, isEditing, labels }) => {
    const isFormValid = eventName.trim() && startTime && endTime;


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 p-6">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onCancel} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium">{labels.cancel}</button>
                    <button
                        onClick={onSave}
                        disabled={!isFormValid}
                        className={`font-medium ${isFormValid ? 'text-blue-500 hover:text-blue-600' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                    >
                        {isEditing ? labels.save : labels.add}
                    </button>
                </div>

                <FormField type="text" value={eventName} onChange={setEventName} placeholder={labels.titlePlaceholder} />
                <FormField label={labels.startLabel} type="time" value={startTime} onChange={setStartTime} />
                <FormField label={labels.endLabel} type="time" value={endTime} onChange={setEndTime} />

                {isEditing && (
                    <button onClick={onDelete} className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                        {labels.delete}
                    </button>
                )}
            </div>
        </div>
    );
};

// Day Cell Component (for Month View)
const DayCell = ({ day, isCurrentMonth, isSelected, events, onClick }) => (
    <div
        onClick={onClick}
        className={`border-r border-b border-gray-300 dark:border-gray-700 last:border-r-0 p-2 min-h-[100px] ${
            isCurrentMonth ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors' : ''
        } ${isSelected ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
    >
        <div className={`text-sm font-medium mb-1 ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
            {day}
        </div>
        {isCurrentMonth && (
            <div className="space-y-1">
                {events.map((event, i) => (
                    <div key={i} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 py-0.5 rounded truncate">
                        {event.name}
                    </div>
                ))}
            </div>
        )}
    </div>
);

// Month View Component
const MonthView = ({ selectedDate, onDayClick, getEventsForDay, weekDays }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 flex flex-col flex-1 min-h-0 mx-8 mb-8 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
            {weekDays.map(day => (
                <div key={day} className="p-4 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-700 last:border-r-0">
                    {day}
                </div>
            ))}
        </div>
        <div className="grid grid-cols-7 overflow-auto">
            {generateCalendarDays().map((dayInfo, idx) => (
                <DayCell
                    key={idx}
                    day={dayInfo.day}
                    isCurrentMonth={dayInfo.isCurrentMonth}
                    isSelected={selectedDate === dayInfo.day && dayInfo.isCurrentMonth}
                    events={dayInfo.isCurrentMonth ? getEventsForDay(dayInfo.day) : []}
                    onClick={() => dayInfo.isCurrentMonth && onDayClick(dayInfo.day)}
                />
            ))}
        </div>
    </div>
);

// Event Widget Component (for Day View)
const EventWidget = ({ event, column, totalColumns, onClick }) => {
    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    const widthPercent = 100 / totalColumns;

    return (
        <div
            onClick={onClick}
            className="absolute bg-blue-100 border-l-4 border-blue-500 p-2 rounded cursor-pointer hover:bg-blue-200 transition-colors"
            style={{
                top: `${startMinutes}px`,
                height: `${endMinutes - startMinutes}px`,
                left: `calc(${widthPercent * column}% + 8px)`,
                width: `calc(${widthPercent}% - 8px)`
            }}
        >
            <div className="text-sm font-medium text-gray-800 truncate">{event.name}</div>
            <div className="text-xs text-gray-600">{event.startTime} - {event.endTime}</div>
        </div>
    );
};

// Day View Component
const DayView = ({ events, selectedDate, onEventClick, getEventsForDay }) => {
    const eventLayout = useMemo(() =>
            calculateEventLayout(getEventsForDay(selectedDate), events),
        [events, selectedDate, getEventsForDay]
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 overflow-auto flex-1 min-h-0 mx-8 mb-8">
            <div className="flex" style={{ minHeight: `${HOURS_IN_DAY * HOUR_HEIGHT}px` }}>
                <div className="w-20 flex-shrink-0">
                    {Array.from({ length: HOURS_IN_DAY }, (_, i) => (
                        <div key={i} className="p-2 text-sm text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700" style={{ height: `${HOUR_HEIGHT}px` }}>
                            {String(i).padStart(2, '0')}:00
                        </div>
                    ))}
                </div>
                <div className="flex-1 relative border-l border-gray-200 dark:border-gray-700" style={{ minHeight: `${HOURS_IN_DAY * HOUR_HEIGHT}px` }}>
                    {Array.from({ length: HOURS_IN_DAY }, (_, i) => (
                        <div key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" style={{ height: `${HOUR_HEIGHT}px` }} />
                    ))}
                    {eventLayout.map(layout => (
                        <EventWidget key={layout.index} {...layout} onClick={() => onEventClick(layout.index)} />
                    ))}
                </div>
            </div>
        </div>
    );
};


export function CalendarPage() {
    const { t } = useTranslation();
    const [view, setView] = useState('Tag');
    const [showPopup, setShowPopup] = useState(false);
    const [eventName, setEventName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [editingIndex, setEditingIndex] = useState(null);
    const weekDays = t('calendar.weekDays', { returnObjects: true });
    const viewOptions = [
        { value: 'Tag', label: t('calendar.view.day') },
        { value: 'Monat', label: t('calendar.view.month') },
    ];

    const {
        userData,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        getEventsForDay
    } = useUserData();

    const events = userData.calendar.events;

    const resetForm = () => {
        setShowPopup(false);
        setEventName('');
        setStartTime('');
        setEndTime('');
        setEditingIndex(null);
    };

    const handleAddEvent = () => {
        if (!eventName || !startTime || !endTime) return;

        const event = {
            name: eventName,
            startTime,
            endTime,
            date: selectedDate,
            createdAt: Date.now(),
        };

        if (editingIndex !== null) {
            updateCalendarEvent(editingIndex, event);
        } else {
            addCalendarEvent(event);
        }

        resetForm();
    };

    const handleEditEvent = (index) => {
        const event = events[index];
        setEventName(event.name);
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setEditingIndex(index);
        setShowPopup(true);
    };

    const handleDeleteEvent = () => {
        deleteCalendarEvent(editingIndex);
        resetForm();
    };

    const handleDayClick = (day) => {
        setSelectedDate(day);
        setView('Tag');
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className={`flex flex-col h-full overflow-hidden ${showPopup ? 'blur-sm' : ''}`}>
                <ViewToggle view={view} setView={setView} onAddClick={() => setShowPopup(true)} options={viewOptions} />

                {view === 'Monat' ? (
                    <MonthView
                        selectedDate={selectedDate}
                        onDayClick={handleDayClick}
                        getEventsForDay={getEventsForDay}
                        weekDays={weekDays}
                    />
                ) : (
                    <DayView
                        events={events}
                        selectedDate={selectedDate}
                        onEventClick={handleEditEvent}
                        getEventsForDay={getEventsForDay}
                    />
                )}
            </div>

            {showPopup && (
                <EventPopup
                    eventName={eventName}
                    setEventName={setEventName}
                    startTime={startTime}
                    setStartTime={setStartTime}
                    endTime={endTime}
                    setEndTime={setEndTime}
                    onSave={handleAddEvent}
                    onCancel={resetForm}
                    onDelete={handleDeleteEvent}
                    isEditing={editingIndex !== null}
                    labels={{
                        cancel: t('calendar.popup.cancel'),
                        save: t('calendar.popup.save'),
                        add: t('calendar.popup.add'),
                        titlePlaceholder: t('calendar.popup.titlePlaceholder'),
                        startLabel: t('calendar.popup.startLabel'),
                        endLabel: t('calendar.popup.endLabel'),
                        delete: t('calendar.popup.delete'),
                    }}
                />
            )}
        </div>
    );
}
