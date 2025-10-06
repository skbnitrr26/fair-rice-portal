import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '../shared/InputField';
import { API_BASE_URL } from '../../config';

export default function ResetPassword({ onBackToLogin }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ token: '', newPassword: '', confirmPassword: '' });
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
            const response = await fetch(`${API_BASE_URL}/api/admin/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Failed to reset password.');
            }
            
            setMessage(t('passwordResetSuccess'));
            setFormData({ token: '', newPassword: '', confirmPassword: '' });

        } catch (err) {
            if (err.message.includes("Invalid") || err.message.includes("expired")) {
                setError(t('invalidTokenError'));
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('resetPasswordTitle')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField label={t('resetTokenLabel')} name="token" value={formData.token} onChange={handleChange} />
                <InputField label={t('newPasswordLabel')} name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} />
                <InputField label={t('confirmNewPasswordLabel')} name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />

                <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300">
                    {isLoading ? t('submittingBtn') : t('resetPasswordBtn')}
                </button>
            </form>

            <button onClick={onBackToLogin} className="w-full text-center mt-4 text-sm text-blue-600 hover:underline">
                &larr; Back to Login
            </button>

            {message && <div className="mt-4 text-center p-3 rounded-lg bg-green-100 text-green-800">{message}</div>}
            {error && <div className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}
        </div>
    );
}

