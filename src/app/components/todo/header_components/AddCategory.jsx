// -----------------------------
// Component for adding a new category
// -----------------------------
import { useState } from "react";
import { useTranslation } from "react-i18next";

function AddCategory({ onAdd, onCancel }) {
    const { t } = useTranslation();
    const [name, setName] = useState(""); // Category name input
    const [color, setColor] = useState("bg-blue-300"); // Selected background color

    // Predefined color options with hover and text styles
    const colors = [
        { bg: "bg-blue-300", hover: "hover:bg-blue-400", text: "text-blue-500" },
        { bg: "bg-green-300", hover: "hover:bg-green-400", text: "text-green-500" },
        { bg: "bg-orange-300", hover: "hover:bg-orange-400", text: "text-orange-500" },
        { bg: "bg-purple-300", hover: "hover:bg-purple-400", text: "text-purple-500" },
        { bg: "bg-yellow-300", hover: "hover:bg-yellow-400", text: "text-yellow-500" },
        { bg: "bg-pink-300", hover: "hover:bg-pink-400", text: "text-pink-500" },
        { bg: "bg-red-300", hover: "hover:bg-red-400", text: "text-red-500" },
        { bg: "bg-teal-300", hover: "hover:bg-teal-400", text: "text-teal-500" },
        { bg: "bg-cyan-300", hover: "hover:bg-cyan-400", text: "text-cyan-500" },
        { bg: "bg-amber-300", hover: "hover:bg-amber-400", text: "text-amber-500" },
        { bg: "bg-lime-300", hover: "hover:bg-lime-400", text: "text-lime-500" },
        { bg: "bg-indigo-300", hover: "hover:bg-indigo-400", text: "text-indigo-500" }
    ];

    // Function triggered when adding a category
    function handleAdd() {
        if (!name.trim()) return; // Prevent empty name

        const selected = colors.find(c => c.bg === color);
        onAdd({
            name,
            color: selected.bg,   // Background color
            hover: selected.hover, // Hover style
            text: selected.text   // Text color
        });
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{t("todo.addCategoryTitle")}</h2>

                {/* Category name input */}
                <input
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 w-full mb-4"
                    placeholder={t("todo.addCategoryPlaceholder")}
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                {/* Color selection grid */}
                <div className="grid grid-cols-6 gap-2 mb-4">
                    {colors.map(c => (
                        <div
                            key={c.bg}
                            onClick={() => setColor(c.bg)} // Select color
                            className={`
                                w-8 h-8 rounded cursor-pointer
                                ${c.bg}
                                ${color === c.bg ? "ring-2 ring-black dark:ring-white" : ""} // Highlight selected color
                            `}
                        />
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleAdd}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white transition"
                    >
                        {t("todo.addCategoryAdd")}
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white transition"
                    >
                        {t("todo.addCategoryCancel")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCategory;

