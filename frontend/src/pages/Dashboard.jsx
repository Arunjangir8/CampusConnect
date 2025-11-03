import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-5 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">CampusConnect Dashboard</h1>
        <div className="flex items-center gap-4 mt-3 md:mt-0">
          <span>Welcome, {user?.name}!</span>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-5">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-5">Profile Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {user?.name}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Role:</span> {user?.role}</p>
            <p><span className="font-medium">Department:</span> {user?.department}</p>
            {user?.year && <p><span className="font-medium">Year:</span> {user.year}</p>}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Events</h3>
              <p className="text-gray-600 mb-4">Discover and join campus events</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200">
                View Events
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Resources</h3>
              <p className="text-gray-600 mb-4">Access study materials and resources</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200">
                Browse Resources
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Projects</h3>
              <p className="text-gray-600 mb-4">Find collaborators for your projects</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200">
                Explore Projects
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Mentorship</h3>
              <p className="text-gray-600 mb-4">Connect with seniors and alumni</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200">
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