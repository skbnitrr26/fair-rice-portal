import React from 'react';

export default function StatCard({ title, value, color }) {
    const colors = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
        green: { bg: 'bg-green-100', text: 'text-green-800' },
        red: { bg: 'bg-red-100', text: 'text-red-800' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    };
    const chosenColor = colors[color] || colors.blue;

    return (
        <div className={`${chosenColor.bg} p-4 rounded-lg text-center`}>
            <div className={`text-3xl font-bold ${chosenColor.text}`}>{value}</div>
            <div className={`${chosenColor.text.replace('800', '700')}`}>{title}</div>
        </div>
    );
};

