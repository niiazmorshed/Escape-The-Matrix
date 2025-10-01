import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaCrown, FaEnvelope, FaUser, FaUserShield } from "react-icons/fa";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const AdmineProfile = () => {
    const {user} = useAuth();
    const [info, setInfo] = useState([]);
    const axiosSecure = useAxiosSecure();
    
    useEffect(() => {
      axiosSecure.get(`profile/${user.email}`).then((res) => {
        setInfo(res.data);
      });
    }, [axiosSecure, user]);
    
    return (
        <div className="min-h-screen bg-transparent">
            <Helmet>
                <title>Admin Dashboard | Profile | EMX</title>
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <FaUserShield className="mr-3 text-blue-600" />
                        Admin Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Manage your administrator account and view profile information
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <FaCrown className="mr-3" />
                            Administrator Account
                        </h2>
                        <p className="text-blue-100 mt-1">Full administrative access to the platform</p>
                    </div>

                    <div className="p-8 text-gray-900 dark:text-white">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                            {/* Profile Image */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500/40">
                                    <img 
                                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=3B82F6&color=fff&size=128`} 
                                        alt="Admin Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Profile Information */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold mb-2">
                                    {info.name || user?.displayName || 'Administrator'}
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center md:justify-start">
                                        <FaEnvelope className="text-blue-600 dark:text-blue-400 mr-3" />
                                        <span className="text-gray-700 dark:text-gray-200">
                                            {info.email || user?.email}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-center md:justify-start">
                                        <FaUser className="text-blue-600 dark:text-blue-400 mr-3" />
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200">
                                            <FaCrown className="mr-1" />
                                            {info.role || 'Administrator'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Account Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Display Name</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {user?.displayName || 'Not set'}
                                    </p>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Account Status</p>
                                    <p className="font-semibold text-green-600 dark:text-green-400">Active</p>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Last Updated</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Permissions</p>
                                    <p className="font-semibold text-blue-600 dark:text-blue-400">Full Access</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmineProfile;