import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PublicView from './components/public/PublicView';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

// Language Switcher Component
const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const activeLangClass = "bg-white text-green-700 font-bold";
    const inactiveLangClass = "bg-green-600 text-white";

    return (
        <div className="flex rounded-md border border-green-400 overflow-hidden">
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-sm transition-colors duration-200 ${i18n.language.startsWith('en') ? activeLangClass : inactiveLangClass}`}
            >
                English
            </button>
            <button
                onClick={() => changeLanguage('hi')}
                className={`px-3 py-1 text-sm transition-colors duration-200 ${i18n.language === 'hi' ? activeLangClass : inactiveLangClass}`}
            >
                हिंदी
            </button>
        </div>
    );
};


export default function App() {
    const { t } = useTranslation();
    const [view, setView] = useState('public');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            setView('admin');
        }
    }, []);

    const handleLoginSuccess = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        setView('admin');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setView('public');
    };

    const activeTabClass = "bg-green-600 text-white";
    const inactiveTabClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-green-700 text-white shadow-md">
                <nav className="container mx-auto px-4 py-4 flex flex-col items-center gap-4 md:flex-row md:justify-between">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold">{t('portalTitle')}</h1>
                        <p className="text-sm text-green-200">{t('portalSubtitle')}</p>
                    </div>
                    <LanguageSwitcher /> 
                </nav>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="flex justify-center mb-8 rounded-lg shadow-sm overflow-hidden border border-gray-300 w-full max-w-md mx-auto">
                    <button onClick={() => setView('public')} className={`w-1/2 py-3 px-4 font-semibold transition-colors duration-300 ${view === 'public' ? activeTabClass : inactiveTabClass}`}>
                        {t('publicViewTab')}
                    </button>
                    <button onClick={() => setView('admin')} className={`w-1/2 py-3 px-4 font-semibold transition-colors duration-300 ${view === 'admin' ? activeTabClass : inactiveTabClass}`}>
                        {t('adminPanelTab')}
                    </button>
                </div>
                
                {view === 'public' && <PublicView />}
                {view === 'admin' && (token ? <AdminDashboard token={token} onLogout={handleLogout} /> : <AdminLogin onLogin={handleLoginSuccess} />)}
            </main>
            
            <footer className="text-center py-4 mt-8 text-gray-600 text-sm">
                <p>{t('footerText', { year: new Date().getFullYear() })}</p>
            </footer>
        </div>
    );
}

