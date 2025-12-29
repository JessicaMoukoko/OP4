public with sharing class OpportunityProductController {

    public List<OpportunityLineItem> OpportunityProductController() {

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