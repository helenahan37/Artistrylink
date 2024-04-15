import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseURL from '../../utils/baseURL';
import { resetErrAction } from './globalActions/globalActions';

//initial state
const initialState = {
	loading: false,
	error: null,
	artworks: [],
	artwork: {},
	isAdded: false,
	isDeleted: false,
	isUpdated: false,
};

// create upload artwork action
export const uploadArtworkAction = createAsyncThunk(
	'artworks/upload',
	async (payload, { rejectWithValue, getState, dispatch }) => {
		try {
			const { title, description, genre, medium, file, username } = payload;

			//get token from localstorage
			const token = getState()?.users?.userAuth?.userInfo?.token;
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			};

			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('genre', genre);
			formData.append('medium', medium);
			formData.append('file', file);
			formData.append('username', username);

			//make the http request
			const { data } = await axios.post(`${baseURL}/artworks/upload`, formData, config);

			return data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error?.response?.data);
		}
	}
);

//slice
const artworksSlice = createSlice({
	name: 'artworks',
	initialState,
	reducers: {
		resetAddState: (state) => {
			state.isAdded = false;
		},
		resetSuccessState: (state) => {
			state.isDeleted = false;
			state.isUpdated = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(uploadArtworkAction.pending, (state) => {
				state.loading = true;
				state.isAdded = false;
			})
			.addCase(uploadArtworkAction.fulfilled, (state, action) => {
				state.loading = false;
				state.artwork = action.payload;
				state.isAdded = true;
				state.error = null;
			})
			.addCase(uploadArtworkAction.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.isAdded = false;
			});

		builder.addCase(resetErrAction.pending, (state) => {
			state.error = null;
		});
	},
});

// Exports
export default artworksSlice.reducer;
export const { resetAddState, resetSuccessState } = artworksSlice.actions;
