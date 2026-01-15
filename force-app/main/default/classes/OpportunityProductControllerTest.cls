@isTest
public with sharing class OpportunityProductControllerTest {

@isTest  
    public static void OpportunityProductControllerTest() {

        OpportunityLineItem oli = testDataFactory.createOpportunityLineItem();
        
       // Test de la méthode getOpportunityProducts

        Test.startTest();
        List<OpportunityLineItem> listOli = OpportunityProductController.getOpportunityProducts(oli.OpportunityId);
        Test.stopTest();

        System.assertEquals(1, listOli.size());


       // Test de la méthode deleteOpportunityProduct

        OpportunityProductController.deleteOpportunityProduct(oli.Id);
        
        List<OpportunityLineItem> listOliAfterDelete =
            OpportunityProductController.getOpportunityProducts(oli.OpportunityId);

        System.assertequals(0,listOliAfterDelete.size());
    }
}