import { LightningElement, api, wire  } from 'lwc';  
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';
import deleteOpportunityProduct from '@salesforce/apex/OpportunityProductController.deleteOpportunityProduct';
import isAdminUser from '@salesforce/apex/ProfileController.isAdminUser';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';


export default class OpportunitiesProductViewer extends  NavigationMixin(LightningElement)  {


@api recordId;
isAdmin = false;
isCommercial = false;
opportunities;
error;
wiredOpportunitiesProductsResults;
wiredProfileResults;  
quantityProblem = false;

columnsCommercial = [
       { label: 'Nom du Produit', fieldName: 'ProductName__c', type: 'text' },
        { label: 'Prix Unitaire', fieldName: 'UnitPrice', type: 'number' },
        { label: 'Prix Total', fieldName: 'TotalPrice', type: 'number' },
        { label: 'Quantité', fieldName: 'Quantity', type: 'number',
            cellAttributes: { 
                class: { fieldName: 'quantityClass' }
            }
         },
      { label: 'Quantité en Stock', fieldName: 'Quantity_In_Stock__c', type: 'number' },
      {
        label: 'Supprimer',
        type: 'button-icon',
        initialWidth: 90,
        typeAttributes: {
            iconName: 'utility:delete',
            name: 'delete',
            title: 'Supprimer',
            variant: 'border-filled',
            alternativeText: 'Supprimer'
        } }];

    columnsAdministrateur = [ { label: 'Nom du Produit', fieldName: 'ProductName__c', type: 'text' },
        { label: 'Prix Unitaire', fieldName: 'UnitPrice', type: 'number' },
        { label: 'Prix Total', fieldName: 'TotalPrice', type: 'number' },
        { label: 'Quantité', fieldName: 'Quantity', type: 'number',
            cellAttributes: { 
                class: { fieldName: 'quantityClass' }
            }
         },
      { label: 'Quantité en Stock', fieldName: 'Quantity_In_Stock__c', type: 'number' },
      {
        label: 'Supprimer',
        type: 'button-icon',
        initialWidth: 90,
        typeAttributes: {
            iconName: 'utility:delete',
            name: 'delete',
            title: 'Supprimer',
            variant: 'border-filled',
            alternativeText: 'Supprimer'
        } },
    { label: 'Voir Produit',
         type: 'button', 
            initialWidth: 160,
         typeAttributes: { 
            label: 'View Product',
            iconName: 'utility:preview',
             name: 'preview',
              title: 'Voir Produit',
                variant: 'brand',
            alternativeText: 'Voir Produit'
         } }
    ];


    @wire(getOpportunityProducts, { opportunityId: '$recordId' })
wiredOpportunities(result) {
    this.wiredOpportunitiesProductsResults = result;
    if (result.data) {
        // Créer une copie immuable de chaque ligne
        this.opportunities = result.data.map(row => {
            return {
                ...row, // copie toutes les propriétés existantes
                quantityClass: row.Quantity > row.Quantity_In_Stock__c ? 'slds-theme_error slds-text-title_bold' : ''
            };
           
        });
        this.error = undefined;
    } else if (result.error) {
        this.error = result.error;
        this.opportunities = undefined;
    }
}

 @wire(isAdminUser)
    wiredProfileResults({ data }) {
        this.isAdmin = data === true;
        this.isCommercial = data !== true;
    }

get hasNoProducts() {
    return this.opportunities && this.opportunities.length === 0;
}


handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    if (actionName === 'delete') {
        this.handleDelete(row.Id);
    } 
    else if (actionName === 'preview') {
        this.navigateToProduct(row.IdDuProduit__c);
    }
}
 handleDelete(opportunityLineItemId) {
        deleteOpportunityProduct({ opportunityLineItemId: opportunityLineItemId })
            .then(() => {
                refreshApex(this.wiredOpportunitiesProductsResults);
            })
            .catch(error => {
                console.error('Erreur suppression :', error);
            });
    }
navigateToProduct(IdDuProduit__c) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: IdDuProduit__c,
                objectApiName: 'OpportunityLineItem',
                actionName: 'view'
            }
        });
    }
    }
