public class OpportunityTriggerHandler {
    public static void handleAfterInsertUpdate(List<Opportunity> newOpportunities) {

        List<OpportunityLineItem> olis = [
            SELECT Id, OpportunityId, Quantity, Product2Id , Quantity_In_Stock__c
            FROM OpportunityLineItem 
            WHERE OpportunityId IN :newOpportunities 
            WITH SECURITY_ENFORCED
        ];

        Set<Id> productIds = new Set<Id>();
        for (OpportunityLineItem oli : olis) {
            productIds.add(oli.Product2Id);
        }

        List<Product2> productsToUpdate = [
            SELECT Id, QuantityInStock__c
            FROM Product2 
            WHERE Id IN :productIds
            WITH SECURITY_ENFORCED
        ];

        try {
            // Vérifier d'abord si une ligne dépasse le stock
            Boolean hasStockError = false;
            List<OpportunityErrorEvent__e> eventsToPublish = new List<OpportunityErrorEvent__e>();

            for (Opportunity opp : newOpportunities) {
                if (opp.StageName == 'Closed Won') {
                    for (OpportunityLineItem oli : olis) {
                        if (oli.OpportunityId == opp.Id) {
                            for (Product2 prod : productsToUpdate) {
                                if (oli.Product2Id == prod.Id && oli.Quantity > prod.QuantityInStock__c) {
                                    // Ligne dépasse le stock → préparer l'événement
                                    eventsToPublish.add(new OpportunityErrorEvent__e(
                                        OpportunityId__c = opp.Id,
                                        Message__c = 'Votre opportunité ne peut pas être mise à jour car vous avez un souci de quantité sur vos lignes.'
                                    ));
                                    hasStockError = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // S'il y a une erreur de stock, publier l'événement et arrêter
            if (hasStockError) {
                if (!eventsToPublish.isEmpty()) {
                    EventBus.publish(eventsToPublish);
                }
                return; // arrêter la mise à jour
            }

            // Sinon, décrémenter le stock pour toutes les lignes
            for (Opportunity opp : newOpportunities) {
                if (opp.StageName == 'Closed Won') {
                    for (OpportunityLineItem oli : olis) {
                        if (oli.OpportunityId == opp.Id) {
                            for (Product2 prod : productsToUpdate) {
                                if (oli.Product2Id == prod.Id) {
                                    prod.QuantityInStock__c -= oli.Quantity;
                                }
                            }
                        }
                    }
                }
            }

            // Mise à jour des produits
            if (!productsToUpdate.isEmpty()) {
                update productsToUpdate;
            }

        } catch (Exception e) {
            // Gestion d'erreur technique
            List<OpportunityErrorEvent__e> eventsToPublish = new List<OpportunityErrorEvent__e>();
            for (Opportunity opp : newOpportunities) {
                String errorMessage = System.Label.ErrorMessageFlow;
                eventsToPublish.add(new OpportunityErrorEvent__e(
                    OpportunityId__c = opp.Id,
                    Message__c = errorMessage
                ));
            }
            EventBus.publish(eventsToPublish);
        }
    }
}
