import React from 'react';
import { useTranslation } from 'react-i18next';

const Step = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 bg-green-100 text-green-700 rounded-full h-12 w-12 flex items-center justify-center text-2xl font-sans">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-lg text-gray-800">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);

export default function HowItWorks() {
    const { t } = useTranslation();

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t('howItWorksTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Step icon="📝" title={t('step1Title')} description={t('step1Desc')} />
                <Step icon="⚖️" title={t('step2Title')} description={t('step2Desc')} />
                <Step icon="⚠️" title={t('step3Title')} description={t('step3Desc')} />
                <Step icon="📢" title={t('step4Title')} description={t('step4Desc')} />
            </div>
        </div>
    );
}

