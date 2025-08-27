import { useState, useEffect } from 'react';
import { useFavoritesCache } from '../components/FavoritesCacheProvider';

interface UseFavoriteStateReturn {
  isFavorite: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export const useFavoriteState = (activityId: string): UseFavoriteStateReturn => {
  const { favoriteIds, isLoading, refetch } = useFavoritesCache();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favoriteIds.includes(activityId));
  }, [favoriteIds, activityId]);

  return {
    isFavorite,
    isLoading,
    refetch,
  };
};
