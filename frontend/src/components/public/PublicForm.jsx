import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '../shared/InputField.jsx';
import { API_BASE_URL } from '../../config.js';

const RICE_PER_PERSON_KG = 5;

// A dedicated component for the submission summary/receipt
const SubmissionSummary = ({ result, onClose }) => {
    const { t, i18n } = useTranslation();

    const handlePrint = () => {
        window.print();
    };
    
    const formatDate = (dateString) => {
        const locale = i18n.language.startsWith('hi') ? 'hi-IN' : 'en-IN';
        return new Date(dateString).toLocaleDateString(locale, {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <>
            <style jsx="true" global="true">{`
                @media print {
                    body > #root > div {
                        display: none;
                    }
                    body > #root .print-container {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto print-container">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('submissionSummaryTitle')}</h2>
                
                <div className="space-y-4 text-lg border p-6 rounded-lg bg-gray-50">
                    <SummaryRow label={t('familyHeadName')} value={result.family.familyHeadName} />
                    <SummaryRow label={t('contactNumber')} value={result.family.contactNumber} />
                    <SummaryRow label={t('villageName')} value={result.family.villageName} />
                    <SummaryRow label={t('numMembers')} value={result.family.numMembers} />
                    <SummaryRow label={t('distributionDate')} value={formatDate(result.distributionDate)} />
                    <hr className="my-4"/>
                    <SummaryRow label={t('officialEntitlement')} value={`${result.entitlementKg} kg`} isBold={true} />
                    <SummaryRow label={t('riceReceived')} value={`${result.riceReceivedKg} kg`} isBold={true} />
                    <SummaryRow 
                        label={t('deficitAmount')} 
                        value={`${result.deficitKg} kg`} 
                        isBold={true}
                        valueClass={parseFloat(result.deficitKg) > 0 ? 'text-red-600' : 'text-green-600'}
                    />
                    <hr className="my-4"/>
                    <SummaryRow label={t('recordId')} value={result.family.uniqueFamilyId} />
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-8 no-print">
                    <button onClick={onClose} className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700">
                        {t('submitAnotherBtn')}
                    </button>
                    <button onClick={handlePrint} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                        {t('printReceiptBtn')}
                    </button>
                </div>
            </div>
        </>
    );
};

const SummaryRow = ({ label, value, isBold = false, valueClass = '' }) => (
    <div className="flex justify-between">
        <span className="text-gray-600">{label}:</span>
        <span className={`${isBold ? 'font-bold' : ''} ${valueClass} text-gray-800`}>{value}</span>
    </div>
);


export default function PublicForm() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        familyHeadName: '', contactNumber: '', numMembers: '', villageName: '', riceReceivedKg: '',
        distributionDate: new Date().toISOString().split('T')[0]
    });
    const [submissionResult, setSubmissionResult] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingFamily, setIsFetchingFamily] = useState(false);
    const [error, setError] = useState('');
    const [entitlementMessage, setEntitlementMessage] = useState('');
    const [isContactValid, setIsContactValid] = useState(null);

    useEffect(() => {
        const members = parseInt(formData.numMembers, 10);
        if (members > 0) {
            const amount = members * RICE_PER_PERSON_KG;
            setEntitlementMessage(t('entitlementMessage', { count: members, amount }));
        } else { setEntitlementMessage(''); }
    }, [formData.numMembers, t]);

    useEffect(() => {
        const contactNumber = formData.contactNumber;
        if (contactNumber) {
            setIsContactValid(contactNumber.length === 10 && /^\d{10}$/.test(contactNumber));
        } else {
            setIsContactValid(null);
        }
        if (contactNumber && contactNumber.length === 10 && /^\d{10}$/.test(contactNumber)) {
            const fetchFamilyDetails = async () => {
                setIsFetchingFamily(true);
                setError('');
                try {
                    const res = await fetch(`${API_BASE_URL}/api/families/public/by-contact/${contactNumber}`);
                    if (!res.ok) { 
                        setFormData(prev => ({ ...prev, familyHeadName: '', numMembers: '', villageName: '' }));
                        return; 
                    }
                    const familyData = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        familyHeadName: familyData.familyHeadName,
                        numMembers: familyData.numMembers.toString(),
                        villageName: familyData.villageName,
                    }));
                } catch (err) {
                    console.error("Failed to fetch family details:", err);
                } finally {
                    setIsFetchingFamily(false);
                }
            };
            fetchFamilyDetails();
        }
    }, [formData.contactNumber, t]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmissionResult(null);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/records/public`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (!res.ok) { throw new Error((await res.json()).message || 'Submission error.'); }
            const result = await res.json();
            setSubmissionResult(result);
            setFormData({ familyHeadName: '', contactNumber: '', numMembers: '', villageName: '', riceReceivedKg: '', distributionDate: new Date().toISOString().split('T')[0] });
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    if (submissionResult) {
        return <SubmissionSummary result={submissionResult} onClose={() => setSubmissionResult(null)} />;
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('submitDetailsTitle')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset disabled={isFetchingFamily}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <InputField icon="👤" label={t('familyHeadName')} name="familyHeadName" value={formData.familyHeadName} onChange={handleChange} />
                        <div>
                            <InputField 
                                icon="📞" 
                                label={t('contactNumber')} 
                                name="contactNumber" 
                                type="tel" 
                                value={formData.contactNumber} 
                                onChange={handleChange}
                                isValid={isContactValid}
                            />
                            <p className="text-xs text-gray-500 mt-1 px-1">{t('autoFillHint')}</p>
                        </div>
                        <div>
                            <InputField icon="👨‍👩‍👧‍👦" label={t('numMembers')} name="numMembers" type="number" value={formData.numMembers} onChange={handleChange} />
                            {entitlementMessage && <div className="mt-2 p-3 rounded-lg bg-blue-100 text-blue-800 text-sm">{entitlementMessage}</div>}
                        </div>
                        <InputField icon="🏡" label={t('villageName')} name="villageName" value={formData.villageName} onChange={handleChange} />
                        <InputField icon="🍚" label={t('riceReceived')} name="riceReceivedKg" type="number" step="0.5" value={formData.riceReceivedKg} onChange={handleChange} />
                        <InputField icon="📅" label={t('distributionDate')} name="distributionDate" type="date" value={formData.distributionDate} onChange={handleChange} />
                    </div>
                    <button type="submit" disabled={isLoading || isFetchingFamily} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300">
                        {isFetchingFamily ? t('fetchingDetails') : (isLoading ? t('submittingBtn') : t('submitRecordBtn'))}
                    </button>
                </fieldset>
            </form>
            {error && <div className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}
        </div>
    );
}

