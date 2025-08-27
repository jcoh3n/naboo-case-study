import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritesService } from './favorites.service';
import { FavoritesResolver } from './favorites.resolver';
import { User, UserSchema } from '../user/user.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';

/**
 * Module de gestion des favoris utilisateur
 * 
 * Ce module encapsule toute la logique des favoris :
 * - Service : Logique métier et accès aux données
 * - Resolver : API GraphQL avec authentification
 * - Schemas : Modèles User et Activity (injection de dépendances)
 * 
 * Le service est exporté pour être utilisé dans d'autres modules si nécessaire.
 */
@Module({
  imports: [
    // Injection des modèles Mongoose nécessaires
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },     // Pour accéder aux favoris utilisateur
      { name: Activity.name, schema: ActivitySchema }, // Pour valider les activités
    ]),
  ],
  providers: [FavoritesService, FavoritesResolver], // Services et resolvers disponibles
  exports: [FavoritesService], // Service exporté pour réutilisation
})
export class FavoritesModule {}
