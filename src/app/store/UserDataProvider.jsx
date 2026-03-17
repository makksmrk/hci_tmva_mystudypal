import {useCallback, useEffect, useState} from 'react';
import { UserDataContext } from './UserDataContext';
import i18n from '../../i18n';

// Datenstruktur für die Daten in JSON
const DEFAULT_USER_DATA = {
    todos: { categories: [
            {
                id: 0,
                name: "Gesamtübersicht",
                color: "bg-gray-300",
                hover: "hover:bg-gray-400",
                text: "text-gray-700",
                todos: []
            }
        ] },      // To-Do Kategorien
    calendar: {
        events: [], },
    achievements: [
        { id: 1, name: 'Fokus-Lehrling', icon: '🧘🏼‍♀️', progress: '1 of 1', description: 'Konzentriere dich 1 Stunde an einem Tag.', achieved: true },
        { id: 2, name: 'Level Up', icon: '🆙️', progress: '3 of 3', description: '3 Achievements sichern.', achieved: true },
        { id: 3, name: 'Marathon-Geist', icon: '🏃🏻', progress: '0 of 50', description: 'Insgesamt 50 Stunden Fokuszeit erreichen.', achieved: false },
        { id: 4, name: '100-Stunden-Held', icon: '💯', progress: '0 of 100', description: '100 Stunden Fokuszeit erreichen.', achieved: false },
        { id: 5, name: 'Konstanz ist König', icon: '👑', progress: '3 of 3', description: '3-Tage-Streak erreichen.', achieved: true },
        { id: 6, name: 'Ein-Wochen-Champion', icon: '🏆', progress: '0 of 7', description: '7-Tage-Streak erreichen.', achieved: false },
        { id: 7, name: 'Unermüdlicher Lerner', icon: '🧠', progress: '0 of 30', description: '30 Tage ohne Unterbrechung.', achieved: false },
        { id: 8, name: 'Gewohnheitsmeister', icon: '🧑🏼‍🎓', progress: '0 of 60', description: '60 Tage am Stück durchhalten.', achieved: false },
        { id: 9, name: 'Frühaufsteher', icon: '🌅', progress: '1 of 1', description: 'Eine Fokus-Sitzung vor 7 Uhr morgens abschließen.', achieved: true },
        { id: 10, name: 'Nachteule', icon: '🌃', progress: '0 of 1', description: 'Eine Sitzung nach 23 Uhr abschließen.', achieved: false },
        { id: 11, name: 'Keine Ablenkung', icon: '📴', progress: '1 of 1', description: 'Während der gesamten Sitzung nicht aufs Handy tippen.', achieved: true },
        { id: 12, name: 'Erster Schritt', icon: '🥇', progress: '0 of 1', description: 'Erste Fokus-Sitzung abschließen.', achieved: false },
        { id: 13, name: 'Zielhüter', icon: '🥅', progress: '0 of 5', description: '5 gesetzte Lernziele erfolgreich abschließen.', achieved: false },
        { id: 14, name: 'Plan-Ausführer', icon: '💃🏼', progress: '0 of 1', description: 'Alle Tagesaufgaben vollständig erledigen.', achieved: false },
        { id: 15, name: 'Sprachlerner', icon: '🗣️', progress: '0 of 20', description: '20 Sitzungen für das Erlernen einer Fremdsprache.', achieved: false }
    ],
    settings: {
        darkMode: false,
        blockMessages: false,
        learningReminder: '30 min (Standard)',
        language: 'de'
    },
};

// für die Übersetzung mit i18n notwendig
const normalizeLanguage = (value) => {
    if (value === 'de' || value === 'en') return value;
    if (value === 'Deutsch') return 'de';
    if (value === 'English') return 'en';
    return null;
};

export function UserDataProvider({ children }) {
    // localStorage Initialisation
    const [userData, setUserData] = useState(() => {
        try {
            const stored = localStorage.getItem('userData');
            const parsed = stored ? JSON.parse(stored) : DEFAULT_USER_DATA;
            
            // Ensure settings exist with defaults
            if (!parsed.settings) {
                parsed.settings = DEFAULT_USER_DATA.settings;
            } else {
                // Merge with defaults to ensure all settings exist
                parsed.settings = {
                    ...DEFAULT_USER_DATA.settings,
                    ...parsed.settings
                };
            }

            const normalizedLanguage = normalizeLanguage(parsed.settings.language);
            parsed.settings.language = normalizedLanguage ?? DEFAULT_USER_DATA.settings.language;
            
            // Ensure achievements exist with defaults
            if (!parsed.achievements || parsed.achievements.length === 0) {
                parsed.achievements = DEFAULT_USER_DATA.achievements;
            }
            
            return parsed;
        } catch {
            return DEFAULT_USER_DATA;
        }
    });

    // Wir speichern in den localStorage wenn UserData geändert wird
    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify(userData));
    }, [userData]);

    // Learning Mode
    const [learningModeTodos, setLearningModeTodos] = useState(() => {
        try {
            const stored = localStorage.getItem('learningModeTodos');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('learningModeTodos', JSON.stringify(learningModeTodos));
    }, [learningModeTodos]);

    // -------------------
    // Learning Mode Funktionen für To-Do
    // -------------------

    const addLearningTodo = (todo) => {
        setLearningModeTodos((prev) => {
            if (prev.some(t => t.id === todo.id)) return prev;
            return [
                ...prev,
                {
                    ...todo,
                    duration: todo.duration || { hours: 0, minutes: 0 } // <- добавляем время
                }
            ];
        });
    };

    const removeLearningTodo = (todoId) => {
        setLearningModeTodos(prev => prev.filter(t => t.id !== todoId));
    };

    // -------------------
    // To-do Funktionen
    // -------------------
    const addTodo = (categoryId, todo) => {
        if (!userData.todos.categories) return;

        setUserData(prev => ({
            ...prev,
            todos: {
                ...prev.todos,
                categories: prev.todos.categories.map(cat =>
                    cat.id === categoryId
                        ? {
                            ...cat,
                            todos: [
                                ...cat.todos,
                                {
                                    id: `${cat.id}-${Date.now()}`,
                                    title: todo.title,
                                    duration: todo.duration,
                                    done: false,
                                    text: cat.text,
                                    createdAt: Date.now(),
                                },
                            ],
                        }
                        : cat
                ),
            },
        }));
    };

    const toggleTodo = (categoryId, todoId) => {
        setUserData(prev => {
            const updatedData = {
                ...prev,
                todos: {
                    ...prev.todos,
                    categories: prev.todos.categories.map(cat =>
                        cat.id === categoryId
                            ? {
                                ...cat,
                                todos: cat.todos.map(todo =>
                                    todo.id === todoId ? { ...todo, done: !todo.done } : todo
                                ),
                            }
                            : cat
                    ),
                },
            };

            // Check if a todo was just completed (changed from false to true)
            const category = prev.todos.categories.find(cat => cat.id === categoryId);
            const todo = category?.todos.find(t => t.id === todoId);
            
            if (todo && !todo.done) {
                // Todo is being completed, unlock achievement #12
                updatedData.achievements = prev.achievements.map(achievement =>
                    achievement.id === 12
                        ? { ...achievement, progress: '1 of 1', achieved: true }
                        : achievement
                );

                // Check if all todos are now completed (achievement #14)
                const allTodos = updatedData.todos.categories.flatMap(cat => cat.todos);
                const allCompleted = allTodos.length > 0 && allTodos.every(t => t.done);
                
                if (allCompleted) {
                    updatedData.achievements = updatedData.achievements.map(achievement =>
                        achievement.id === 14
                            ? { ...achievement, progress: '1 of 1', achieved: true }
                            : achievement
                    );
                }
            }

            return updatedData;
        });
    };

    const deleteTodo = (categoryId, todoId) => {
        setUserData(prev => ({
            ...prev,
            todos: {
                ...prev.todos,
                categories: prev.todos.categories.map(cat =>
                    cat.id === categoryId
                        ? { ...cat, todos: cat.todos.filter(todo => todo.id !== todoId) }
                        : cat
                ),
            },
        }));
    };

    const addCategory = (category) => {
        setUserData(prev => {
            const currentCategories = prev.todos?.categories || []

            const newId = currentCategories.length > 0
                ? Math.max(...currentCategories.map(c => c.id)) + 1
                : 1 // Wenn keine Kategorien, erste Id ist gleich 1

            return {
                ...prev,
                todos: {
                    ...prev.todos,
                    categories: [
                        ...currentCategories,
                        { ...category, id: newId, todos: [] }
                    ]
                }
            }
        })
    };

    const renameCategory = (categoryId, newName) => {
        setUserData(prev => ({
            ...prev,
            todos: {
                ...prev.todos,
                categories: prev.todos.categories.map(cat =>
                    cat.id === categoryId ? { ...cat, name: newName } : cat
                ),
            },
        }));
    };

    const deleteCategory = (categoryId) => {
        setUserData(prev => ({
            ...prev,
            todos: {
                ...prev.todos,
                categories: prev.todos.categories.filter(cat => cat.id !== categoryId),
            },
        }));
    };

    function updateTodoDuration(categoryId, todoId, duration) {
        setUserData(prev => ({
            ...prev,
            todos: {
                ...prev.todos,
                categories: prev.todos.categories.map(cat =>
                    cat.id === categoryId
                        ? {
                            ...cat,
                            todos: cat.todos.map(todo =>
                                todo.id === todoId
                                    ? { ...todo, duration }
                                    : todo
                            )
                        }
                        : cat
                )
            }
        }));
    }

    // -------------------
    // Kalender Funktionen
    // -------------------

    const addCalendarEvent = (event) => {
        setUserData(prev => ({
            ...prev,
            calendar: {
                ...prev.calendar,
                events: [...prev.calendar.events, event],
            },
        }));
    };

    const updateCalendarEvent = (index, updatedEvent) => {
        setUserData(prev => ({
            ...prev,
            calendar: {
                ...prev.calendar,
                events: prev.calendar.events.map((e, i) =>
                    i === index ? updatedEvent : e
                ),
            },
        }));
    };

    const deleteCalendarEvent = (index) => {
        setUserData(prev => ({
            ...prev,
            calendar: {
                ...prev.calendar,
                events: prev.calendar.events.filter((_, i) => i !== index),
            },
        }));
    };

    const getEventsForDay = useCallback((day) => 
        userData.calendar.events.filter(e => e.date === day),
        [userData.calendar.events]
    );

    // -------------------
    // Settings Funktionen
    // -------------------

    const updateSettings = (key, value) => {
        setUserData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [key]: value
            }
        }));
    };

    // -------------------
    // Achievement Funktionen
    // -------------------

    const updateAchievement = (achievementId, updates) => {
        setUserData(prev => ({
            ...prev,
            achievements: prev.achievements.map(achievement =>
                achievement.id === achievementId
                    ? { ...achievement, ...updates }
                    : achievement
            )
        }));
    };

    // Apply dark mode to document
    const toggleDarkMode = () => {
        setUserData(prev => ({
            ...prev,
            settings: {
                ...(prev.settings ?? {}),
                darkMode: !(prev.settings?.darkMode ?? false),
            }
        }));
    };

    useEffect(() => {
        const enabled = !!userData?.settings?.darkMode;

        document.documentElement.classList.toggle('dark', enabled);
    }, [userData?.settings?.darkMode]);

    useEffect(() => {
        const language = normalizeLanguage(userData?.settings?.language) ?? DEFAULT_USER_DATA.settings.language;
        if (i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [userData?.settings?.language]);

    // -------------------
    // Provider
    // -------------------
    return (
        <UserDataContext.Provider
            value={{
                userData,
                setUserData,

                /* calendar */

                addCalendarEvent,
                updateCalendarEvent,
                deleteCalendarEvent,
                getEventsForDay,

                /* to-do */

                addTodo,
                toggleTodo,
                deleteTodo,
                addCategory,
                renameCategory,
                deleteCategory,
                updateTodoDuration,

                /* learning mode to-do */

                learningModeTodos,
                addLearningTodo: (todo) => {
                    setLearningModeTodos((prev) => {
                        if (prev.some(t => t.id === todo.id)) return prev;
                        return [...prev, todo];
                    });
                },
                removeLearningTodo: (todoId) => {
                    setLearningModeTodos(prev => prev.filter(t => t.id !== todoId));
                },

                /* settings */

                updateSettings,
                toggleDarkMode,

                /* achievements */

                updateAchievement,
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
}
