import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '../shared/InputField.jsx';
import PaginationControls from '../shared/PaginationControls.jsx';
import { API_BASE_URL } from '../../config.js';

export default function AnnouncementsAdminView({ token }) {
    const { t, i18n } = useTranslation();
    const [pageData, setPageData] = useState({ content: [], totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(null);

    const fetchAnnouncements = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/announcements/public?page=${currentPage}&size=5`);
            if (!response.ok) throw new Error('Could not fetch announcements.');
            const data = await response.json();
            setPageData({ content: data.content, totalPages: data.totalPages });
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        fetchAnnouncements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, currentPage]);

    const resetForm = () => { setTitle(''); setContent(''); setIsEditing(null); setMessage(''); setError(''); };

    const handleEditClick = (ann) => { setIsEditing(ann.id); setTitle(ann.title); setContent(ann.content); window.scrollTo(0, 0); };
    
    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/announcements/admin/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                if (!res.ok) throw new Error('Failed to delete.');
                setMessage('Announcement deleted successfully.');
                setCurrentPage(0);
            } catch (err) { setError(err.message); }
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');
        const url = isEditing ? `${API_BASE_URL}/api/announcements/admin/${isEditing}` : `${API_BASE_URL}/api/announcements/admin`;
        const method = isEditing ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title, content }) });
            if (!res.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'post'} announcement.`);
            setMessage(`Announcement ${isEditing ? 'updated' : 'posted'} successfully!`);
            resetForm();
            setCurrentPage(0);
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    const formatDate = (dateString) => {
        const locale = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
        return new Date(dateString).toLocaleDateString(locale);
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold text-gray-700 mb-4">{isEditing ? t('editAnnouncement') : t('postAnnouncement')}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label={t('title')} name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-1">{t('content')}</label>
                        <textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} rows="5" required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" disabled={isLoading} className="flex-grow bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300">
                            {isLoading ? t('submittingBtn') : (isEditing ? t('updateBtn') : t('postBtn'))}
                        </button>
                        {isEditing && <button type="button" onClick={resetForm} className="bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600">{t('cancelBtn')}</button>}
                    </div>
                </form>
                {message && <div className="mt-4 text-center p-3 rounded-lg bg-green-100 text-green-800">{message}</div>}
                {error && <div className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">{t('existingAnnouncements')}</h3>
                {isLoading && <p>Loading...</p>}
                <div className="space-y-4">
                    {pageData.content.map(ann => (
                        <div key={ann.id} className="p-4 border rounded-lg flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg">{ann.title}</h4>
                                <p className="text-sm text-gray-500">{t('postedOn')}: {formatDate(ann.createdAt)}</p>
                                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{ann.content}</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0 ml-4">
                                <button onClick={() => handleEditClick(ann)} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">{t('editBtn')}</button>
                                <button onClick={() => handleDeleteClick(ann.id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">{t('deleteBtn')}</button>
                            </div>
                        </div>
                    ))}
                </div>
                {pageData.content.length === 0 && !isLoading && <p className="text-center py-8 text-gray-500">No announcements found.</p>}
                <PaginationControls 
                    currentPage={currentPage}
                    totalPages={pageData.totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

