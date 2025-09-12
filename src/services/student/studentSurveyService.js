import api from '../api';

const studentSurveyService = {
    createSurvey: async (surveyData) => {
        const response = await api.post('/shared/surveys', surveyData);
        return response.data;
    },
    getSurveyDetails: async (id) => {
        const response = await api.get(`/shared/surveys/${id}`);
        return response.data;
    },
    listStudentSurveys: async () => {
        const response = await api.get('/shared/surveys/student-list');
        return response.data;
    },
    updateSurvey: async (id, surveyData) => {
        const response = await api.put(`/shared/surveys/${id}`, surveyData);
        return response.data;
    },
    deleteSurvey: async (id) => {
        const response = await api.delete(`/shared/surveys/${id}`);
        return response.data;
    },
    submitSurveyResponse: async (id, responseData) => {
        const response = await api.post(`/shared/surveys/${id}/response`, responseData);
        return response.data;
    },
};

export default studentSurveyService;
