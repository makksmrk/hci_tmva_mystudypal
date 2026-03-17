import React from 'react';
import { useTranslation } from 'react-i18next';

// Liste der auswählbaren Profilbilder
const avatarOptions = [
    'https://www.stallbedarf24.de/ratgeber/wp-content/uploads/2023/09/katze-auf-einer-mauer-1024x584.jpg', // Katze
    'https://images.welt.de/67e361474043cc0cc565f233/5a358681466160cfdf3d15fd2131776c/ci23x11-w2000/golden-retriever-puppy-portrait', // Hund
    'https://cdn.mixerama.de/thumbnail/30/2c/e1/1680100469/Kaninchen_quer_1920x1920.jpg', // Kaninchen
    'https://static.vecteezy.com/system/resources/thumbnails/036/734/873/small/ai-generated-books-stacked-isolated-on-transparent-background-free-png.png', // Bücherstapel
    'https://img.freepik.com/vektoren-kostenlos/gluehbirne_78370-520.jpg?semt=ais_hybrid&w=740&q=80' // Glühbirne

];

export default function ProfileMocked({ open, values, onChange, onClose, onSave }) {
    const { t } = useTranslation();
    if (!open) return null;

    function handleChange(e) {
        const { name, value } = e.target;
        onChange({
            ...values,
            [name]: value,
        });
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            {/* POPUP */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[600px] max-w-[92vw] p-4 sm:p-6"
            >
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{t('profile.title')}</h2>

                {/* AVATAR AUSWAHL */}
                <div className="mb-6">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {t('profile.avatarLabel')}
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {avatarOptions.map((src) => (
                            <img
                                key={src}
                                src={src}
                                alt="Avatar"
                                onClick={() => onChange({ ...values, avatar: src })}
                                className={`w-16 h-16 rounded-full cursor-pointer border-2 transition-all ${
                                    values.avatar === src
                                        ? 'border-blue-500 scale-105'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* FORM */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('profile.lastName')}</label>
                        <input
                            name="nachname"
                            value={values.nachname}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('profile.firstName')}</label>
                        <input
                            name="vorname"
                            value={values.vorname}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('profile.birthDate')}</label>
                        <input
                            type="date"
                            name="geburtstag"
                            value={values.geburtstag}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('profile.email')}</label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:text-blue-600 hover:border-blue-600 cursor-pointer transition-colors duration-200"
                    >
                        {t('profile.cancel')}
                    </button>

                    <button
                        onClick={onSave}
                        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
                    >
                        {t('profile.save')}
                    </button>
                </div>
            </div>
        </div>
    );
}
