import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { Activity } from '../activity/activity.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
  ) {}

  async addToFavorites(userId: string, activityId: string): Promise<User> {
    // Vérifier que l'activité existe
    const activity = await this.activityModel.findById(activityId);
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Vérifier que l'utilisateur existe
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier que l'activité n'est pas déjà dans les favoris
    if (user.favoriteActivities?.some((fav) => fav.toString() === activityId)) {
      throw new BadRequestException('Activity is already in favorites');
    }

    // Ajouter l'activité aux favoris
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { favoriteActivities: activityId } },
        { new: true },
      )
      .populate('favoriteActivities');

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  async removeFromFavorites(userId: string, activityId: string): Promise<User> {
    // Vérifier que l'utilisateur existe
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier que l'activité est dans les favoris
    if (!user.favoriteActivities?.some((fav) => fav.toString() === activityId)) {
      throw new BadRequestException('Activity is not in favorites');
    }

    // Retirer l'activité des favoris
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { favoriteActivities: activityId } },
        { new: true },
      )
      .populate('favoriteActivities');

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  async reorderFavorites(userId: string, activityIds: string[]): Promise<User> {
    // Vérifier que l'utilisateur existe
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier que toutes les activités sont bien dans les favoris de l'utilisateur
    const userFavorites = user.favoriteActivities || [];
    const allActivitiesInFavorites = activityIds.every((id) =>
      userFavorites.some((fav) => fav.toString() === id),
    );

    if (!allActivitiesInFavorites) {
      throw new BadRequestException('Some activities are not in favorites');
    }

    // Mettre à jour l'ordre des favoris
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { favoriteActivities: activityIds },
        { new: true },
      )
      .populate('favoriteActivities');

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  async getFavorites(userId: string): Promise<Activity[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('favoriteActivities')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.favoriteActivities || [];
  }

  async isFavorite(userId: string, activityId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return false;
    }

    return user.favoriteActivities?.some((fav) => fav.toString() === activityId) || false;
  }
}
