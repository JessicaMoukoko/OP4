@isTest
public with sharing class ProfileControllerTest {

    // Test de la méthode isAdminUser

    @isTest
    public static void IsAdminUserTest() {

User user = testDataFactory.createUser();
PermissionSetAssignment psa = testDataFactory.CreatePermissionSetAssignmentAdmin();

Test.startTest();
Boolean isAdmin = ProfileController.isAdminUser(user.Id);
Test.stopTest();

System.assertequals(true,isAdmin);

}

// Test de la méthode isAdminUser pour un utilisateur non administrateur

    @isTest
public static void IsNotAdminUserTest() {

User user = testDataFactory.createUser();
PermissionSetAssignment psa = testDataFactory.CreatePermissionSetAssignmentNotAdmin();

Test.startTest();
Boolean isAdmin = ProfileController.isAdminUser(user.Id);
Test.stopTest();

System.assertequals(false,isAdmin);

}

}