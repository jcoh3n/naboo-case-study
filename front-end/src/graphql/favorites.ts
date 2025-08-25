import { gql } from '@apollo/client';

// Mutations
export const addToFavoritesMutation = gql`
  mutation AddToFavorites($activityId: String!) {
    addToFavorites(activityId: $activityId) {
      id
      favoriteActivities {
        id
        name
        city
        description
        price
        createdAt
        owner {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const removeFromFavoritesMutation = gql`
  mutation RemoveFromFavorites($activityId: String!) {
    removeFromFavorites(activityId: $activityId) {
      id
      favoriteActivities {
        id
        name
        city
        description
        price
        createdAt
        owner {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const reorderFavoritesMutation = gql`
  mutation ReorderFavorites($activityIds: [String!]!) {
    reorderFavorites(activityIds: $activityIds) {
      id
      favoriteActivities {
        id
        name
        city
        description
        price
        createdAt
        owner {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

// Queries
export const getFavoritesQuery = gql`
  query GetFavorites {
    getFavorites {
      id
      name
      city
      description
      price
      createdAt
      owner {
        id
        firstName
        lastName
      }
    }
  }
`;

export const isFavoriteQuery = gql`
  query IsFavorite($activityId: String!) {
    isFavorite(activityId: $activityId)
  }
`;
