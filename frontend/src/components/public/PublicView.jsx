import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AnnouncementsSection from './AnnouncementsSection.jsx';
import PublicForm from './PublicForm.jsx';
import GrievanceForm from './GrievanceForm.jsx';
import CheckGrievanceStatus from './CheckGrievanceStatus.jsx';
import Chatbot from './Chatbot.jsx';
import ActionCard from './ActionCard.jsx';
import HowItWorks from './HowItWorks.jsx';
import { API_BASE_URL } from '../../config.js';

// A reusable Modal component to house the forms and other pop-ups
const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="relative bg-gray-100 rounded-lg shadow-xl w-full max-w-4xl">
            <button
                onClick={onClose}
                className="absolute top-2 right-4 text-gray-600 hover:text-gray-900 text-4xl font-bold z-10"
                aria-label="Close"
            >
                &times;
            </button>
            <div className="max-h-[90vh] overflow-y-auto">
                {children}
            </div>
        </div>
    </div>
);

export default function PublicView() {
    const { t } = useTranslation();
    const [announcements, setAnnouncements] = useState([]);
    
    // State to control visibility of each modal individually
    const [showHowItWorks, setShowHowItWorks] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showGrievanceModal, setShowGrievanceModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/announcements/public`);
                if (response.ok) setAnnouncements((await response.json()).content);
            } catch (error) { 
                console.error("Fetch announcements error:", error);
                setAnnouncements([]);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <div className="space-y-12">
            {/* All pop-up modals are defined here, ready to be triggered */}
            {showHowItWorks && (
                <Modal onClose={() => setShowHowItWorks(false)}>
                    <HowItWorks />
                </Modal>
            )}
            {showSubmitModal && (
                <Modal onClose={() => setShowSubmitModal(false)}>
                    <PublicForm />
                </Modal>
            )}
            {showGrievanceModal && (
                <Modal onClose={() => setShowGrievanceModal(false)}>
                    <GrievanceForm />
                </Modal>
            )}
            {showStatusModal && (
                <Modal onClose={() => setShowStatusModal(false)}>
                    <CheckGrievanceStatus />
                </Modal>
            )}
            
            <AnnouncementsSection announcements={announcements} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <ActionCard 
                    icon="📄" 
                    title={t('submitActionTitle')} 
                    description={t('submitActionDesc')}
                    onClick={() => setShowSubmitModal(true)}
                />
                <ActionCard 
                    icon="⚠️" 
                    title={t('grievanceActionTitle')} 
                    description={t('grievanceActionDesc')}
                    onClick={() => setShowGrievanceModal(true)}
                />
                <ActionCard 
                    icon="🔍" 
                    title={t('statusActionTitle')} 
                    description={t('statusActionDesc')}
                    onClick={() => setShowStatusModal(true)}
                />
            </div>

            <div className="text-center pt-4">
                <button 
                    onClick={() => setShowHowItWorks(true)} 
                    className="text-lg font-semibold text-green-700 hover:underline decoration-dotted"
                >
                    {t('howItWorksButton')}
                </button>
            </div>
            
            <Chatbot />
        </div>
    );
}

