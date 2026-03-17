import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserData } from "../store/useUserData.js";
export function LearningModePage() {
    const { t } = useTranslation();
    // Daten aus dem globalen Context (werden über localStorage persistiert)
    const { userData, learningModeTodos, toggleTodo, removeLearningTodo } = useUserData();
    const todos = learningModeTodos ?? [];

    // Einstellungen aus der SettingsPage (z.B. Lern-Erinnerungen)
    const settings = userData?.settings ?? {};

    // -------------------------------------------------------------
    // HELPER-FUNKTIONEN (ID, Dauer, Anzeigeformat)
    // -------------------------------------------------------------

    // Einheitlicher Schlüssel für ein Todo (wichtig für Sets und Entfernen)
    const getTodoKey = (todo) => String(todo?.id);

    // Konvertiert Dauer aus verschiedenen möglichen Formen in Sekunden
    // (z.B. {hours, minutes}, number=Minuten, string="15", etc.)
    const durationToSeconds = (todo) => {
        if (!todo) return 0;

        const d =
            todo.duration ??
            todo.durationMinutes ??
            todo.totalMinutes ??
            todo.minutes ??
            null;

        // number => minutes
        if (typeof d === "number" && Number.isFinite(d)) return Math.max(0, Math.floor(d)) * 60;

        // string number => minutes
        if (typeof d === "string" && d.trim() !== "" && !Number.isNaN(Number(d))) {
            return Math.max(0, Math.floor(Number(d))) * 60;
        }

        // object => {hours, minutes}
        if (d && typeof d === "object") {
            const hours = d.hours ?? d.hour ?? d.h ?? 0;
            const minutes = d.minutes ?? d.minute ?? d.m ?? 0;

            const h = Number.isFinite(+hours) ? +hours : 0;
            const m = Number.isFinite(+minutes) ? +minutes : 0;

            return Math.max(0, Math.floor(h)) * 3600 + Math.max(0, Math.floor(m)) * 60;
        }

        return 0;
    };

    // Zeigt z.B. "1h 30m" oder "15m" an (für Todo-Liste links)
    const formatDuration = (todo) => {
        const sec = durationToSeconds(todo);
        if (!sec) return "";
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    // Format für den großen Timer (MM:SS oder HH:MM:SS)
    const formatTime = (totalSec) => {
        const s = Math.max(0, totalSec);
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = s % 60;
        const pad = (n) => String(n).padStart(2, "0");
        return hours > 0
            ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
            : `${pad(minutes)}:${pad(seconds)}`;
    };

    // -------------------------------------------------------------
    // SETTINGS: Lern-Erinnerungen aus SettingsPage
    // Werte: '30 min (Standard)' | '15 min' | '45 min' | '60 min' | 'Aus'
    // -------------------------------------------------------------
    const learningReminderValue = settings?.learningReminder ?? "30 min (Standard)";

    // Umrechnung in Millisekunden, null = deaktiviert ("Aus")
    const learningReminderMs = useMemo(() => {
        if (!learningReminderValue || learningReminderValue === "Aus") return null;
        const minutes = parseInt(String(learningReminderValue), 10);
        if (!Number.isFinite(minutes) || minutes <= 0) return 30 * 60 * 1000; // fallback
        return minutes * 60 * 1000;
    }, [learningReminderValue]);

    // -------------------------------------------------------------
    // COMPLETED (session-local)
    // - Erledigte ToDos werden oben als "Erledigt" angezeigt
    // - bleiben während der Session sichtbar/gesperrt
    // - werden erst beim "Stop/Beenden" dauerhaft entfernt
    // -------------------------------------------------------------
    const [completedKeys, setCompletedKeys] = useState(() => new Set());

    // Liste der erledigten ToDos (für den Bereich "Erledigt")
    const completedList = useMemo(() => {
        const set = completedKeys;
        return todos.filter((t) => set.has(getTodoKey(t)));
    }, [todos, completedKeys]);

    // Liste der noch offenen (nicht erledigten) ToDos
    const remainingList = useMemo(() => {
        const set = completedKeys;
        return todos.filter((t) => !set.has(getTodoKey(t)));
    }, [todos, completedKeys]);

    // -------------------------------------------------------------
    // MULTI-SELECTION (User kann mehrere ToDos auswählen)
    // -> Dauer wird addiert und als Timer heruntergezählt
    // -------------------------------------------------------------
    const [selectedKeys, setSelectedKeys] = useState(() => new Set());

    // Bereinigt die Auswahl, falls ToDos verschwinden oder erledigt wurden
    useEffect(() => {
        setSelectedKeys((prev) => {
            const remainingSet = new Set(remainingList.map((t) => getTodoKey(t)));
            const next = new Set();
            prev.forEach((k) => {
                if (remainingSet.has(k)) next.add(k);
            });
            return next;
        });
    }, [remainingList]);

    // Ausgewählte ToDos (nur aus remainingList)
    const selectedTodos = useMemo(
        () => remainingList.filter((t) => selectedKeys.has(getTodoKey(t))),
        [remainingList, selectedKeys]
    );

    // Summe der Dauer (Sekunden) aller ausgewählten ToDos
    const selectedTotalSeconds = useMemo(
        () => selectedTodos.reduce((sum, t) => sum + durationToSeconds(t), 0),
        [selectedTodos]
    );

    // Checkbox-Selection toggeln
    const toggleSelectTodo = (todo) => {
        const key = getTodoKey(todo);
        setSelectedKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    // -------------------------------------------------------------
    // TIMER/MODES
    // mode: "idle" | "learning" | "pause"
    // learning:
    //  - erst Timer runterzählen (Batch)
    //  - danach "Freies Lernen" hochzählen
    // pause:
    //  - runterzählen
    // -------------------------------------------------------------
    const [mode, setMode] = useState("idle");
    const isLearning = mode === "learning";
    const isPause = mode === "pause";

    // Batch = ausgewählte ToDos (Timer-Phase)
    const [batchKeys, setBatchKeys] = useState([]); // array<string>
    const [batchRemainingSeconds, setBatchRemainingSeconds] = useState(0);

    // Freies Lernen (Stopuhr nach dem Batch)
    const [freeSeconds, setFreeSeconds] = useState(0);

    // Pause-Counter
    const [pauseSeconds, setPauseSeconds] = useState(0);

    // Ref, damit setInterval immer den aktuellen Wert kennt
    const batchRemainingRef = useRef(batchRemainingSeconds);
    useEffect(() => {
        batchRemainingRef.current = batchRemainingSeconds;
    }, [batchRemainingSeconds]);

    // -------------------------------------------------------------
    // MODALS (Pop-ups)
    // modal: null | check | choice | pauseDuration | ready
    // -------------------------------------------------------------
    const [modal, setModal] = useState(null);
    const [pauseH, setPauseH] = useState(0);
    const [pauseM, setPauseM] = useState(1);

    // Timer-Snapshot für die Anzeige im "Bist du noch am Lernen?"-Popup
    const [checkTimeSnapshot, setCheckTimeSnapshot] = useState("");

    // -------------------------------------------------------------
    // DISPLAY TIME (was oben angezeigt wird)
    // -------------------------------------------------------------
    const displayTime = useMemo(() => {
        if (isPause) return formatTime(pauseSeconds);
        if (isLearning && batchRemainingSeconds > 0) return formatTime(batchRemainingSeconds);
        return formatTime(freeSeconds);
    }, [isPause, pauseSeconds, isLearning, batchRemainingSeconds, freeSeconds]);

    // Ref: damit wir bei Popup-Erstellung den exakten Timer-Wert haben
    const displayTimeRef = useRef(displayTime);
    useEffect(() => {
        displayTimeRef.current = displayTime;
    }, [displayTime]);

    // -------------------------------------------------------------
    // LEARNING INTERVAL (ein einziges Interval für learning)
    // - zählt Batch runter
    // - danach freeSeconds hoch
    // -------------------------------------------------------------
    const learningIntervalRef = useRef(null);

    useEffect(() => {
        // Sicherstellen, dass nie mehrere Intervalle gleichzeitig laufen
        if (learningIntervalRef.current) {
            clearInterval(learningIntervalRef.current);
            learningIntervalRef.current = null;
        }
        if (!isLearning) return;

        learningIntervalRef.current = setInterval(() => {
            const r = batchRemainingRef.current;

            if (r > 0) {
                setBatchRemainingSeconds((prev) => Math.max(0, prev - 1));
            } else {
                setFreeSeconds((prev) => prev + 1);
            }
        }, 1000);

        return () => {
            if (learningIntervalRef.current) {
                clearInterval(learningIntervalRef.current);
                learningIntervalRef.current = null;
            }
        };
    }, [isLearning]);

    // -------------------------------------------------------------
    // BATCH FINISH (Timer-Phase endet)
    // -> markiert die Batch-ToDos als erledigt (session-local)
    // -> optional: setzt done=true im Haupt-ToDo-Context
    // -> danach startet "Freies Lernen"
    // -------------------------------------------------------------
    const wasCountingDownRef = useRef(false);

    useEffect(() => {
        const isCountingDownNow = batchKeys.length > 0 && batchRemainingSeconds > 0;

        // Übergang: vorher war Timer aktiv, jetzt ist er bei 0
        if (wasCountingDownRef.current && batchKeys.length > 0 && batchRemainingSeconds === 0) {
            const batchSet = new Set(batchKeys);
            const finished = todos.filter((t) => batchSet.has(getTodoKey(t)));

            // 1) UI: erledigt markieren
            setCompletedKeys((prev) => {
                const next = new Set(prev);
                finished.forEach((t) => next.add(getTodoKey(t)));
                return next;
            });

            // 2) Optional: done im "großen" ToDo-Store toggeln (falls categoryId vorhanden)
            finished.forEach((t) => {
                if (t?.categoryId !== undefined && t?.categoryId !== null) {
                    toggleTodo(t.categoryId, t.id);
                }
            });

            // 3) Batch zurücksetzen und "Freies Lernen" starten
            setBatchKeys([]);
            setSelectedKeys(new Set());
            setFreeSeconds(0);
        }

        wasCountingDownRef.current = isCountingDownNow;
    }, [batchKeys, batchRemainingSeconds, todos, toggleTodo]);

    // -------------------------------------------------------------
    // PAUSE INTERVAL
    // -------------------------------------------------------------
    const pauseIntervalRef = useRef(null);

    useEffect(() => {
        if (pauseIntervalRef.current) {
            clearInterval(pauseIntervalRef.current);
            pauseIntervalRef.current = null;
        }
        if (!isPause) return;

        pauseIntervalRef.current = setInterval(() => {
            setPauseSeconds((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => {
            if (pauseIntervalRef.current) {
                clearInterval(pauseIntervalRef.current);
                pauseIntervalRef.current = null;
            }
        };
    }, [isPause]);

    // Wenn Pause fertig ist -> "Bereit?" Popup
    useEffect(() => {
        if (!isPause) return;
        if (pauseSeconds > 0) return;

        setMode("idle");
        setModal("ready");
    }, [isPause, pauseSeconds]);

    // -------------------------------------------------------------
    // POPUP-TIMER (nach X Minuten - aus Settings)
    // -> fragt: "Bist du noch am Lernen?"
    // -> wenn "Aus" eingestellt ist: kein Popup
    // -------------------------------------------------------------
    const popupTimeoutRef = useRef(null);
    const learningStartedAtRef = useRef(false);

    useEffect(() => {
        // Wenn Reminder deaktiviert ist, Timer sicher stoppen
        if (learningReminderMs === null) {
            if (popupTimeoutRef.current) {
                clearTimeout(popupTimeoutRef.current);
                popupTimeoutRef.current = null;
            }
            learningStartedAtRef.current = false;
            return;
        }

        // Wenn nicht learning oder ein Popup offen ist -> Timer resetten
        if (!isLearning || modal !== null) {
            if (popupTimeoutRef.current) {
                clearTimeout(popupTimeoutRef.current);
                popupTimeoutRef.current = null;
            }
            learningStartedAtRef.current = false;
            return;
        }

        // Startet Reminder genau einmal pro Lern-Phase
        if (!learningStartedAtRef.current) {
            learningStartedAtRef.current = true;

            popupTimeoutRef.current = setTimeout(() => {
                // Snapshot damit im Popup die gleiche Zeit steht wie im UI
                setCheckTimeSnapshot(displayTimeRef.current);
                setMode("idle");
                setModal("check");
                popupTimeoutRef.current = null;
                learningStartedAtRef.current = false;
            }, learningReminderMs);
        }

        return () => {};
    }, [isLearning, modal, learningReminderMs]);

    // -------------------------------------------------------------
    // PERMANENTES ENTFERNEN erledigter ToDos
    // -> passiert nur wenn Session wirklich beendet wird (Stop / Beenden)
    // -------------------------------------------------------------
    const permanentlyRemoveCompletedFromLearningMode = () => {
        const keys = completedKeys;
        if (!keys || keys.size === 0) return;

        keys.forEach((k) => {
            removeLearningTodo(k);
        });
    };

    // -------------------------------------------------------------
    // BUTTON HANDLER
    // -------------------------------------------------------------
    const handleStart = () => {
        // Wenn noch kein Batch aktiv ist, muss vorher eine Auswahl existieren
        if (!isLearning && batchKeys.length === 0) {
            if (selectedTodos.length === 0 || selectedTotalSeconds <= 0) return;

            setBatchKeys(selectedTodos.map((t) => getTodoKey(t)));
            setBatchRemainingSeconds(selectedTotalSeconds);
            setFreeSeconds(0);
        }
        setMode("learning");
    };

    const handlePauseButton = () => setMode("idle");

    const handleStop = () => {
        // Session beenden -> erledigte ToDos endgültig entfernen
        permanentlyRemoveCompletedFromLearningMode();

        // Lokalen Zustand zurücksetzen
        setMode("idle");
        setModal(null);
        setBatchKeys([]);
        setBatchRemainingSeconds(0);
        setFreeSeconds(0);
        setPauseSeconds(0);
        setSelectedKeys(new Set());
        setCompletedKeys(new Set());
        wasCountingDownRef.current = false;

        // Popup-Timer sauber stoppen
        if (popupTimeoutRef.current) {
            clearTimeout(popupTimeoutRef.current);
            popupTimeoutRef.current = null;
        }
        learningStartedAtRef.current = false;
    };

    // Während Pause: Stop beendet Pause und zeigt sofort "Bereit?"
    const handleStopDuringPause = () => {
        setMode("idle");
        setModal("ready");
    };

    // -------------------------------------------------------------
    // MODAL ACTIONS
    // -------------------------------------------------------------
    const onCheckYes = () => {
        setModal(null);
        setMode("learning");
    };

    const onCheckNo = () => setModal("choice");

    const onChoiceEnd = () => {
        handleStop();
    };

    const onChoiceContinue = () => {
        setModal(null);
        setMode("learning");
    };

    const onChoicePause = () => setModal("pauseDuration");

    const onPauseConfirm = () => {
        const h = Number.isFinite(+pauseH) ? Math.max(0, Math.min(23, +pauseH)) : 0;
        const m = Number.isFinite(+pauseM) ? Math.max(0, Math.min(59, +pauseM)) : 0;
        const total = h * 3600 + m * 60;
        if (total <= 0) return;

        setPauseSeconds(total);
        setModal(null);
        setMode("pause");
    };

    const onPauseBack = () => setModal("choice");

    const onReadyContinue = () => {
        setModal(null);
        setMode("learning");
    };

    const onReadyEnd = () => {
        handleStop();
    };

    // -------------------------------------------------------------
    // UI-Zustände (Label, Farben, Buttons)
    // -------------------------------------------------------------
    const statusLabel = isPause
        ? t('learningMode.status.pauseRunning')
        : isLearning
            ? batchRemainingSeconds > 0
                ? t('learningMode.status.learningTimer')
                : t('learningMode.status.freeLearning')
            : t('learningMode.status.readyToLearn');

    const statusColorClass = isPause
        ? "text-orange-600 dark:text-orange-400"
        : isLearning
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400";

    // Während ein Batch-Timer läuft, darf man nicht mehr auswählen
    const selectionLocked = isLearning && batchRemainingSeconds > 0;

    // Start ist gesperrt, wenn Pause läuft oder keine Auswahl vorhanden ist
    const startDisabled =
        isPause ||
        (!isLearning &&
            batchKeys.length === 0 &&
            (selectedTodos.length === 0 || selectedTotalSeconds <= 0));

    const pauseDisabled = isPause;

    // Sanduhr: drehen beim Lernen, pulsieren in Pause
    const hourglassAnimClass = isLearning
        ? "animate-hourglass-rotate"
        : isPause
            ? "animate-pulse"
            : "";

    // -------------------------------------------------------------
    // UI
    // -------------------------------------------------------------
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            <div className="flex-1 p-4 pb-24 md:p-8 md:pb-8 overflow-auto">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-[calc(100vh-200px)]">
                    {/* Left: ToDos */}
                    <div className="w-full md:w-[320px] md:flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden md:min-h-[640px]">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                                <span className="font-medium text-gray-800 dark:text-gray-200">To-Dos</span>
                            </div>

                            <div className="p-5">
                                {/* Completed section (top) */}
                                {completedList.length > 0 && (
                                    <div className="mb-5">
                                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                            {t('learningMode.completed')}
                                        </div>
                                        <div className="space-y-2">
                                            {completedList.map((t) => (
                                                <div key={getTodoKey(t)} className="text-sm text-gray-700 dark:text-gray-300">
                                                    ✓ {t.title}
                                                    {durationToSeconds(t) > 0 ? (
                                                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                              {" "}
                                                            ({formatDuration(t)})
                            </span>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 border-t border-gray-200 dark:border-gray-700" />
                                    </div>
                                )}

                                {/* Auswahl-Info */}
                                <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">{t('learningMode.selected')}:</span> {selectedTodos.length} To-Do(s)
                                    {selectedTotalSeconds > 0 && (
                                        <span className="text-gray-500 dark:text-gray-400">
                      {" "}
                                            • {t('learningMode.total')}: {formatTime(selectedTotalSeconds)}
                    </span>
                                    )}
                                    {selectionLocked && (
                                        <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">({t('learningMode.running')})</span>
                                    )}
                                </div>

                                {/* Full list */}
                                <div className="space-y-3">
                                    {todos.length === 0 ? (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('learningMode.empty')}
                                        </div>
                                    ) : (
                                        todos.map((todo) => {
                                            const key = getTodoKey(todo);
                                            const isCompleted = completedKeys.has(key);

                                            // Auswahl nur möglich wenn nicht erledigt und nicht gesperrt
                                            const isSelectable = !isCompleted && !selectionLocked;
                                            const isSelected = selectedKeys.has(key);

                                            return (
                                                <label
                                                    key={key}
                                                    className={`flex items-center gap-3 text-sm select-none ${
                                                        isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-70"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompleted ? true : isSelected}
                                                        disabled={!isSelectable}
                                                        onChange={() => {
                                                            if (!isSelectable) return;
                                                            toggleSelectTodo(todo);
                                                        }}
                                                        className="w-4 h-4"
                                                    />
                                                    <span
                                                        className={
                                                            isCompleted
                                                                ? "line-through text-gray-500 dark:text-gray-500"
                                                                : "text-gray-800 dark:text-gray-200"
                                                        }
                                                    >
                            {todo.title}{" "}
                                                        {durationToSeconds(todo) > 0 && (
                                                            <span className="text-gray-400 dark:text-gray-500 text-xs">
                                ({formatDuration(todo)})
                              </span>
                                                        )}
                          </span>
                                                </label>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Main */}
                    <div className="flex-1 min-w-0 w-full">
                        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg min-h-[400px] md:min-h-[640px] flex flex-col">
                            <div className="flex-1 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                    {/* Status-Überschrift */}
                                    <div className={`text-sm font-semibold mb-3 ${statusColorClass}`}>{statusLabel}</div>

                                    {/* Timer */}
                                    <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tabular-nums mb-8">
                                        {displayTime}
                                    </div>

                                    {/* Sanduhr */}
                                    <svg
                                        viewBox="0 0 24 24"
                                        className={`w-28 h-28 md:w-40 md:h-40 text-black dark:text-gray-200 ${hourglassAnimClass}`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M6 2h12" />
                                        <path d="M6 22h12" />
                                        <path d="M8 2v6a4 4 0 0 0 1.17 2.83L12 13.66l2.83-2.83A4 4 0 0 0 16 8V2" />
                                        <path d="M16 22v-6a4 4 0 0 0-1.17-2.83L12 10.34 9.17 13.17A4 4 0 0 0 8 16v6" />
                                    </svg>

                                    {/* Controls */}
                                    <div className="mt-10 flex items-center gap-4">
                                        {/* Start */}
                                        <button
                                            onClick={startDisabled ? undefined : handleStart}
                                            disabled={startDisabled}
                                            className={`w-12 h-12 rounded-lg border flex items-center justify-center ${
                                                startDisabled
                                                    ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60"
                                                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                            title={t('learningMode.controls.start')}
                                            type="button"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-900 dark:text-gray-100" fill="currentColor">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </button>

                                        {/* Pause */}
                                        <button
                                            onClick={pauseDisabled ? undefined : handlePauseButton}
                                            disabled={pauseDisabled}
                                            className={`w-12 h-12 rounded-lg border flex items-center justify-center ${
                                                pauseDisabled
                                                    ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60"
                                                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                            title={t('learningMode.controls.pause')}
                                            type="button"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-900 dark:text-gray-100" fill="currentColor">
                                                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                                            </svg>
                                        </button>

                                        {/* Stop */}
                                        <button
                                            onClick={isPause ? handleStopDuringPause : handleStop}
                                            className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
                                            title={isPause ? t('learningMode.controls.endPause') : t('learningMode.controls.stop')}
                                            type="button"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-900 dark:text-gray-100" fill="currentColor">
                                                <path d="M6 6h12v12H6z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Keyframes für Sanduhr drehen */}
                                    <style>{`
                    @keyframes hourglass-rotate {
                      0% { transform: rotate(0deg); }
                      45% { transform: rotate(0deg); }
                      55% { transform: rotate(180deg); }
                      100% { transform: rotate(180deg); }
                    }
                    .animate-hourglass-rotate {
                      animation: hourglass-rotate 6s ease-in-out infinite;
                    }
                  `}</style>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {modal !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Hintergrund */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Box */}
                    <div className="relative w-[360px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Assistant</div>
                        </div>

                        <div className="px-5 py-5">
                            {/* Check */}
                            {modal === "check" && (
                                <div>
                                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{t('learningMode.modal.check.title')}</div>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        {t('learningMode.modal.check.currentTimer')} <span className="font-semibold">{checkTimeSnapshot || displayTime}</span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <button
                                            onClick={onCheckYes}
                                            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-800 dark:text-gray-200"
                                        >
                                            {t('learningMode.modal.check.yes')}
                                        </button>
                                        <button
                                            onClick={onCheckNo}
                                            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-800 dark:text-gray-200"
                                        >
                                            {t('learningMode.modal.check.no')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Choice */}
                            {modal === "choice" && (
                                <div>
                                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{t('learningMode.modal.choice.title')}</div>
                                    <div className="mt-4 flex flex-col gap-2">
                                        <button
                                            onClick={onChoiceEnd}
                                            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-left px-3 text-gray-800 dark:text-gray-200"
                                        >
                                            {t('learningMode.modal.choice.end')}
                                        </button>
                                        <button
                                            onClick={onChoicePause}
                                            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-left px-3 text-gray-800 dark:text-gray-200"
                                        >
                                            {t('learningMode.modal.choice.pause')}
                                        </button>
                                        <button
                                            onClick={onChoiceContinue}
                                            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-left px-3 text-gray-800 dark:text-gray-200"
                                        >
                                            {t('learningMode.modal.choice.continue')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Pause duration */}
                            {modal === "pauseDuration" && (
                                <div>
                                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{t('learningMode.modal.pauseDuration.title')}</div>

                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{t('learningMode.modal.pauseDuration.hours')}</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={23}
                                                value={pauseH}
                                                onChange={(e) => setPauseH(e.target.value)}
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{t('learningMode.modal.pauseDuration.minutes')}</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={59}
                                                value={pauseM}
                                                onChange={(e) => setPauseM(e.target.value)}
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md px-3 py-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <button
                                            onClick={onPauseBack}
                                            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-800 dark:text-gray-200"
                                        >
                                            {t('learningMode.modal.pauseDuration.back')}
                                        </button>
                                        <button
                                            onClick={onPauseConfirm}
                                            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-800 dark:text-gray-200"
                                        >
                                            {t('learningMode.modal.pauseDuration.confirm')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Ready */}
                            {modal === "ready" && (
                                <div>
                                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{t('learningMode.modal.ready.title')}</div>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('learningMode.modal.ready.subtitle')}</div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <button
                                            onClick={onReadyContinue}
                                            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-800 dark:text-gray-200"
                                        >
                                            {t('learningMode.modal.ready.continue')}
                                        </button>
                                        <button
                                            onClick={onReadyEnd}
                                            className="py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-800 dark:text-gray-200"
                                        >
                                            {t('learningMode.modal.ready.end')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}







