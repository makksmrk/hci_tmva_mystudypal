// -----------------------------
// Context menu for categories (rename/delete)
// -----------------------------
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function CategoryContextMenu({ x, y, onRename, onDelete, onClose }) {
    const { t } = useTranslation();
    const menuRef = useRef(null);

    // Close menu if click outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow rounded z-50 w-40 text-gray-800 dark:text-gray-200"
            style={{ top: y, left: x }}
            onClick={e => e.stopPropagation()} // Prevent closing on internal click
        >
            {/* Rename option */}
            <div
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={onRename}
            >
                {t("todo.categoryMenu.rename")}
            </div>

            {/* Delete option */}
            <div
                className="px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 cursor-pointer"
                onClick={onDelete}
            >
                {t("todo.categoryMenu.delete")}
            </div>
        </div>
    );
}

export default CategoryContextMenu;
