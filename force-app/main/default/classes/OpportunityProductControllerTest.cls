@isTest
public with sharing class OpportunityProductControllerTest {

@isTest  
    public static void OpportunityProductControllerTest() {

        OpportunityLineItem oli = testDataFactory.createOpportunityLineItem();

        Test.startTest();
        List<OpportunityLineItem> listOli = OpportunityProductController.getOpportunityProducts(oli.OpportunityId);
        Test.stopTest();

        System.assertequals(true,listOli.size() > 0);

       
        OpportunityProductController.deleteOpportunityProduct(oli.Id);
        
        List<OpportunityLineItem> listOliAfterDelete =
            OpportunityProductController.getOpportunityProducts(oli.OpportunityId);

        System.assertequals(false,listOliAfterDelete.size() > 0);
    }
}