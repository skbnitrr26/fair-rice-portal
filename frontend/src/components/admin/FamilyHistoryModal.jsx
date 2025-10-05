import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Th, Td } from '../shared/TableComponents.jsx';

export default function FamilyHistoryModal({ family, token, onClose }) {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (family?.id) {
            const fetchHistory = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/families/admin/${family.id}/history`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error('Could not fetch history.');
                    setHistory(await res.json());
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchHistory();
        }
    }, [family, token]);

    if (!family) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">History for {family.familyHeadName}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                </div>
                {isLoading ? (
                    <p>Loading history...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <Th>{t('distributionDate')}</Th>
                                    <Th>{t('entitlementKg')}</Th>
                                    <Th>{t('riceReceived')}</Th>
                                    <Th>{t('deficitKg')}</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {history.map(record => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <Td>{record.distributionDate}</Td>
                                        <Td>{record.entitlementKg}</Td>
                                        <Td>{record.riceReceivedKg}</Td>
                                        <Td><span className={parseFloat(record.deficitKg) > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>{record.deficitKg}</span></Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {history.length === 0 && <p className="text-center py-8">No history found for this family.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

