public with sharing class ProfileController {
      @AuraEnabled(cacheable=true)
public static boolean isAdminUser(Id userId) {
      System.debug('User Id: ' + userId);
        return FeatureManagement.checkPermission('Admin');
    }
    }