public with sharing class ProfileController {
      @AuraEnabled(cacheable=true)
public static boolean isAdminUser(Id userId) {
        return FeatureManagement.checkPermission('Admin');
    }
    }