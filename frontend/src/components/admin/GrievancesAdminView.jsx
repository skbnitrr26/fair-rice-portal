import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PaginationControls from '../shared/PaginationControls.jsx';

// A separate component for the comment form to keep the logic clean
const CommentForm = ({ grievanceId, token, onCommentPosted }) => {
    const { t } = useTranslation();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/grievances/admin/${grievanceId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });
            if (!res.ok) throw new Error('Failed to post comment.');
            setContent('');
            onCommentPosted(); // Notify parent component to refresh the grievance list
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            <label htmlFor={`comment-${grievanceId}`} className="text-sm font-semibold text-gray-700">{t('addComment')}</label>
            <textarea
                id={`comment-${grievanceId}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="2"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                placeholder="Write an update for the user..."
            />
            <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300">
                {isSubmitting ? t('submittingBtn') : t('postCommentBtn')}
            </button>
        </form>
    );
};


export default function GrievancesAdminView({ token }) {
    const { t, i18n } = useTranslation();
    const [pageData, setPageData] = useState({ content: [], totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('Active');
    const [currentPage, setCurrentPage] = useState(0);
    const [openComments, setOpenComments] = useState({});

    const fetchGrievances = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/grievances/admin?page=${currentPage}&size=5`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Failed to fetch grievances.');
            const data = await res.json();
            setPageData({ content: data.content, totalPages: data.totalPages });
        } catch (err) { 
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, [token, currentPage]);

    // Reset to page 0 whenever the filter changes
    useEffect(() => {
        setCurrentPage(0);
    }, [filter]);


    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/grievances/admin/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status: newStatus }) });
            if (!res.ok) throw new Error('Failed to update status.');
            fetchGrievances();
        } catch (err) { setError(err.message); }
    };

    const toggleCommentSection = (grievanceId) => {
        setOpenComments(prev => ({
            ...prev,
            [grievanceId]: !prev[grievanceId]
        }));
    };

    const getStatusColor = (status) => {
        const colors = { 'New': 'bg-blue-100 text-blue-800', 'In Progress': 'bg-yellow-100 text-yellow-800', 'Resolved': 'bg-green-100 text-green-800' };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredGrievances = useMemo(() => {
        const grievances = pageData.content || [];
        if (filter === 'Active') {
            return grievances.filter(g => g.status === 'New' || g.status === 'In Progress');
        }
        return grievances.filter(g => g.status === 'Resolved');
    }, [pageData, filter]);
    
    const formatDate = (dateString) => {
        const locale = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
        return new Date(dateString).toLocaleString(locale);
    };

    const activeFilterClass = "bg-green-600 text-white";
    const inactiveFilterClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
                 <h3 className="text-xl font-bold text-gray-700 text-center md:text-left">{t('grievanceReports')}</h3>
                 <div className="flex rounded-lg border self-center md:self-auto">
                    <button onClick={() => setFilter('Active')} className={`px-4 py-2 rounded-l-md text-sm font-semibold ${filter === 'Active' ? activeFilterClass : inactiveFilterClass}`}>{t('activeFilter')}</button>
                    <button onClick={() => setFilter('Resolved')} className={`px-4 py-2 rounded-r-md text-sm font-semibold ${filter === 'Resolved' ? activeFilterClass : inactiveFilterClass}`}>{t('resolvedFilter')}</button>
                 </div>
            </div>
            {isLoading && <p className="text-center">Loading grievances...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="space-y-4">
                {filteredGrievances.map(g => (
                    <div key={g.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                            <div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(g.status)}`}>{g.status}</span>
                                <h4 className="font-bold text-lg mt-2">{g.subject}</h4>
                                <p className="text-sm text-gray-500">{t('submittedOn')}: {formatDate(g.createdAt)}</p>
                                {g.contactInfo && <p className="text-sm text-gray-500">{t('contact')}: {g.contactInfo}</p>}
                                <p className="text-sm text-gray-500">{t('trackingId')}: <span className="font-mono bg-gray-200 px-1 rounded">{g.trackingId}</span></p>
                            </div>
                            <div className='flex-shrink-0'>
                                <label htmlFor={`status-${g.id}`} className="text-sm font-medium">{t('updateStatus')}:</label>
                                <select id={`status-${g.id}`} value={g.status} onChange={(e) => handleStatusChange(g.id, e.target.value)} className="ml-2 border rounded-md p-1">
                                    <option>New</option><option>In Progress</option><option>Resolved</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-2 p-3 bg-gray-50 rounded whitespace-pre-wrap">{g.content}</p>
                        
                        {g.imageUrl && (
                            <div className="mt-4">
                                <h5 className="font-semibold text-gray-600">{t('attachedEvidence')}:</h5>
                                <a href={g.imageUrl} target="_blank" rel="noopener noreferrer">
                                    <img src={g.imageUrl} alt="Grievance evidence" className="mt-2 rounded-lg border max-h-60" />
                                </a>
                            </div>
                        )}

                        <div className="mt-4 border-t pt-4">
                             <button onClick={() => toggleCommentSection(g.id)} className="text-sm font-semibold text-blue-600 hover:underline">
                                {t('adminComments')} {openComments[g.id] ? '▲' : '▼'}
                             </button>

                            {openComments[g.id] && (
                                <div className="mt-2">
                                    {g.comments && g.comments.length > 0 ? (
                                        <div className="space-y-2 text-sm">
                                            {g.comments.map(comment => (
                                                <div key={comment.id} className="p-2 bg-green-50 border-l-4 border-green-400 rounded-r-md">
                                                    <p className="text-gray-800">{comment.content}</p>
                                                    <p className="text-xs text-gray-500 text-right mt-1">
                                                        {formatDate(comment.createdAt)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">{t('noCommentsYet')}</p>
                                    )}
                                    <CommentForm grievanceId={g.id} token={token} onCommentPosted={fetchGrievances} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {!isLoading && filteredGrievances.length === 0 && <p className="text-center py-8 text-gray-500">{t('noGrievances', { filter: filter.toLowerCase() })}</p>}
            </div>
             <PaginationControls
                currentPage={currentPage}
                totalPages={pageData.totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

