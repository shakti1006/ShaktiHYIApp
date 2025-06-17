import api from '../../api/axios';
import { USERS_PER_PAGE } from './usersSlice';

export const fetchUsersAPI = (page) =>
  api.get('/users', { params: { _page: page, _limit: USERS_PER_PAGE } });

export const createUserAPI = (user) =>
  api.post('/users', user);

export const updateUserAPI = (user) =>
  api.put(`/users/${user.id}`, user);

export const deleteUserAPI = (id) =>
  api.delete(`/users/${id}`);
