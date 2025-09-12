import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import authService from '../../services/authService';

const Settings = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [inAppNotifications, setInAppNotifications] = useState(true);

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState(null);
    const [profileSuccess, setProfileSuccess] = useState(false);

    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile();
                const userData = response.data || response;
                setName(userData.name || '');
                setEmail(userData.email || '');
                setPhone(userData.phone || '');
            } catch (err) {
                console.error("Error fetching profile:", err);
                setProfileError('Failed to load profile.');
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        setLoadingProfile(true);
        setProfileError(null);
        setProfileSuccess(false);

        try {
            const profileData = { name, email, phone }; // Add other profile fields as needed
            await authService.updateProfile(profileData);
            setProfileSuccess(true);
        } catch (err) {
            console.error("Error updating profile:", err);
            setProfileError(err.message || 'Failed to update profile.');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            setPasswordError('New password and confirmation do not match.');
            return;
        }

        setChangingPassword(true);
        setPasswordError(null);
        setPasswordSuccess(false);

        try {
            await authService.changePassword({ currentPassword, newPassword });
            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            console.error("Error changing password:", err);
            setPasswordError(err.message || 'Failed to change password.');
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Settings" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Settings</h1>
                    <p className="text-gray-600 mb-6">Manage your profile, password, and notification preferences.</p>

                    {profileSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Profile updated successfully.</span>
                        </div>
                    )}
                    {profileError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {profileError}</span>
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Password changed successfully.</span>
                        </div>
                    )}
                    {passwordError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {passwordError}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>
                        {loadingProfile ? (
                            <p>Loading profile...</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                            Name
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                        Phone
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="phone"
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>
                                    <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    {/* TODO: Implement actual file upload using authService.uploadProfilePicture */}
                                </div>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleUpdateProfile}
                                    disabled={loadingProfile}
                                >
                                    {loadingProfile ? 'Updating...' : 'Update Profile'}
                                </button>
                            </>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Password</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current-password">
                                Current Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                                New Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-new-password">
                                Confirm New Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="confirm-new-password"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleChangePassword}
                            disabled={changingPassword}
                        >
                            {changingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                />
                                <span className="ml-2 text-gray-700">Email Notifications</span>
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={pushNotifications}
                                    onChange={(e) => setPushNotifications(e.target.checked)}
                                />
                                <span className="ml-2 text-gray-700">Push Notifications</span>
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={inAppNotifications}
                                    onChange={(e) => setInAppNotifications(e.target.checked)}
                                />
                                <span className="ml-2 text-gray-700">In-App Notifications</span>
                            </label>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
