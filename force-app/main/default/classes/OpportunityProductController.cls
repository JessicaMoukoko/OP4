public with sharing class OpportunityProductController {

    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunityProducts() {

 List<OpportunityLineItem> OpportunitesDesProduits = [
            SELECT Quantity,
                UnitPrice,
                TotalPrice,
                PricebookEntry.Product2.Name,
                PricebookEntry.Product2.QuantityInStock__c

            FROM OpportunityLineItem
        ];
        return OpportunitesDesProduits;
    }
}