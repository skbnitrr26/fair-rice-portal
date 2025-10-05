import React from 'react';

export default function ActionCard({ icon, title, description, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white p-6 rounded-xl shadow-lg text-left transition-transform transform hover:-translate-y-1 hover:shadow-xl flex items-center space-x-6"
        >
            <div className="bg-green-100 p-4 rounded-full">
                <span className="text-3xl">{icon}</span>
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-gray-600 mt-1">{description}</p>
            </div>
        </button>
    );
}
