import TabView from "../components/todo/TabView.jsx"

export function TodoPage() {
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="flex-1 p-4 sm:p-8 overflow-auto min-h-0">
                <TabView />
            </div>
        </div>
    );
}
