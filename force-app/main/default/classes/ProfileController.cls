public with sharing class ProfileController {
      
      // Méthode pour vérifier si l'utilisateur est un administrateur

      @AuraEnabled(cacheable=true)
public static boolean isAdminUser(Id userId) {
      
        return FeatureManagement.checkPermission('Admin');
    }
    }