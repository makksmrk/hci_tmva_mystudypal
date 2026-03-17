import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function TodoContextMenu({ x, y, onClose, onDelete, onEditTime, todo }) {
    const { t } = useTranslation();
    const ref = useRef();

    // Close menu if clicking outside
    useEffect(() => {
        function close(e) {
            if (!ref.current.contains(e.target)) onClose();
        }
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [onClose]);

    const handleEditTime = () => {

        const currentHours = todo?.duration?.hours ?? 0;
        const currentMinutes = todo?.duration?.minutes ?? 0;


        const h = parseInt(prompt(t("todo.todoMenu.promptHours"), currentHours), 10);
        const m = parseInt(prompt(t("todo.todoMenu.promptMinutes"), currentMinutes), 10);

        if (
            Number.isFinite(h) &&
            Number.isFinite(m) &&
            h >= 0 && h <= 23 &&
            m >= 0 && m <= 59
        ) {
            onEditTime(h, m);
        }
    };

    return (
        <div
            ref={ref}
            className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow z-50 w-40 text-gray-800 dark:text-gray-200"
            style={{ top: y, left: x }}
        >
            {/* Option to edit to-do duration */}
            <div
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={handleEditTime} // <-- используем функцию с prompt
            >
                {t("todo.todoMenu.editTime")}
            </div>

            {/* Option to delete to-do */}
            <div
                className="px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 cursor-pointer"
                onClick={onDelete}
            >
                {t("todo.todoMenu.delete")}
            </div>
        </div>
    );
}

export default TodoContextMenu;
