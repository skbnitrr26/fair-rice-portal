import React from 'react';

export default function PaginationControls({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null; // Don't show controls if there's only one page
    }

    return (
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
                &larr; Previous
            </button>
            <span className="text-sm text-gray-700">
                Page {currentPage + 1} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
                Next &rarr;
            </button>
        </div>
    );
}

