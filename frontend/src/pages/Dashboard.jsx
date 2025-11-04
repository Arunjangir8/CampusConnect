import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CampusConnect</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back,</p>
                <p className="text-sm text-gray-600">{user?.name}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg border border-red-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h2>
              <p className="text-gray-600">Your account details and preferences</p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
              <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
              <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Department</p>
              <p className="text-lg font-semibold text-gray-900">{user?.department}</p>
            </div>
            {user?.year && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Academic Year</p>
                <p className="text-lg font-semibold text-gray-900">{user.year}{user.year === '1' ? 'st' : user.year === '2' ? 'nd' : user.year === '3' ? 'rd' : 'th'} Year</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600">Explore what CampusConnect has to offer</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Events</h3>
              <p className="text-gray-600 mb-6">Discover and join campus events</p>
              <button className="btn-primary w-full">
                View Events
              </button>
            </div>
            
            <div className="card p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="h-16 w-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resources</h3>
              <p className="text-gray-600 mb-6">Access study materials and resources</p>
              <button className="btn-primary w-full">
                Browse Resources
              </button>
            </div>
            
            <div className="card p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Projects</h3>
              <p className="text-gray-600 mb-6">Find collaborators for your projects</p>
              <button className="btn-primary w-full">
                Explore Projects
              </button>
            </div>
            
            <div className="card p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mentorship</h3>
              <p className="text-gray-600 mb-6">Connect with seniors and alumni</p>
              <button className="btn-primary w-full">
                Find Mentors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;