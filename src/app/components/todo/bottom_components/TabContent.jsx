import { useState } from "react";
import { useTranslation } from "react-i18next";
import TodoContextMenu from "./TodoContextMenu.jsx";
import FilterContextMenu from "./FilterContextMenu.jsx";
import { useUserData } from "../../../store/useUserData.js";

function TabContent({
                        categories,
                        activeTabId,
                        onToggleTodo,
                        onDeleteTodo,
                        onUpdateDuration,
                        onAddTodo
                    }) {
    const activeCategory = categories.find(cat => cat.id === activeTabId);

    const [menu, setMenu] = useState(null);
    const [filterMenu, setFilterMenu] = useState(false);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [filterApplied, setFilterApplied] = useState(false);
    const [hideDone, setHideDone] = useState(false);
    const { t } = useTranslation();

    const { learningModeTodos, addLearningTodo, removeLearningTodo } = useUserData();
    const [message, setMessage] = useState(null);

    if (!activeCategory) return null;

    // -------------------------
    // Learning mode helpers
    // -------------------------
    function toggleLearningTodo(todo) {
        const exists = learningModeTodos.some(t => t.id === todo.id);
        if (exists) {
            removeLearningTodo(todo.id);
            setMessage(t("todo.learningRemove"));
        } else {
            addLearningTodo(todo);
            setMessage(t("todo.learningAdd"));
        }
        setTimeout(() => setMessage(null), 1500);
    }

    function isInLearning(todoId) {
        return learningModeTodos.some(t => t.id === todoId);
    }

    // -------------------------
    // Gesamtübersicht
    // -------------------------
    if (activeCategory.id === 0) {
        const allTodos = categories
            .filter(cat => cat.id !== 0)
            .flatMap(cat =>
                cat.todos.map(todo => ({
                    ...todo,
                    categoryId: cat.id
                }))
            );

        let displayedTodos = filterApplied ? filteredTodos : allTodos;
        if (hideDone) displayedTodos = displayedTodos.filter(t => !t.done);

        return (
            <div className="relative border-2 border-gray-300 dark:border-gray-700 rounded p-4 pt-16 bg-white dark:bg-gray-800">
                <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">{t("todo.overview")}</h2>

                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={() => setHideDone(p => !p)}
                        className={`w-36 h-8 rounded-full text-sm transition
                            ${hideDone ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}
                    >
                        {hideDone ? t("todo.hideDone") : t("todo.showAll")}
                    </button>

                    <button
                        onClick={() => setFilterMenu(true)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-500 text-gray-700 dark:text-gray-200 hover:text-white transition flex items-center justify-center"
                    >
                        ☰
                    </button>
                </div>

                {displayedTodos.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 mt-4">{t("todo.none")}</p>
                )}

                {displayedTodos.map(todo => {
                    const originalTodo =
                        categories
                            .find(cat => cat.id === todo.categoryId)
                            ?.todos.find(t => t.id === todo.id);

                    if (!originalTodo) return null;

                    return (
                        <div
                            key={`${todo.categoryId}-${todo.id}`}
                            className="grid grid-cols-[1fr_1fr_auto] items-center py-2 mt-2"
                        >
                            <label className={`flex items-center gap-2 ${originalTodo.done ? "line-through text-gray-400 dark:text-gray-500" : originalTodo.text}`}>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        toggleLearningTodo(todo);
                                    }}
                                    className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-200"
                                >
                                    {isInLearning(todo.id) ? "✓" : "+"}
                                </button>

                                <input
                                    type="checkbox"
                                    checked={originalTodo.done}
                                    onChange={() => onToggleTodo(todo.categoryId, todo.id)}
                                />

                                {todo.title}
                            </label>

                            <span className={originalTodo.done ? "text-gray-400 dark:text-gray-500" : originalTodo.text}>
                                {String(todo.duration.hours).padStart(2, "0")} h :
                                {String(todo.duration.minutes).padStart(2, "0")} min
                            </span>

                        </div>
                    );
                })}

                {filterMenu && (
                    <FilterContextMenu
                        onClose={() => setFilterMenu(false)}
                        onSortByCategory={() => {
                            setFilteredTodos([...allTodos].sort((a, b) => a.categoryId - b.categoryId));
                            setFilterApplied(true);
                        }}
                        onSortAlphabetically={() => {
                            setFilteredTodos([...allTodos].sort((a, b) => a.title.localeCompare(b.title)));
                            setFilterApplied(true);
                        }}
                        onSortByDuration={() => {
                            setFilteredTodos([...allTodos].sort((a, b) => {
                                const da = a.duration.hours * 60 + a.duration.minutes;
                                const db = b.duration.hours * 60 + b.duration.minutes;
                                return da - db;
                            }));
                            setFilterApplied(true);
                        }}
                    />
                )}

                {message && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow">
                        {message}
                    </div>
                )}
            </div>
        );
    }

    // -------------------------
    // Single category view
    // -------------------------
    return (
        <div className="relative border-2 border-gray-300 dark:border-gray-700 rounded p-4 pt-16 bg-white dark:bg-gray-800">
            <h2 className={`font-bold text-lg mb-4 ${activeCategory.text}`}>
                {activeCategory.name}
            </h2>

            <div className="absolute top-2 right-2 flex gap-2">
                <button
                    onClick={onAddTodo}
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 text-gray-700 dark:text-gray-200 hover:text-white transition text-xl"
                >
                    +
                </button>

                <button
                    onClick={() => setHideDone(p => !p)}
                    className={`w-36 h-8 rounded-full text-sm transition
                        ${hideDone ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}
                >
                    {hideDone ? t("todo.hideDone") : t("todo.showAll")}
                </button>
            </div>

            {activeCategory.todos
                .filter(todo => !hideDone || !todo.done)
                .map(todo => (
                    <div key={todo.id} className="grid grid-cols-[1fr_1fr_auto] items-center py-2">
                        <label className={`flex items-center gap-2 ${todo.done ? "line-through text-gray-400 dark:text-gray-500" : todo.text}`}>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    toggleLearningTodo(todo);
                                }}
                                className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-200"
                            >
                                {isInLearning(todo.id) ? "✓" : "+"}
                            </button>

                            <input
                                type="checkbox"
                                checked={todo.done}
                                onChange={() => onToggleTodo(activeCategory.id, todo.id)}
                            />

                            {todo.title}
                        </label>

                        <span className={todo.done ? "text-gray-400 dark:text-gray-500" : todo.text}>
                            {String(todo.duration.hours).padStart(2, "0")} h :
                            {String(todo.duration.minutes).padStart(2, "0")} min
                        </span>

                        <button
                            className="px-3 text-xl opacity-100 hover:opacity-100 text-gray-700 dark:text-gray-200"
                            onClick={e => {
                                e.stopPropagation();
                                setMenu({ x: e.clientX, y: e.clientY, todo });
                            }}
                        >
                            …
                        </button>
                    </div>
                ))}

            {menu && (
                <TodoContextMenu
                    x={menu.x}
                    y={menu.y}
                    todo={menu.todo}
                    onClose={() => setMenu(null)}
                    onDelete={() => {
                        onDeleteTodo(activeCategory.id, menu.todo.id);
                        setMenu(null);
                    }}
                    onEditTime={(h, m) => {
                        onUpdateDuration(activeCategory.id, menu.todo.id, {
                            hours: h,
                            minutes: m
                        });
                        setMenu(null);
                    }}
                />
            )}

            {message && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow">
                    {message}
                </div>
            )}
        </div>
    );
}

export default TabContent;
