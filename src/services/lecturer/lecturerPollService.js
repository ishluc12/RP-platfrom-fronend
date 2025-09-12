import api from '../api';

const lecturerPollService = {
    getLecturerPolls: async () => {
        const response = await api.get('/lecturer/polls');
        return response.data;
    },
    createPoll: async (pollData) => {
        const response = await api.post('/lecturer/polls', pollData);
        return response.data;
    },
};

export default lecturerPollService;
