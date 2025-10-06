import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '../shared/InputField';
import { API_BASE_URL } from '../../config'; // Import the central URL

export default function ForgotPassword({ onBackToLogin }) {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            // UPDATED: Using the live API URL
            const response = await fetch(`${API_BASE_URL}/api/admin/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            if (!response.ok) {
                // For security, don't confirm if the user exists or not.
                throw new Error('An error occurred.');
            }
            
            setMessage(t('tokenGeneratedMessage'));

        } catch (err) {
            // We show a generic success message even on error to prevent user enumeration attacks
            setMessage(t('tokenGeneratedMessage'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('forgotPasswordTitle')}</h2>
            <p className="text-center text-gray-600 mb-6">{t('forgotPasswordInstructions')}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField label={t('username')} name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300">
                    {isLoading ? t('submittingBtn') : t('requestTokenBtn')}
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

