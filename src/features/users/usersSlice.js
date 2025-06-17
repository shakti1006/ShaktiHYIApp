import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUsersAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
} from './usersAPI';

export const USERS_PER_PAGE = 5;

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (page, { rejectWithValue }) => {
    try {
      const res = await fetchUsersAPI(page);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// CREATE: return exactly what we posted (including nested fields)
export const createUser = createAsyncThunk(
  'users/create',
  async (user, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await createUserAPI(user);
      // JSONPlaceholder echoes back only id; so merge in our full user
      return fulfillWithValue({ id: res.data.id, ...user });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// UPDATE: same idea—ignore API response, return your full object
export const updateUser = createAsyncThunk(
  'users/update',
  async (user, { fulfillWithValue }) => {
    try {
      // try the real API for side-effects
      await updateUserAPI(user);
    } catch (err) {
      // swallow any error (500, 404, etc.) so we still update locally
      console.warn('Update API failed, applying locally anyway:', err.message);
    }
    // always return the exact object we passed in
    return fulfillWithValue(user);
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteUserAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
  page: 1,
  hasNextPage: true,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetError(state) { state.error = null; },
    incrementPage(state) {
      if (state.hasNextPage) state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchUsers.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list.push(...payload);
        s.hasNextPage = payload.length === USERS_PER_PAGE;
      })
      .addCase(fetchUsers.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })

      // CREATE
      .addCase(createUser.fulfilled, (s, { payload }) => {
        s.list.unshift(payload);
      })

      // UPDATE
      .addCase(updateUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        const idx = s.list.findIndex(u => u.id === payload.id);
        if (idx !== -1) s.list[idx] = payload;
      })
      .addCase(updateUser.rejected, (s) => {
        // we no longer reject — this should never happen now
        s.loading = false;
      })

      // DELETE
      .addCase(deleteUser.fulfilled, (s, { payload }) => {
        s.list = s.list.filter(u => u.id !== payload);
      });
  },
});

export const { resetError, incrementPage } = usersSlice.actions;
export default usersSlice.reducer;
