import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { Activity } from '../activity/activity.schema';

/**
 * Service de gestion des favoris utilisateur
 * 
 * Ce service gère toutes les opérations liées aux favoris des utilisateurs :
 * - Ajout/suppression d'activités dans les favoris
 * - Réorganisation de l'ordre des favoris (drag & drop)
 * - Récupération et vérification du statut des favoris
 * 
 * Toutes les opérations incluent des validations automatiques pour garantir
 * la cohérence des données et prévenir les erreurs utilisateur.
 */
@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
  ) {}

  /**
   * Ajoute une activité aux favoris de l'utilisateur
   * 
   * @param userId - ID de l'utilisateur
   * @param activityId - ID de l'activité à ajouter
   * @returns Promise<User> - Utilisateur mis à jour avec ses favoris
   * 
   * @throws NotFoundException - Si l'utilisateur ou l'activité n'existe pas
   * @throws BadRequestException - Si l'activité est déjà dans les favoris
   */
  async addToFavorites(userId: string, activityId: string): Promise<User> {
    // Vérifier que l'activité existe avant de l'ajouter
    const activity = await this.activityModel.findById(activityId);
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Vérifier que l'utilisateur existe
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prévenir les doublons : vérifier que l'activité n'est pas déjà favorite
    if (user.favoriteActivities?.some((fav) => fav.toString() === activityId)) {
      throw new BadRequestException('Activity is already in favorites');
    }

    // Ajouter l'activité aux favoris avec $push (maintient l'ordre d'ajout)
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { favoriteActivities: activityId } },
        { new: true }, // Retourner le document mis à jour
      )
      .populate('favoriteActivities'); // Hydrater les données des activités

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  /**
   * Retire une activité des favoris de l'utilisateur
   * 
   * @param userId - ID de l'utilisateur
   * @param activityId - ID de l'activité à retirer
   * @returns Promise<User> - Utilisateur mis à jour avec ses favoris
   * 
   * @throws NotFoundException - Si l'utilisateur n'existe pas
   * @throws BadRequestException - Si l'activité n'est pas dans les favoris
   */
  async removeFromFavorites(userId: string, activityId: string): Promise<User> {
    // Vérifier que l'utilisateur existe
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier que l'activité est bien dans les favoris avant suppression
    if (!user.favoriteActivities?.some((fav) => fav.toString() === activityId)) {
      throw new BadRequestException('Activity is not in favorites');
    }

    // Retirer l'activité des favoris avec $pull (supprime toutes les occurrences)
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { favoriteActivities: activityId } },
        { new: true }, // Retourner le document mis à jour
      )
      .populate('favoriteActivities'); // Hydrater les données des activités

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  /**
   * Réorganise l'ordre des favoris de l'utilisateur (drag & drop)
   * 
   * @param userId - ID de l'utilisateur
   * @param activityIds - Tableau ordonné des IDs d'activités
   * @returns Promise<User> - Utilisateur mis à jour avec le nouvel ordre
   * 
   * @throws NotFoundException - Si l'utilisateur n'existe pas
   * @throws BadRequestException - Si certaines activités ne sont pas dans les favoris
   */
  async reorderFavorites(userId: string, activityIds: string[]): Promise<User> {
    // Vérifier que l'utilisateur existe
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validation de cohérence : toutes les activités doivent être dans les favoris actuels
    const userFavorites = user.favoriteActivities || [];
    const allActivitiesInFavorites = activityIds.every((id) =>
      userFavorites.some((fav) => fav.toString() === id),
    );

    if (!allActivitiesInFavorites) {
      throw new BadRequestException('Some activities are not in favorites');
    }

    // Validation supplémentaire : le nombre d'activités doit correspondre
    if (activityIds.length !== userFavorites.length) {
      throw new BadRequestException('Activity count mismatch');
    }

    // Remplacer complètement l'ordre des favoris
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { favoriteActivities: activityIds },
        { new: true }, // Retourner le document mis à jour
      )
      .populate('favoriteActivities'); // Hydrater les données des activités

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  /**
   * Récupère la liste complète des favoris d'un utilisateur
   * 
   * @param userId - ID de l'utilisateur
   * @returns Promise<Activity[]> - Liste des activités favorites (dans l'ordre)
   * 
   * @throws NotFoundException - Si l'utilisateur n'existe pas
   */
  async getFavorites(userId: string): Promise<Activity[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('favoriteActivities') // Hydrater les données complètes des activités
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Retourner un tableau vide si pas de favoris (plutôt que undefined)
    return user.favoriteActivities || [];
  }

  /**
   * Vérifie si une activité est dans les favoris d'un utilisateur
   * 
   * @param userId - ID de l'utilisateur
   * @param activityId - ID de l'activité à vérifier
   * @returns Promise<boolean> - true si l'activité est favorite, false sinon
   * 
   * Note: Retourne false si l'utilisateur n'existe pas (pas d'exception)
   */
  async isFavorite(userId: string, activityId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      // Retourner false plutôt qu'une exception pour une meilleure UX
      return false;
    }

    // Vérifier la présence de l'activité dans les favoris
    return user.favoriteActivities?.some((fav) => fav.toString() === activityId) || false;
  }
}
