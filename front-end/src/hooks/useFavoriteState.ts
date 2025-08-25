import { useState, useEffect } from 'react';
import { useFavoritesCache } from '../components/FavoritesCacheProvider';

interface UseFavoriteStateReturn {
  isFavorite: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export const useFavoriteState = (activityId: string): UseFavoriteStateReturn => {
  const { favorites, isLoading, refetch } = useFavoritesCache();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.includes(activityId));
  }, [favorites, activityId]);

  return {
    isFavorite,
    isLoading,
    refetch,
  };
};
