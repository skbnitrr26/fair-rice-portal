import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardReports from './DashboardReports.jsx';
import FamilyHistoryModal from './FamilyHistoryModal.jsx';
import { Th, Td } from '../shared/TableComponents.jsx';
import PaginationControls from '../shared/PaginationControls.jsx';
import { API_BASE_URL } from '../../config.js';

export default function ReportsView({ token, onLogout }) {
    const { t } = useTranslation();
    const [pageData, setPageData] = useState({ content: [], totalPages: 0, totalElements: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all'); 
    const [historyModalFamily, setHistoryModalFamily] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            setIsLoading(true);
            setError('');
            
            const params = new URLSearchParams({
                page: currentPage.toString(),
                size: '10'
            });
            if (selectedYear !== 'all') params.append('year', selectedYear);
            if (selectedMonth !== 'all' && selectedYear !== 'all') params.append('month', selectedMonth);
            
            const url = `${API_BASE_URL}/api/records?${params.toString()}`;

            try {
                const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                if (res.status === 401 || res.status === 403) { onLogout(); return; }
                if (!res.ok) { throw new Error('Failed to fetch records.'); }
                const data = await res.json();
                
                setPageData({ content: data.content, totalPages: data.totalPages, totalElements: data.totalElements });
            } catch (err) { setError(err.message); } 
            finally { setIsLoading(false); }
        };
        if (token) { fetchRecords(); }
    }, [token, onLogout, selectedYear, selectedMonth, currentPage]);

    useEffect(() => {
        setCurrentPage(0);
    }, [selectedYear, selectedMonth, searchTerm]);

    const reportData = useMemo(() => {
        const records = pageData.content || [];
        const totalEntitlement = records.reduce((sum, r) => sum + parseFloat(r.entitlementKg || 0), 0);
        const totalDistributed = records.reduce((sum, r) => sum + parseFloat(r.riceReceivedKg || 0), 0);
        const totalDeficit = records.reduce((sum, r) => sum + parseFloat(r.deficitKg || 0), 0);
        const chartData = [{ name: t('chartTitle'), 'Total Entitlement': totalEntitlement.toFixed(2), 'Total Distributed': totalDistributed.toFixed(2), }];
        // Use totalElements from pageData for an accurate total count
        return { totalRecords: pageData.totalElements, totalDistributed: totalDistributed.toFixed(2), totalDeficit: totalDeficit.toFixed(2), uniqueFamilies: new Set(records.map(r => r.family?.contactNumber)).size, chartData };
    }, [pageData, t]);

    const filteredRecords = useMemo(() => {
        const records = pageData.content || [];
        if (!searchTerm.trim()) return records;
        const lowerSearch = searchTerm.toLowerCase();
        return records.filter(r => r?.family && (r.family.familyHeadName.toLowerCase().includes(lowerSearch) || r.family.contactNumber.includes(searchTerm) || r.family.villageName.toLowerCase().includes(lowerSearch)));
    }, [pageData, searchTerm]);

    const handleDownloadCSV = () => {
        const headers = [t('distributionDate'), t('familyHeadName'), t('contactNumber'), t('villageName'), t('numMembers'), t('entitlementKg'), t('riceReceived'), t('deficitKg')];
        const rows = filteredRecords.map(r => [r.distributionDate, r.family?.familyHeadName, `'${r.family?.contactNumber}'`, r.family?.villageName, r.family?.numMembers, r.entitlementKg, r.riceReceivedKg, r.deficitKg].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        const fileName = (selectedMonth === 'all' && selectedYear === 'all') ? 'rice_report_all_time.csv' : `rice_report_${selectedYear}_${selectedMonth}.csv`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleYearChange = (e) => {
        const newYear = e.target.value;
        setSelectedYear(newYear);
        if (newYear === 'all') {
            setSelectedMonth('all');
        }
    };
    
    const currentYear = new Date().getFullYear();
    const yearOptions = [ { value: 'all', name: 'All Years' }, currentYear, currentYear - 1, currentYear - 2 ];
    const monthOptions = [
        { value: 'all', name: 'All Months' }, { value: 1, name: 'January' }, { value: 2, name: 'February' },
        { value: 3, name: 'March' }, { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
        { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
        { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' }
    ];

    const handleGetQrCode = async (familyId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/families/admin/${familyId}/qrcode`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) { throw new Error('Could not fetch QR code.'); }
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            window.open(imageUrl, '_blank');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-8">
            <DashboardReports reportData={reportData} />
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder={t('searchRecords')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500" />
                    <div className="flex gap-2">
                        <select value={selectedYear} onChange={handleYearChange} className="w-full p-3 border rounded-lg">
                            {yearOptions.map(y => <option key={y.value || y} value={y.value || y}>{y.name || y}</option>)}
                        </select>
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full p-3 border rounded-lg disabled:bg-gray-200" disabled={selectedYear === 'all'}>
                            {monthOptions.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                        </select>
                    </div>
                    <button onClick={handleDownloadCSV} className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700">{t('downloadCsvBtn')}</button>
                </div>

                {isLoading && <p className="text-center py-8">Loading records...</p>}
                {error && <p className="text-center text-red-500 py-8">{error}</p>}

                {!isLoading && !error && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <Th>{t('distributionDate')}</Th>
                                        <Th>{t('familyHeadName')}</Th>
                                        <Th>{t('contactNumber')}</Th>
                                        <Th>{t('villageName')}</Th>
                                        <Th>{t('actions')}</Th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredRecords.map(r => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <Td>{r.distributionDate}</Td>
                                            <Td>{r.family?.familyHeadName}</Td>
                                            <Td>{r.family?.contactNumber}</Td>
                                            <Td>{r.family?.villageName}</Td>
                                            <Td className="space-x-2">
                                                <button onClick={() => setHistoryModalFamily(r.family)} className="bg-blue-600 text-white text-xs py-1 px-3 rounded hover:bg-blue-700">
                                                    {t('viewHistory')}
                                                </button>
                                                {r.family?.id && (
                                                    <button 
                                                        onClick={() => handleGetQrCode(r.family.id)}
                                                        className="bg-gray-600 text-white text-xs py-1 px-3 rounded hover:bg-gray-700"
                                                    >
                                                        Get QR Code
                                                    </button>
                                                )}
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredRecords.length === 0 && <p className="text-center py-8 text-gray-500">{t('noRecordsFound')}</p>}

                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={pageData.totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {historyModalFamily && (
                <FamilyHistoryModal
                    family={historyModalFamily}
                    token={token}
                    onClose={() => setHistoryModalFamily(null)}
                />
            )}
        </div>
    );
}

