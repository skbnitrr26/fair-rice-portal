import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '../shared/InputField.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import ResetPassword from './ResetPassword.jsx';

export default function AdminLogin({ onLogin }) {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginView, setLoginView] = useState('login'); // 'login', 'forgot', or 'reset'

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
            if (!res.ok) { throw new Error('Invalid credentials.'); }
            onLogin((await res.json()).token);
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    if (loginView === 'forgot') {
        return <ForgotPassword onBackToLogin={() => setLoginView('login')} />;
    }
    
    if (loginView === 'reset') {
        return <ResetPassword onBackToLogin={() => setLoginView('login')} />;
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('adminLoginTitle')}</h2>
            <form onSubmit={handleLogin} className="space-y-6">
                <InputField label={t('username')} name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <InputField label={t('password')} name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                
                <div className="text-right text-sm">
                    <button type="button" onClick={() => setLoginView('forgot')} className="text-blue-600 hover:underline">
                        {t('forgotPasswordLink')}
                    </button>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300">
                    {isLoading ? t('loggingInBtn') : t('loginBtn')}
                </button>
            </form>

            <div className="text-center mt-4">
                <button type="button" onClick={() => setLoginView('reset')} className="text-sm text-gray-600 hover:underline">
                    Have a reset token?
                </button>
            </div>

            {error && <div className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}
        </div>
    );
}

