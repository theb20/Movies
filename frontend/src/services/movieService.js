import api from '../configuration/api_axios';

const movieService = {
  getAllMovies: async () => {
    const response = await api.get('/movies');
    return response.data;

  },

  getMovieById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export default movieService;