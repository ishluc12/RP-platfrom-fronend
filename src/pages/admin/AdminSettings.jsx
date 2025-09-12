import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminSettingsService from '../../services/admin/adminSettingsService'; // Assuming a new admin settings service

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        platformName: '',
        platformLogoUrl: '',
        supportEmail: '',
        contactPhone: '',
        defaultNotificationMethod: '',
        academicYearStartDate: '',
        academicYearEndDate: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminSettingsService.getPlatformSettings();
            setSettings(response.data || response);
        } catch (err) {
            console.error("Error fetching settings:", err);
            setError('Failed to load platform settings.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [id]: value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        try {
            await adminSettingsService.updatePlatformSettings(settings);
            setSaveSuccess(true);
        } catch (err) {
            console.error("Error saving settings:", err);
            setSaveError(err.message || 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Platform Settings" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Platform Settings</h1>
                    <p className="text-gray-600 mb-6">Manage global platform configurations.</p>

                    {saveSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Settings saved successfully.</span>
                        </div>
                    )}
                    {saveError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {saveError}</span>
                        </div>
                    )}

                    {loading ? (
                        <p>Loading settings...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Branding</h2>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="platformName">
                                        Platform Name
                                    </label>
                                    <input
                                        type="text"
                                        id="platformName"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={settings.platformName}
                                        onChange={handleChange}
                                        placeholder="Enter platform name"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="platformLogoUrl">
                                        Platform Logo Image URL
                                    </label>
                                    <input
                                        type="text"
                                        id="platformLogoUrl"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={settings.platformLogoUrl}
                                        onChange={handleChange}
                                        placeholder="Enter platform logo URL"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supportEmail">
                                        Support Email
                                    </label>
                                    <input
                                        type="email"
                                        id="supportEmail"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={settings.supportEmail}
                                        onChange={handleChange}
                                        placeholder="Enter support email"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactPhone">
                                        Contact Phone
                                    </label>
                                    <input
                                        type="text"
                                        id="contactPhone"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={settings.contactPhone}
                                        onChange={handleChange}
                                        placeholder="Enter contact phone number"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="defaultNotificationMethod">
                                        Default Notification Method
                                    </label>
                                    <select
                                        id="defaultNotificationMethod"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={settings.defaultNotificationMethod}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Method</option>
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                        <option value="in-app">In-App</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Academic Calendar</h2>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="academicYearStartDate">
                                        Academic Year Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="academicYearStartDate"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={settings.academicYearStartDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="academicYearEndDate">
                                        Academic Year End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="academicYearEndDate"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={settings.academicYearEndDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminSettings;
