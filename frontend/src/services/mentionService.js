import api from '../configuration/api_axios.js';

const mentionService = {
  //opérations commentaires
  getAllComments: async () => {
    const response = await api.get('/comment');
    return response.data;
  },
  getCommentById: async (id) => {
    const response = await api.get(`/comment/${id}`);
    return response.data;
  },
  addComment: async (commentData) => {
    const response = await api.post('/comment', commentData);
    return response.data;
  },
  putComment: async (id, commentData) => {
    const response = await api.put(`/comment/${id}`, commentData);
    return response.data;
  },
  deleteComment: async (id) => {
    const response = await api.delete(`/comment/${id}`);
    return response.data;
  },
  //opérations likes
  getAllLikes: async () => {
    const response = await api.get('/likes');
    return response.data;
  },
  getLikeById: async (id) => {
    const response = await api.get(`/likes/${id}`);
    return response.data;
  },

  getAllLikes: async () => {
    const response = await api.get('/likes');
    return response.data;
  },

  getAllLikesByMovie: async (id_movie) => {
    // Récupère tous les likes d'un film donné
    const response = await api.get(`/likes/movie/${id_movie}`);
    return response.data;
  },

  addLike: async (likeData) => {
    // likeData doit contenir { id_movie, id_user }
    const response = await api.post('/likes/add', likeData);
    return response.data;
  },

  deleteLike: async (id_movie) => {
    // Récupère id_user depuis le token stocké en localStorage
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Utilisateur non authentifié');

    const payload = JSON.parse(atob(token.split('.')[1]));
    const id_user = payload.id_user;

    const response = await api.delete(`/likes/remove/${id_movie}/${id_user}`);
    return response.data;
  },

  getAllLikesByUser: async (id_user) => {
    // Récupère tous les likes d'un utilisateur donné
    const response = await api.get(`/likes/user/${id_user}`);
    return response.data;
  }
};
export default mentionService;
