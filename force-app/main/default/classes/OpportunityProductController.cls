public with sharing class OpportunityProductController {

    @AuraEnabled(cacheable=false)
    public static List<OpportunityLineItem> getOpportunityProducts(String OpportunityId) {

 List<OpportunityLineItem> OpportunitesDesProduits = [
            SELECT Quantity,
                UnitPrice,
                TotalPrice,
                Product2.Name,
                Product2.QuantityInStock__c

            FROM OpportunityLineItem WHERE opportunityId=:OpportunityId
        ];
        return OpportunitesDesProduits;
    }
}