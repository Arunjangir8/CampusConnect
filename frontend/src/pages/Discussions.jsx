import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Discussions = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    search: ''
  });

  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    department: user?.department || ''
  });

  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchDiscussions();
  }, [filters]);

  const fetchDiscussions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/discussions?${params}`);
      setDiscussions(response.data.discussions);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussionDetails = async (discussionId) => {
    try {
      const response = await api.get(`/discussions/${discussionId}`);
      setSelectedDiscussion(response.data);
    } catch (error) {
      console.error('Error fetching discussion details:', error);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/discussions', newDiscussion);
      setDiscussions([response.data, ...discussions]);
      setShowCreateForm(false);
      setNewDiscussion({
        title: '',
        content: '',
        department: user?.department || ''
      });
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!selectedDiscussion || !newComment.trim()) return;

    try {
      const response = await api.post(`/discussions/${selectedDiscussion.id}/comments`, {
        content: newComment
      });
      setSelectedDiscussion({
        ...selectedDiscussion,
        comments: [...selectedDiscussion.comments, response.data]
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpvote = async (discussionId) => {
    try {
      const response = await api.post(`/discussions/${discussionId}/upvote`);
      setDiscussions(discussions.map(discussion => 
        discussion.id === discussionId 
          ? { ...discussion, upvotes: response.data.upvotes }
          : discussion
      ));
      if (selectedDiscussion && selectedDiscussion.id === discussionId) {
        setSelectedDiscussion({
          ...selectedDiscussion,
          upvotes: response.data.upvotes
        });
      }
    } catch (error) {
      console.error('Error upvoting discussion:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg">Loading discussions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
            <p className="text-gray-600">Engage in academic discussions with your peers</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Start Discussion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discussions List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="card p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Discussions</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="input-field"
                    placeholder="Search by title or content..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="input-field"
                    placeholder="Filter by department..."
                  />
                </div>
              </div>
            </div>

            {/* Discussions */}
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div 
                  key={discussion.id} 
                  className={`card p-6 cursor-pointer transition-all ${
                    selectedDiscussion?.id === discussion.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                  }`}
                  onClick={() => fetchDiscussionDetails(discussion.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{discussion.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {discussion.department}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{discussion.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {discussion.author.name}
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {discussion.commentCount || discussion.comments?.length || 0} comments
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(discussion.id);
                        }}
                        className="flex items-center hover:text-blue-600"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                        {discussion.upvotes}
                      </button>
                    </div>
                    <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion Details */}
          <div className="lg:col-span-1">
            {selectedDiscussion ? (
              <div className="card p-6 sticky top-8">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedDiscussion.title}</h2>
                  <button
                    onClick={() => setSelectedDiscussion(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {selectedDiscussion.author.name} • {selectedDiscussion.author.department}
                  </div>
                  <p className="text-gray-700 mb-4">{selectedDiscussion.content}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <button
                      onClick={() => handleUpvote(selectedDiscussion.id)}
                      className="flex items-center hover:text-blue-600"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                      {selectedDiscussion.upvotes} upvotes
                    </button>
                    <span>{selectedDiscussion.comments.length} comments</span>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {selectedDiscussion.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <span className="font-medium">{comment.author.name}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <form onSubmit={handleAddComment} className="space-y-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="input-field"
                    rows="3"
                    placeholder="Add a comment..."
                    required
                  />
                  <button type="submit" className="btn-primary w-full">
                    Post Comment
                  </button>
                </form>
              </div>
            ) : (
              <div className="card p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Discussion</h3>
                <p className="text-gray-600">Click on a discussion to view details and comments</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Discussion Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Start New Discussion</h2>
              
              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    className="input-field"
                    rows="4"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={newDiscussion.department}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, department: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Start Discussion
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussions;