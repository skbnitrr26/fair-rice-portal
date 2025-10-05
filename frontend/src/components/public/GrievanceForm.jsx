import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '../shared/InputField.jsx';

export default function GrievanceForm() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ subject: '', content: '', contactInfo: '' });
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleTextChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');
        const submissionData = new FormData();
        submissionData.append('grievance', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
        if (imageFile) {
            submissionData.append('image', imageFile);
        }
        
        try {
            const response = await fetch('/api/grievances/public', { method: 'POST', body: submissionData });
            if (!response.ok) throw new Error('Failed to submit grievance.');
            const result = await response.json();
            setMessage(
                <span>
                    {t('grievanceSuccess')} 
                    <strong className="bg-yellow-200 px-2 py-1 rounded">{result.trackingId}</strong>
                </span>
            );
            setFormData({ subject: '', content: '', contactInfo: '' });
            setImageFile(null);
            e.target.reset();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('grievanceTitle')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField label={t('subject')} name="subject" value={formData.subject} onChange={handleTextChange} />
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">{t('describeIssue')}</label>
                    <textarea id="content" name="content" value={formData.content} onChange={handleTextChange} rows="5" required className="w-full p-3 border rounded-lg" />
                </div>
                 <div>
                     <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">{t('attachedEvidence')} </label>
                     <input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
                </div>
                <InputField label={t('optionalContact')} name="contactInfo" value={formData.contactInfo} onChange={handleTextChange} isRequired={false} />
                <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-300">
                    {isLoading ? t('submittingBtn') : t('submitGrievanceBtn')}
                </button>
            </form>
            {message && <div className="mt-4 text-center p-3 rounded-lg bg-green-100 text-green-800">{message}</div>}
            {error && <div className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}
        </div>
    );
}

