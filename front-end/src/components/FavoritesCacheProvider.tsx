import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@apollo/client';
import { getFavoritesQuery } from '../graphql/favorites';
import { useAuth } from '../hooks/useAuth';

interface FavoritesCacheContextType {
  favorites: string[];
  isLoading: boolean;
  refetch: () => void;
}

const FavoritesCacheContext = createContext<FavoritesCacheContextType | undefined>(undefined);

interface FavoritesCacheProviderProps {
  children: ReactNode;
}

export const FavoritesCacheProvider: React.FC<FavoritesCacheProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  const { data, loading, refetch } = useQuery(getFavoritesQuery, {
    skip: !user,
    fetchPolicy: 'cache-and-network',
  });

  const favorites = data?.getFavorites?.map((activity: any) => activity.id) || [];

  const value: FavoritesCacheContextType = {
    favorites,
    isLoading: loading,
    refetch,
  };

  return (
    <FavoritesCacheContext.Provider value={value}>
      {children}
    </FavoritesCacheContext.Provider>
  );
};

export const useFavoritesCache = (): FavoritesCacheContextType => {
  const context = useContext(FavoritesCacheContext);
  if (context === undefined) {
    throw new Error('useFavoritesCache must be used within a FavoritesCacheProvider');
  }
  return context;
};
