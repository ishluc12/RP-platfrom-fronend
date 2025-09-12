import api from '../api';

const adminSurveyService = {
    adminListSurveys: async () => {
        const response = await api.get('/admin/surveys');
        return response.data;
    },
    createSurvey: async (surveyData) => {
        const response = await api.post('/admin/surveys', surveyData);
        return response.data;
    },
    updateSurvey: async (id, surveyData) => {
        const response = await api.put(`/admin/surveys/${id}`, surveyData);
        return response.data;
    },
    deleteSurvey: async (id) => {
        const response = await api.delete(`/admin/surveys/${id}`);
        return response.data;
    },
    getSurveyDetails: async (id) => {
        const response = await api.get(`/admin/surveys/${id}`);
        return response.data;
    },
    adminAggregateRatings: async () => {
        const response = await api.get('/admin/surveys/aggregates');
        return response.data;
    },
};

export default adminSurveyService;
