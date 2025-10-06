import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AnnouncementsSection({ announcements }) {
    const { t, i18n } = useTranslation();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Use 'hi-IN' for Hindi dates, 'en-IN' for English to get correct formatting
        const locale = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
        return date.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center"> {t('announcementsTitle')}</h2>
            {announcements.length === 0 && <p className="text-center text-gray-500">{t('noAnnouncements')}</p>}
            <div className="space-y-4">
                {announcements.map(ann => (
                    <div key={ann.id} className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="font-bold text-lg text-green-800">{ann.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{t('postedOn')}: {formatDate(ann.createdAt)}</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{ann.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

