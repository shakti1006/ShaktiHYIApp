import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUsersAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
} from './usersAPI';

export const USERS_PER_PAGE = 5;

const initialState = {
  list: [],
  loading: false,
  error: null,
  page: 1,
  hasNextPage: true,
};

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (page) => {
    const res = await fetchUsersAPI(page);
    return res.data;
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (user) => {
    const res = await createUserAPI(user);
    return res.data;
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async (user) => {
    const res = await updateUserAPI(user);
    return res.data;
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id) => {
    await deleteUserAPI(id);
    return id;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    incrementPage(state) {
      if (state.hasNextPage) {
        state.page += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.list.push(...a.payload);
        // Make sure to use `a.payload` here!
        s.hasNextPage = a.payload.length === USERS_PER_PAGE;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })

      // CREATE
      .addCase(createUser.fulfilled, (s, a) => {
        s.list.unshift(a.payload);
      })

      // UPDATE
      .addCase(updateUser.fulfilled, (s, a) => {
        s.list = s.list.map(u => (u.id === a.payload.id ? a.payload : u));
      })

      // DELETE
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.list = s.list.filter(u => u.id !== a.payload);
      });
  },
});

export const { resetError, incrementPage } = usersSlice.actions;
export default usersSlice.reducer;
