@isTest
public with sharing class testDataFactory {

    public static User createUser() {
      Profile p = [
        SELECT Id
        FROM Profile
        WHERE Name = 'System Administrator'
        LIMIT 1
    ];
    User user = new User(
        LastName = 'User Test',
        Username = 'testuser' + System.currentTimeMillis() + '@gmail.com',
        Email = 'testuser@gmail.com',
        Alias = 'tuser',
        TimeZoneSidKey = 'Europe/Paris',
        LocaleSidKey = 'fr_FR',
        EmailEncodingKey = 'UTF-8',
        LanguageLocaleKey = 'fr',
        ProfileId = p.Id
    );
        insert user;
    return user ;

    }

    public static Product2 createProduct() {
Product2 product = new Product2(
    Name= 'Tesla Model S',
    isActive=true,
    QuantityInStock__c= 10    
    );
        insert product;
    return product ;

    }

    // Crée un PricebookEntry pour un produit dans le Pricebook Standard

    public static PricebookEntry createPricebookEntry(Product2 product) {
        Id standardPbId = Test.getStandardPricebookId();

        PricebookEntry pbe = new PricebookEntry(
            Product2Id = product.Id,
            Pricebook2Id = standardPbId,
            UnitPrice = 30000,
            IsActive = true
        );
        insert pbe;
        return pbe;
    }
// Crée une Opportunity avec le Pricebook Standard

    public static Opportunity createOpportunity() {
        // Récupérer le Pricebook Standard

         Id standardPbId = Test.getStandardPricebookId();

        Opportunity opp = new Opportunity(
            Name = 'Test Opportunity ',
            CloseDate = Date.today(),
            StageName = 'Prospecting',
            Pricebook2Id = standardPbId // Obligatoire !
        );
        insert opp;
        return opp;
    }
  

   // Crée un OpportunityLineItem correctement lié
    public static OpportunityLineItem createOpportunityLineItem() {
        Product2 product = createProduct();
        PricebookEntry pbe = createPricebookEntry(product);
        Opportunity opp = createOpportunity();

        OpportunityLineItem oli = new OpportunityLineItem(
            OpportunityId = opp.Id,
            PricebookEntryId = pbe.Id,
            Quantity = 1,
            UnitPrice = pbe.UnitPrice
        );
        insert oli;
        return oli;
    }


     @isTest
    public static PermissionSetAssignment CreatePermissionSetAssignmentAdmin() {

User user = createUser();
Id userId = user.Id;

String permSetApiName = 'Admin';

PermissionSet ps = [
    SELECT Id,Name
    FROM PermissionSet
    WHERE Name = :permSetApiName
    LIMIT 1
];

PermissionSetAssignment psa = new PermissionSetAssignment(
    AssigneeId = userId,
    PermissionSetId = ps.Id
);

insert psa;
return psa;
}

@isTest
    public static PermissionSetAssignment CreatePermissionSetAssignmentNotAdmin() {

User user = createUser();
Id userId = user.Id;

String permSetApiName = 'NotAdmin';

PermissionSet ps = [
    SELECT Id,Name
    FROM PermissionSet
    WHERE Name = :permSetApiName
    LIMIT 1
];

PermissionSetAssignment psa = new PermissionSetAssignment(
    AssigneeId = userId,
    PermissionSetId = ps.Id
);

insert psa;
return psa;
}

}