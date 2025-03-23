import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  clinics: number[];
}

const initialState: FavoritesState = {
  clinics: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<number>) => {
      if (!state.clinics.includes(action.payload)) {
        state.clinics.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.clinics = state.clinics.filter(id => id !== action.payload);
    },
    clearFavorites: (state) => {
      state.clinics = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer; 