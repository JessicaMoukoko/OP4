public with sharing class OpportunityProductController {

 // Méthode pour récupérer les produits liés à une opportunité

    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunityProducts(String opportunityId) {

 List<OpportunityLineItem> ProduitsDeLopportunite = [
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
        return ProduitsDeLopportunite;
    }

    // Méthode pour supprimer un produit d'une opportunité
    
    @AuraEnabled
public static void deleteOpportunityProduct(Id opportunityLineItemId) {
    delete [SELECT Id FROM OpportunityLineItem WHERE Id = :opportunityLineItemId];
}

}