import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../shared/StatCard.jsx';

export default function DashboardReports({ reportData }) {
    const { t } = useTranslation();
    return (
        <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-xl font-bold text-gray-700 mb-4">{t('reportsSummaryTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('totalRecords')} value={reportData.totalRecords} color="blue" />
                <StatCard title={t('totalDistributed')} value={`${reportData.totalDistributed} kg`} color="green" />
                <StatCard title={t('totalDeficit')} value={`${reportData.totalDeficit} kg`} color="red" />
                <StatCard title={t('uniqueFamilies')} value={reportData.uniqueFamilies} color="yellow" />
                <div className="md:col-span-2 lg:col-span-4 bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-4 text-gray-600">{t('chartTitle')}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                            <Bar dataKey="Total Entitlement" fill="#8884d8" name={t('totalEntitlement')} />
                            <Bar dataKey="Total Distributed" fill="#82ca9d" name={t('totalDistributed')} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

