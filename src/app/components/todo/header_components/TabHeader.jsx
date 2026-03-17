// -----------------------------
// Tab header: displays all category tabs
// -----------------------------
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CategoryContextMenu from "./CategoryContextMenu.jsx";

function TabHeader({ categories, activeTabId, onTabChange, onRenameCategory, onDeleteCategory, onAddClick }) {
    const { t } = useTranslation();
    const [contextMenu, setContextMenu] = useState(null); // Stores context menu position/data
    const touchTimeoutRef = useRef(null);

    // Desktop: Handle right-click on category tab
    function handleContextMenu(e, cat) {
        e.preventDefault();

        if (cat.id === 0) return; // Prevent context menu for "Gesamtübersicht"

        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            category: cat
        });
    }

    // Mobile: long Touch
    function handleTouchStart(cat) {
        if (cat.id === 0) return;

        touchTimeoutRef.current = setTimeout(() => {
            setContextMenu({
                x: window.innerWidth / 2 - 100, // centered on mobile
                y: window.innerHeight / 2 - 50,
                category: cat
            });
        }, 600); // hold for 600ms
    }

    function handleTouchEnd() {
        if (touchTimeoutRef.current) {
            clearTimeout(touchTimeoutRef.current);
            touchTimeoutRef.current = null;
        }
    }

    function closeMenu() {
        setContextMenu(null);
    }

    return (
        <div className="border-2 border-gray-300 dark:border-gray-700 rounded mb-2 p-2">
            <div className="flex items-center gap-2">
                <div className="flex-1 overflow-x-auto">
                    <div className="flex items-center gap-2 flex-nowrap min-w-max pr-2">
                        {/* Render all category tabs */}
                        {categories.map(cat => (
                            <div
                                key={cat.id}
                                onClick={() => onTabChange(cat.id)}
                                onContextMenu={e => handleContextMenu(e, cat)}
                                onTouchStart={() => handleTouchStart(cat)}
                                onTouchEnd={handleTouchEnd}
                                className={`
                                    px-4 py-2 rounded shadow cursor-pointer whitespace-nowrap
                                    ${cat.color} ${cat.hover} transition-colors
                                    ${activeTabId === cat.id ? "ring-2 ring-inset ring-black dark:ring-white" : ""}
                                `}
                            >
                                {cat.id === 0 ? t("todo.overview") : cat.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add category button */}
                <button
                    onClick={onAddClick}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors text-2xl"
                >
                    +
                </button>
            </div>

            {/* Category context menu */}
            {contextMenu && (
                <CategoryContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onRename={() => {
                        onRenameCategory(contextMenu.category);
                        closeMenu();
                    }}
                    onDelete={() => {
                        onDeleteCategory(contextMenu.category.id);
                        closeMenu();
                    }}
                    onClose={closeMenu}
                />
            )}
        </div>
    );
}

export default TabHeader;
