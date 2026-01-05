@isTest
public with sharing class ProfileControllerTest {
    @isTest
    public static void IsAdminUserTest() {

User user = testDataFactory.createUser();
PermissionSetAssignment psa = testDataFactory.CreatePermissionSetAssignmentAdmin();

Test.startTest();
Boolean isAdmin = ProfileController.isAdminUser(user.Id);
Test.stopTest();

System.assertequals(true,isAdmin);

}
public static void IsNotAdminUserTest() {

User user = testDataFactory.createUser();
PermissionSetAssignment psa = testDataFactory.CreatePermissionSetAssignmentNotAdmin();

Test.startTest();
Boolean isAdmin = ProfileController.isAdminUser(user.Id);
Test.stopTest();

System.assertequals(false,isAdmin);

}

}