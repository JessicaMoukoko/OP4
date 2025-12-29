public with sharing class OpportunityProductController {

    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunityProducts(Opportunity opportunity) {

 List<OpportunityLineItem> OpportunitesDesProduits = [
            SELECT Quantity,
                UnitPrice,
                TotalPrice,
                Product2.Name,
                Product2.QuantityInStock__c

            FROM OpportunityLineItem WHERE opportunityId=:opportunity.Id
        ];
        return OpportunitesDesProduits;
    }
}