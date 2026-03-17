// -----------------------------
// Context menu for filtering/sorting todos
// -----------------------------
import React from "react";
import { useTranslation } from "react-i18next";

function FilterContextMenu({ onClose, onSortByCategory, onSortAlphabetically, onSortByDuration }) {
    const { t } = useTranslation();
    return (

        // Overlay for modal
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose} // Click outside closes menu
        >
            <div
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md p-4 min-w-[220px] text-gray-800 dark:text-gray-200"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside menu
            >
                {/* Filter options */}
                <button
                    className="w-full text-left px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded mb-1"
                    onClick={() => { onSortByCategory(); onClose(); }}
                >
                    {t("todo.filter.byCategory")}
                </button>
                <button
                    className="w-full text-left px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded mb-1"
                    onClick={() => { onSortAlphabetically(); onClose(); }}
                >
                    {t("todo.filter.alphabetical")}
                </button>
                <button
                    className="w-full text-left px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    onClick={() => { onSortByDuration(); onClose(); }}
                >
                    {t("todo.filter.byDuration")}
                </button>
            </div>
        </div>
    );
}

export default FilterContextMenu;
