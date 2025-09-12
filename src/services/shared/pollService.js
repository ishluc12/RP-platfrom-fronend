import api from '../api';

const pollService = {
    createPoll: async (pollData) => {
        const response = await api.post('/shared/polls', pollData);
        return response.data;
    },
    getAllPolls: async () => {
        const response = await api.get('/shared/polls');
        return response.data;
    },
    getPollById: async (id) => {
        const response = await api.get(`/shared/polls/${id}`);
        return response.data;
    },
    voteOnPoll: async (voteData) => {
        const response = await api.post('/shared/polls/vote', voteData);
        return response.data;
    },
};

export default pollService;
