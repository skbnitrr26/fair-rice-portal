import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '../shared/InputField.jsx';

export default function CheckGrievanceStatus() {
    const { t, i18n } = useTranslation();
    const [trackingId, setTrackingId] = useState('');
    const [grievance, setGrievance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!trackingId) return;
        setIsLoading(true);
        setError('');
        setGrievance(null);
        try {
            const response = await fetch(`/api/grievances/public/status/${trackingId}`);
            if (!response.ok) throw new Error('Tracking ID not found.');
            setGrievance(await response.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const locale = i18n.language.startsWith('hi') ? 'hi-IN' : 'en-IN';
        return new Date(dateString).toLocaleString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('checkStatusTitle')}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <InputField label={t('trackingIdLabel')} name="trackingId" value={trackingId} onChange={(e) => setTrackingId(e.target.value.toUpperCase())} />
                <button type="submit" disabled={isLoading} className="h-12 sm:mt-7 bg-gray-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400">
                    {isLoading ? t('checkingBtn') : t('checkBtn')}
                </button>
            </form>
            {error && <div className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}
            
            {grievance && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-4">
                    <div>
                        <h3 className="font-bold text-lg">{t('statusFor')} <span className="font-mono">{grievance.trackingId}</span></h3>
                        <p><strong>{t('subject')}:</strong> {grievance.subject}</p>
                        <p><strong>{t('submittedOn')}:</strong> {formatDate(grievance.createdAt)}</p>
                        <p className="flex items-center gap-2"><strong>{t('currentStatus')}:</strong> <span className={`font-semibold px-2 py-1 text-sm rounded-full ${getStatusColor(grievance.status)}`}>{grievance.status}</span></p>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-bold text-gray-800">{t('adminComments')}</h4>
                        {grievance.comments && grievance.comments.length > 0 ? (
                            <div className="mt-2 space-y-3 text-sm">
                                {grievance.comments.map(comment => (
                                    <div key={comment.id} className="p-3 bg-white border-l-4 border-green-400 rounded-r-md">
                                        <p className="text-gray-700">{comment.content}</p>
                                        <p className="text-xs text-gray-500 text-right mt-1">
                                            {formatDate(comment.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 mt-1 italic">{t('noCommentsYet')}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

