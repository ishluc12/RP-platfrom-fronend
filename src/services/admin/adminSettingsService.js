import api from '../api';

const adminSettingsService = {
    getPlatformSettings: async () => {
        const response = await api.get('/admin/settings'); // Assuming this endpoint exists
        return response.data;
    },
    updatePlatformSettings: async (settingsData) => {
        const response = await api.put('/admin/settings', settingsData); // Assuming this endpoint exists
        return response.data;
    },
};

export default adminSettingsService;
