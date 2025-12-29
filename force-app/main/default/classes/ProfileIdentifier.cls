public with sharing class ProfileIdentifier {


    public Boolean UserHasAdminProfile(User RandomUser) {
        boolean isAdmin = false;
        User user = [SELECT Id,Name,ProfileId FROM User WHERE ProfileId='00eWU00000JJKeP' LIMIT 1];
        if (user.ProfileId == '00eWU00000JJKeP') {
            isAdmin = true;
        }
        return isAdmin;

    }

    public Boolean UserHasCommercialProfile(User RandomUser) {
        boolean isCommercial = false;
        User user = [SELECT Id,Name,ProfileId FROM User WHERE ProfileId='00eWU00000JJKf3' LIMIT 1];
        if (user.ProfileId == '00eWU00000JJKf3') {
            isCommercial = true;
        }
        return isCommercial;

    }
}

