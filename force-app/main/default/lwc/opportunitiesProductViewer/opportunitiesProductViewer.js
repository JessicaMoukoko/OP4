import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';

export default class OpportunityProductTable extends NavigationMixin(LightningElement) {

    @api recordId; 

    data;
    error;
    wiredResult;

    // Colonnes affichées dans le tableau
    
    columns = [
        { label: 'Produit', fieldName: 'ProductName__c', type: 'text' },
        { label: 'Prix Unitaire', fieldName: 'UnitPrice', type: 'currency' },
        { label: 'Quantité', fieldName: 'Quantity', type: 'number' },
        { label: 'Total', fieldName: 'TotalPrice', type: 'currency' },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'Voir produit', name: 'view', iconName: 'utility:preview' },
                    { label: 'Supprimer', name: 'delete', iconName: 'utility:delete' }
                ]
            }
        }
    ];

    // Données récupérées via la méthode Apex

    @wire(getOpportunityProducts, { opportunityId: '$recordId' })
    wiredProducts(result) {
        this.wiredResult = result;

        if (result.data) {
            this.data = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    
    // Actions sur les lignes du tableau

    handleRowAction(event) {
        const action = event.detail.action.name;
        const row = event.detail.row;

        if (action === 'view') {
            this.viewProduct(row.Product2Id);
        }

        if (action === 'delete') {
            this.deleteOpportunityLine(row.Id);
        }
    }

    // Pour Voir un produit

    viewProduct(productId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: productId,
                objectApiName: 'Product2',
                actionName: 'view'
            }
        });
    }

    // Supprimer une ligne d’opportunité
   
    deleteOpportunityLine(lineItemId) {
        deleteRecord(lineItemId)
            .then(() => {
                this.showToast('Succès', 'Produit supprimé', 'success');
                refreshApex(this.wiredResult);
            })
            .catch(error => {
                this.showToast(
                    'Erreur',
                    error.body?.message || 'Impossible de supprimer',
                    'error'
                );
            });
    }

    // Afficher un message Toast
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}
