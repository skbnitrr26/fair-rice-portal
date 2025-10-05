import React from 'react';

// UPDATED: Added 'icon' and 'isValid' props
export default function InputField({ label, name, type = 'text', value, onChange, placeholder, isRequired = true, icon, isValid }) {
    
    // Determine border color based on validation status
    const borderColorClass = isValid === true 
        ? 'border-green-500 ring-green-500' 
        : isValid === false 
        ? 'border-red-500 ring-red-500' 
        : 'border-gray-300 focus:ring-green-500';

    return (
        <div className="relative">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                {/* Conditionally render the icon if one is provided */}
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">{icon}</span>
                    </div>
                )}
                <input 
                    id={name} 
                    name={name} 
                    type={type} 
                    value={value} 
                    onChange={onChange} 
                    placeholder={placeholder} 
                    required={isRequired} 
                    // Add padding to the left if there is an icon
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-shadow ${borderColorClass} ${icon ? 'pl-10' : ''}`}
                />
            </div>
        </div>
    );
};

