import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '../shared/InputField.jsx';
import { API_BASE_URL } from '../../config.js';

export default function ChangePasswordView({ token }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError(t('passwordMismatch'));
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const responseText = await response.text();

            if (!response.ok) {
                // Use the error message from the backend if available
                throw new Error(responseText || 'Failed to update password.');
            }
            
            setMessage(t('passwordChangedSuccess'));
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });

        } catch (err) {
            // Translate known error messages from the backend
            if (err.message.includes("Incorrect old password")) {
                setError(t('incorrectOldPassword'));
            } else if (err.message.includes("New passwords do not match")) {
                setError(t('passwordMismatch'));
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg border max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-gray-700 mb-6 text-center">{t('changePasswordTitle')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField 
                    label={t('oldPassword')} 
                    name="oldPassword" 
                    type="password"
                    value={formData.oldPassword} 
                    onChange={handleChange} 
                />
                <InputField 
                    label={t('newPassword')} 
                    name="newPassword" 
                    type="password"
                    value={formData.newPassword} 
                    onChange={handleChange} 
                />
                <InputField 
                    label={t('confirmPassword')} 
                    name="confirmPassword" 
                    type="password"
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                />
                <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300">
                    {isLoading ? t('submittingBtn') : t('updatePasswordBtn')}
                </button>
            </form>
            {message && <div className="mt-4 text-center p-3 rounded-lg bg-green-100 text-green-800">{message}</div>}
            {error && <div className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}
        </div>
    );
}

