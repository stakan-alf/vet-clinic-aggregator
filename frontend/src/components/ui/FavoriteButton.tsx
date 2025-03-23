import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';

interface FavoriteButtonProps {
  clinicId: number;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ clinicId }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.clinics);
  const isFavorite = favorites.includes(clinicId);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(clinicId));
    } else {
      dispatch(addToFavorites(clinicId));
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      {isFavorite ? (
        <FaHeart className="text-red-500 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-500 text-xl" />
      )}
    </button>
  );
};

export default FavoriteButton; 