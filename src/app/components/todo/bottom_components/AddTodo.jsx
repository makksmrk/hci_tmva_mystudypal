// Import React's useState hook
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Component for adding a new To-do item
function AddTodo({ onAdd, onCancel }) {
    const { t } = useTranslation();

    // State for input values
    const [title, setTitle] = useState(""); // To-do title
    const [hours, setHours] = useState(0);  // Duration hours
    const [minutes, setMinutes] = useState(0); // Duration minutes

    // Function triggered when "Add" button is clicked
    function handleAdd() {
        if (!title.trim()) return; // Prevent adding empty title
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return; // Validate time

        // Pass new to-do object to parent
        onAdd({
            title,
            duration: {
                hours: Number(hours),
                minutes: Number(minutes)
            }
        });
    }

    return (
        // Modal overlay
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{t("todo.addTodoTitle")}</h2>

                {/* Title input */}
                <input
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 w-full mb-4"
                    placeholder={t("todo.addTodoPlaceholder")}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                />

                {/* Duration input: hours and minutes */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="number"
                        min="0"
                        max="23"
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 w-1/2"
                        value={hours}
                        onChange={e => setHours(e.target.value)}
                    />
                    <input
                        type="number"
                        min="0"
                        max="59"
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 w-1/2"
                        value={minutes}
                        onChange={e => setMinutes(e.target.value)}
                    />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white transition"
                    >
                        {t("todo.addTodoCancel")}
                    </button>
                    <button
                        onClick={handleAdd}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white transition"
                    >
                        {t("todo.addTodoAdd")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddTodo;
