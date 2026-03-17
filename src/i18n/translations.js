// Wörterbuch für die Übersetzung
export const translations = {
    de: {
        language_de: "Deutsch",
        language_en: "Englisch",
        nav: {
            home: "Startseite",
            calendar: "Kalender",
            tasks: "Aufgaben",
            learning: "Lernen",
            statistics: "Statistik",
            achievement: "Achievement",
            settings: "Einstellungen"
        },
        calendar: {
            view: {
                day: "Tag",
                month: "Monat"
            },
            weekDays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
            popup: {
                cancel: "Abbrechen",
                save: "Speichern",
                add: "Hinzufügen",
                titlePlaceholder: "Titel",
                startLabel: "Beginn",
                endLabel: "Ende",
                delete: "Ereignis löschen"
            }
        },
        statistics: {
            view: {
                day: "Tag",
                week: "Woche",
                month: "Monat",
                year: "Jahr"
            }
        },
        settings: {
            darkMode: "Hell/Dunkel Modus",
            blockMessages: "Nachrichten blockieren",
            learningReminder: "Lern - Erinnerungen",
            language: "Spracheinstellung"
        },
        learningMode: {
            status: {
                pauseRunning: "Pause läuft",
                learningTimer: "Lernphase (Timer)",
                freeLearning: "Freies Lernen",
                readyToLearn: "Bereit zu lernen"
            },
            completed: "Erledigt",
            selected: "Ausgewählt",
            total: "Gesamt",
            running: "läuft…",
            empty: "Keine To-Dos im Learning Mode.",
            controls: {
                start: "Start",
                pause: "Pause",
                stop: "Stop",
                endPause: "Pause beenden"
            },
            modal: {
                title: "Assistant",
                check: {
                    title: "Bist du noch am Lernen?",
                    currentTimer: "Aktueller Timer:",
                    yes: "Ja",
                    no: "Nein"
                },
                choice: {
                    title: "Was möchtest du tun?",
                    end: "Lernen beenden",
                    pause: "Pause nötig",
                    continue: "Weiterlernen"
                },
                pauseDuration: {
                    title: "Wie lange möchtest du Pause machen?",
                    hours: "Stunden",
                    minutes: "Minuten",
                    back: "Zurück",
                    confirm: "Bestätigen"
                },
                ready: {
                    title: "Bereit?",
                    subtitle: "Deine Pause ist vorbei.",
                    continue: "Ja, weiter",
                    end: "Beenden"
                }
            }
        },
        todo: {
            overview: "Gesamtübersicht",
            hideDone: "Nur offene Todos",
            showAll: "Alle Todos anzeigen",
            none: "Keine Todos vorhanden.",
            learningAdd: "Todo zum Lernmodus hinzugefügt",
            learningRemove: "Todo aus Lernmodus entfernt",
            renamePrompt: "Neuer Name für die Kategorie:",
            addCategoryTitle: "Neue Kategorie",
            addCategoryPlaceholder: "Name der Kategorie",
            addCategoryAdd: "Hinzufügen",
            addCategoryCancel: "Abbrechen",
            addTodoTitle: "Neues To-do",
            addTodoPlaceholder: "Todo Titel",
            addTodoAdd: "Hinzufügen",
            addTodoCancel: "Abbrechen",
            categoryMenu: {
                rename: "Umbenennen",
                delete: "Löschen"
            },
            filter: {
                byCategory: "Nach Kategorie",
                alphabetical: "Alphabetisch A-Z",
                byDuration: "Nach Dauer (aufsteigend)"
            },
            todoMenu: {
                editTime: "Zeit ändern",
                delete: "Löschen",
                promptHours: "Stunden eingeben:",
                promptMinutes: "Minuten eingeben:"
            }
        },
        achievement: {
            close: "Schließen",
            items: {
                "1": {
                    name: "Fokus-Lehrling",
                    description: "Konzentriere dich 1 Stunde an einem Tag."
                },
                "2": {
                    name: "Level Up",
                    description: "3 Achievements sichern."
                },
                "3": {
                    name: "Marathon-Geist",
                    description: "Insgesamt 50 Stunden Fokuszeit erreichen."
                },
                "4": {
                    name: "100-Stunden-Held",
                    description: "100 Stunden Fokuszeit erreichen."
                },
                "5": {
                    name: "Konstanz ist König",
                    description: "3-Tage-Streak erreichen."
                },
                "6": {
                    name: "Ein-Wochen-Champion",
                    description: "7-Tage-Streak erreichen."
                },
                "7": {
                    name: "Unermüdlicher Lerner",
                    description: "30 Tage ohne Unterbrechung."
                },
                "8": {
                    name: "Gewohnheitsmeister",
                    description: "60 Tage am Stück durchhalten."
                },
                "9": {
                    name: "Frühaufsteher",
                    description: "Eine Fokus-Sitzung vor 7 Uhr morgens abschließen."
                },
                "10": {
                    name: "Nachteule",
                    description: "Eine Sitzung nach 23 Uhr abschließen."
                },
                "11": {
                    name: "Keine Ablenkung",
                    description: "Während der gesamten Sitzung nicht aufs Handy tippen."
                },
                "12": {
                    name: "Erster Schritt",
                    description: "Erste Fokus-Sitzung abschließen."
                },
                "13": {
                    name: "Zielhüter",
                    description: "5 gesetzte Lernziele erfolgreich abschließen."
                },
                "14": {
                    name: "Plan-Ausführer",
                    description: "Alle Tagesaufgaben vollständig erledigen."
                },
                "15": {
                    name: "Sprachlerner",
                    description: "20 Sitzungen für das Erlernen einer Fremdsprache."
                }
            }
        },
        profile: {
            title: "Dein User-Profil",
            avatarLabel: "Profilbild wählen",
            lastName: "Nachname",
            firstName: "Vorname",
            birthDate: "Geburtsdatum",
            email: "E-Mail",
            cancel: "Abbrechen",
            save: "Speichern"
        },
        home: {
            todayTitle: "🗓️ {{date}}",
            noEvents: "Sie haben noch keine Ereignisse für heute hinzugefügt!",
            dailyChallengeTitle: "🔥Tages Herausforderung🔥",
            challenge: {
                selfStudy: "Absolvieren Sie eine Selbstlernphase.",
                todo: "Absolvieren Sie einen Todo."
            }
        },
        app: {
            pageTitle: {
                home: "Home - Bildschirm (Startseite)",
                tasks: "To-Do",
                calendar: "Kalender",
                learning: "Lernmodus",
                statistics: "Statistik",
                achievement: "Achievements",
                settings: "Einstellungen"
            }
        }
    },
    en: {
        language_de: "German",
        language_en: "English",
        nav: {
            home: "Home",
            calendar: "Calendar",
            tasks: "Tasks",
            learning: "Learning",
            statistics: "Statistics",
            achievement: "Achievement",
            settings: "Settings"
        },
        calendar: {
            view: {
                day: "Day",
                month: "Month"
            },
            weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            popup: {
                cancel: "Cancel",
                save: "Save",
                add: "Add",
                titlePlaceholder: "Title",
                startLabel: "Start",
                endLabel: "End",
                delete: "Delete event"
            }
        },
        statistics: {
            view: {
                day: "Day",
                week: "Week",
                month: "Month",
                year: "Year"
            }
        },
        settings: {
            darkMode: "Light/Dark mode",
            blockMessages: "Block messages",
            learningReminder: "Learning reminders",
            language: "Language setting"
        },
        learningMode: {
            status: {
                pauseRunning: "Pause running",
                learningTimer: "Learning phase (timer)",
                freeLearning: "Free learning",
                readyToLearn: "Ready to learn"
            },
            completed: "Completed",
            selected: "Selected",
            total: "Total",
            running: "running…",
            empty: "No To-Dos in Learning Mode.",
            controls: {
                start: "Start",
                pause: "Pause",
                stop: "Stop",
                endPause: "End pause"
            },
            modal: {
                title: "Assistant",
                check: {
                    title: "Are you still studying?",
                    currentTimer: "Current timer:",
                    yes: "Yes",
                    no: "No"
                },
                choice: {
                    title: "What would you like to do?",
                    end: "End learning",
                    pause: "Need a break",
                    continue: "Continue learning"
                },
                pauseDuration: {
                    title: "How long would you like to take a break?",
                    hours: "Hours",
                    minutes: "Minutes",
                    back: "Back",
                    confirm: "Confirm"
                },
                ready: {
                    title: "Ready?",
                    subtitle: "Your break is over.",
                    continue: "Yes, continue",
                    end: "End"
                }
            }
        },
        todo: {
            overview: "Overview",
            hideDone: "Only open todos",
            showAll: "Show all todos",
            none: "No todos available.",
            learningAdd: "Todo added to learning mode",
            learningRemove: "Todo removed from learning mode",
            renamePrompt: "New name for the category:",
            addCategoryTitle: "New category",
            addCategoryPlaceholder: "Category name",
            addCategoryAdd: "Add",
            addCategoryCancel: "Cancel",
            addTodoTitle: "New To-do",
            addTodoPlaceholder: "Todo title",
            addTodoAdd: "Add",
            addTodoCancel: "Cancel",
            categoryMenu: {
                rename: "Rename",
                delete: "Delete"
            },
            filter: {
                byCategory: "By category",
                alphabetical: "Alphabetical A-Z",
                byDuration: "By duration (ascending)"
            },
            todoMenu: {
                editTime: "Edit time",
                delete: "Delete",
                promptHours: "Enter hours:",
                promptMinutes: "Enter minutes:"
            }
        },
        achievement: {
            close: "Close",
            items: {
                "1": {
                    name: "Focus Apprentice",
                    description: "Focus for 1 hour in a day."
                },
                "2": {
                    name: "Level Up",
                    description: "Earn 3 achievements."
                },
                "3": {
                    name: "Marathon Spirit",
                    description: "Reach 50 hours of total focus time."
                },
                "4": {
                    name: "100-Hour Hero",
                    description: "Reach 100 hours of focus time."
                },
                "5": {
                    name: "Consistency is King",
                    description: "Reach a 3-day streak."
                },
                "6": {
                    name: "One-Week Champion",
                    description: "Reach a 7-day streak."
                },
                "7": {
                    name: "Tireless Learner",
                    description: "30 days without interruption."
                },
                "8": {
                    name: "Habit Master",
                    description: "Keep it up for 60 days straight."
                },
                "9": {
                    name: "Early Riser",
                    description: "Complete a focus session before 7 a.m."
                },
                "10": {
                    name: "Night Owl",
                    description: "Complete a session after 11 p.m."
                },
                "11": {
                    name: "No Distractions",
                    description: "Do not use your phone during the entire session."
                },
                "12": {
                    name: "First Step",
                    description: "Complete your first focus session."
                },
                "13": {
                    name: "Goalkeeper",
                    description: "Successfully complete 5 set study goals."
                },
                "14": {
                    name: "Plan Executor",
                    description: "Complete all daily tasks."
                },
                "15": {
                    name: "Language Learner",
                    description: "20 sessions for learning a foreign language."
                }
            }
        },
        profile: {
            title: "Your user profile",
            avatarLabel: "Choose profile picture",
            lastName: "Last name",
            firstName: "First name",
            birthDate: "Date of birth",
            email: "Email",
            cancel: "Cancel",
            save: "Save"
        },
        home: {
            todayTitle: "🗓️ {{date}}",
            noEvents: "You have not added any events for today yet!",
            dailyChallengeTitle: "🔥Daily Challenge🔥",
            challenge: {
                selfStudy: "Complete a self-study session.",
                todo: "Complete a todo."
            }
        },
        app: {
            pageTitle: {
                home: "Home Screen (Start page)",
                tasks: "To-Do",
                calendar: "Calendar",
                learning: "Learning mode",
                statistics: "Statistics",
                achievement: "Achievements",
                settings: "Settings"
            }
        }
    },
};
