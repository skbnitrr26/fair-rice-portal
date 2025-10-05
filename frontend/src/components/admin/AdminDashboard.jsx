import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReportsView from './ReportsView.jsx';
import AnnouncementsAdminView from './AnnouncementsAdminView.jsx';
import GrievancesAdminView from './GrievancesAdminView.jsx';
import ChangePasswordView from './ChangePasswordView.jsx';

export default function AdminDashboard({ token, onLogout }) {
    const { t } = useTranslation();
    const [adminView, setAdminView] = useState('reports');
    
    const activeTabClass = "bg-white text-green-700 shadow-md rounded-lg";
    const inactiveTabClass = "text-green-100 hover:bg-green-600/50 hover:text-white";

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-8 flex flex-col">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{t('adminDashboardTitle')}</h2>
            </div>
            
            <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 rounded-xl bg-green-700 p-2 text-center">
                <button onClick={() => setAdminView('reports')} className={`w-full md:w-1/4 py-2.5 text-sm font-medium transition-all rounded-lg ${adminView === 'reports' ? activeTabClass : inactiveTabClass}`}>
                    {t('reportsTab')}
                </button>
                <button onClick={() => setAdminView('announcements')} className={`w-full md:w-1/4 py-2.5 text-sm font-medium transition-all rounded-lg ${adminView === 'announcements' ? activeTabClass : inactiveTabClass}`}>
                    {t('announcementsTab')}
                </button>
                <button onClick={() => setAdminView('grievances')} className={`w-full md:w-1/4 py-2.5 text-sm font-medium transition-all rounded-lg ${adminView === 'grievances' ? activeTabClass : inactiveTabClass}`}>
                    {t('grievancesTab')}
                </button>
                <button onClick={() => setAdminView('security')} className={`w-full md:w-1/4 py-2.5 text-sm font-medium transition-all rounded-lg ${adminView === 'security' ? activeTabClass : inactiveTabClass}`}>
                    {t('securityTab')}
                </button>
            </div>
            
            <div className="flex-grow">
                {adminView === 'reports' && <ReportsView token={token} onLogout={onLogout} />}
                {adminView === 'announcements' && <AnnouncementsAdminView token={token} />}
                {adminView === 'grievances' && <GrievancesAdminView token={token} />}
                {adminView === 'security' && <ChangePasswordView token={token} />}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 flex justify-center md:justify-end">
                 <button onClick={onLogout} className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 w-full md:w-auto">{t('logoutBtn')}</button>
            </div>
        </div>
    );
}

