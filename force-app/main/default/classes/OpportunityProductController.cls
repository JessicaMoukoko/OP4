public with sharing class OpportunityProductController {

    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunityProducts(String opportunityId) {

 List<OpportunityLineItem> opportunitesDesProduits = [
            SELECT Id,
                Quantity,
                UnitPrice,
                TotalPrice,
                ProductName__c,
       Quantity_In_Stock__c,
         IdDuProduit__c

            FROM OpportunityLineItem WHERE opportunityId=:opportunityId
            WITH SECURITY_ENFORCED
        ];
        return opportunitesDesProduits;
    }
    @AuraEnabled
public static void deleteOpportunityProduct(Id opportunityLineItemId) {
    delete [SELECT Id FROM OpportunityLineItem WHERE Id = :opportunityLineItemId];
}

}