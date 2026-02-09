import React, { useState } from 'react';
import { Settings, User, Users, Zap, Building } from 'lucide-react';
import { useUsers } from '../../contexts/UsersContext';
import { useCompany } from '../../contexts/CompanyContext';

const SettingsPage: React.FC = () => {
    const { users, updateUser } = useUsers();
    const { companyInfo, updateCompanyInfo } = useCompany();
    const currentUser = users.user_1;
    
    const [activeTab, setActiveTab] = useState('Profile');
    const [userData, setUserData] = useState({
        name: currentUser.name,
        email: 'alex.johnson@example.com',
        avatar: currentUser.avatar,
        phone: '+1 (555) 123-4567',
        timezone: 'America/New_York',
        language: 'English'
    });
    
    const [companyData, setCompanyData] = useState({
        name: companyInfo.name,
        address: companyInfo.address,
        phone: companyInfo.phone,
        email: companyInfo.email,
        website: companyInfo.website,
        logo: companyInfo.logo
    });

    const renderContent = () => {
        switch (activeTab) {
            case 'Profile':
                return <ProfileTab userData={userData} setUserData={setUserData} onSave={() => handleSaveProfile()} />;
            case 'Company':
                return <CompanyTab companyData={companyData} setCompanyData={setCompanyData} onSave={() => handleSaveCompany()} />;
            case 'Users':
                 return <div>
                    <h2 className="text-xl font-semibold mb-4">User Management</h2>
                    <p>Invite new users, manage roles, and set permissions.</p>
                </div>;
            case 'Integrations':
                 return <div>
                    <h2 className="text-xl font-semibold mb-4">Integrations</h2>
                    <p>Connect your favorite apps like Slack, Google Calendar, and Mailchimp.</p>
                </div>;
            default:
                return null;
        }
    }

    const handleSaveProfile = () => {
        // Update user in context
        updateUser('user_1', {
            name: userData.name,
            avatar: userData.avatar
        });
        
        // Show success message
        alert('Profile updated successfully!');
    };
    
    const handleSaveCompany = () => {
        // Update company info in context
        updateCompanyInfo(companyData);
        
        // Show success message
        alert('Company information updated successfully!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-main flex items-center gap-2">
                    <Settings className="w-8 h-8" />
                    Settings
                </h1>
                <p className="text-text-light mt-1">Configure your CRM, manage users, and set up integrations.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border flex min-h-[400px]">
                <div className="w-1/4 border-r p-4">
                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab('Profile')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'Profile' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                            <User size={16} /> Profile
                        </button>
                        <button onClick={() => setActiveTab('Company')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'Company' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                            <Building size={16} /> Company
                        </button>
                        <button onClick={() => setActiveTab('Users')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'Users' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                            <Users size={16} /> Users
                        </button>
                        <button onClick={() => setActiveTab('Integrations')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'Integrations' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                            <Zap size={16} /> Integrations
                        </button>
                    </nav>
                </div>
                <div className="w-3/4 p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

const ProfileTab: React.FC<{ userData: any; setUserData: any; onSave: () => void }> = ({ userData, setUserData, onSave }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUserData((prev: any) => ({ ...prev, avatar: event.target?.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">My Profile</h2>
            <div className="space-y-6">
                <div className="flex items-center space-x-6">
                    <img 
                        src={userData.avatar} 
                        alt={userData.name} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                        <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 cursor-pointer">
                            Change Photo
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                        <select
                            name="timezone"
                            value={userData.timezone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="America/New_York">Eastern Time (US & Canada)</option>
                            <option value="America/Chicago">Central Time (US & Canada)</option>
                            <option value="America/Denver">Mountain Time (US & Canada)</option>
                            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select
                            name="language"
                            value={userData.language}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const CompanyTab: React.FC<{ companyData: any; setCompanyData: any; onSave: () => void }> = ({ companyData, setCompanyData, onSave }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCompanyData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setCompanyData((prev: any) => ({ ...prev, logo: event.target?.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Company Information</h2>
            <div className="space-y-6">
                <div className="flex items-center space-x-6">
                    <img 
                        src={companyData.logo} 
                        alt={companyData.name} 
                        className="w-32 h-12 object-contain border border-gray-200"
                    />
                    <div>
                        <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 cursor-pointer">
                            Change Logo
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            value={companyData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={companyData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={companyData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input
                            type="text"
                            name="website"
                            value={companyData.website}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            name="address"
                            value={companyData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;