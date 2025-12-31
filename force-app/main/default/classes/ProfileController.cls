public with sharing class ProfileController {
      @AuraEnabled(cacheable=true)
public static boolean isAdminUser() {
        return FeatureManagement.checkPermission('Admin');
    }
    }