import api from '../configuration/api_axios';

const movieService = {
  // Opérations de lecture des films
  getAllMovies: async () => {
    const response = await api.get('/movies');
    return response.data;
  },

  getMovieById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  getPopularMovies: async () => {
    const response = await api.get('/search/popular');
    return response.data;
  },

  // Opérations CRUD sur les films
  addMovie: async (movieData) => {
    const response = await api.post('/movies', movieData);
    return response.data;
  },

  putMovie: async (id, movieData) => {
    const response = await api.put(`/movies/${id}`, movieData);
    return response.data;
  },

  deleteMovie: async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  },

  // Opérations sur les catégories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  addCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  putCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Opérations de recherche
  getAllSearch: async () => {
    const response = await api.get('/search/popular');
    return response.data;
  },

  deleteSearch: async (id) => {
    const response = await api.delete(`/search/${id}`);
    return response.data;
  },
   // Recherche de films
   searchMovies: async (query, userId) => {
    const response = await api.get(`/search/movies?q=${encodeURIComponent(query)}&userId=${userId}
`);
    return response.data;
  }
};


export default movieService;