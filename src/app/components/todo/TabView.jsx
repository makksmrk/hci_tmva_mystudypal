import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserData } from "../../store/useUserData";
import TabHeader from "./header_components/TabHeader";
import TabContent from "./bottom_components/TabContent";
import AddCategory from "./header_components/AddCategory";
import AddTodo from "./bottom_components/AddTodo";

function TabView() {
    const { t } = useTranslation();
    const {
        userData,
        addTodo,
        toggleTodo,
        deleteTodo,
        addCategory,
        renameCategory,
        deleteCategory,
        updateTodoDuration, // 👈 НОВАЯ ФИЧА ИЗ CONTEXT
    } = useUserData();

    const [activeTabId, setActiveTabId] = useState(0);
    const [showAdd, setShowAdd] = useState(false);
    const [showAddTodo, setShowAddTodo] = useState(false);

    // Категории ТОЛЬКО из Context
    const categories = userData?.todos?.categories || [];

    return (
        <div className="border border-gray-300 dark:border-gray-700 rounded shadow p-4 bg-white dark:bg-gray-800 w-full min-w-0">
            <TabHeader
                categories={categories}
                activeTabId={activeTabId}
                onTabChange={setActiveTabId}
                onAddClick={() => setShowAdd(true)}
                onRenameCategory={(cat) => {
                    const newName = prompt(t("todo.renamePrompt"), cat.name);
                    if (newName?.trim()) {
                        renameCategory(cat.id, newName);
                    }
                }}
                onDeleteCategory={deleteCategory}
            />

            <TabContent
                categories={categories}
                activeTabId={activeTabId}
                onToggleTodo={toggleTodo}
                onDeleteTodo={deleteTodo}
                onUpdateDuration={updateTodoDuration} // 👈 НОВАЯ ФИЧА
                onAddTodo={() => setShowAddTodo(true)}
            />

            {showAdd && (
                <AddCategory
                    onAdd={(categoryData) => {
                        addCategory(categoryData);
                        setShowAdd(false);
                    }}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {showAddTodo && (
                <AddTodo
                    onAdd={(todo) => {
                        addTodo(activeTabId, todo);
                        setShowAddTodo(false);
                    }}
                    onCancel={() => setShowAddTodo(false)}
                />
            )}
        </div>
    );
}

export default TabView;
