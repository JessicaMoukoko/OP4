import { LightningElement, api, wire  } from 'lwc';  
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';
import deleteOpportunityProduct from '@salesforce/apex/OpportunityProductController.deleteOpportunityProduct';
import isAdminUser from '@salesforce/apex/ProfileController.isAdminUser';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import Delete from '@salesforce/label/c.Delete';
import ViewProduct from '@salesforce/label/c.ViewProduct';
import ErrorMessageFlow from '@salesforce/label/c.ErrorMessageFlow';
import HasNoProducts from '@salesforce/label/c.HasNoProducts';
import OpportunityProducts from '@salesforce/label/c.OpportunityProducts';
import OrangeMessageError from '@salesforce/label/c.OrangeMessageError';
import productName from '@salesforce/label/c.productName';
import UnitPrice from '@salesforce/label/c.UnitPrice';
import ProductQuantity from '@salesforce/label/c.ProductQuantity';
import totalPrice from '@salesforce/label/c.totalPrice';
import quantityInStock from '@salesforce/label/c.quantityInStock';
import viewProductButton from '@salesforce/label/c.viewProductButton';


export default class OpportunitiesProductViewer extends  NavigationMixin(LightningElement)  {


@api recordId;
isAdmin = false;
opportunitiesProduct;
error;
wiredOpportunitiesProductsResults;
wiredProfileResults;
MessageOrange = OrangeMessageError ;
PasdeProduit = HasNoProducts ;
titlecard = OpportunityProducts;

columnsCommercial = [
       { label: productName, fieldName: 'ProductName__c', type: 'text' },
        { label: UnitPrice, fieldName: 'UnitPrice', type: 'number' },
        { label: totalPrice, fieldName: 'TotalPrice', type: 'number' },
        { label: ProductQuantity, fieldName: 'Quantity', type: 'number',
            cellAttributes: { 
                class: { fieldName: 'quantityClass' }
            }
         },
      { label: quantityInStock, fieldName: 'Quantity_In_Stock__c', type: 'number' },
      {
        label: Delete,
        type: 'button-icon',
        initialWidth: 90,
        typeAttributes: {
            iconName: 'utility:delete',
            name: 'delete',
            title: 'Supprimer',
            variant: 'border-filled',
            alternativeText: 'Supprimer'
        } }];

    columnsAdministrateur = [ { label: productName, fieldName: 'ProductName__c', type: 'text' },
        { label: UnitPrice, fieldName: 'UnitPrice', type: 'number' },
        { label: totalPrice, fieldName: 'TotalPrice', type: 'number' },
        { label: ProductQuantity, fieldName: 'Quantity', type: 'number',
            cellAttributes: { 
                class: { fieldName: 'quantityClass' }
            }
         },
      { label: quantityInStock, fieldName: 'Quantity_In_Stock__c', type: 'number' },
      {
        label: Delete,
        type: 'button-icon',
        initialWidth: 90,
        typeAttributes: {
            iconName: 'utility:delete',
            name: 'delete',
            title: 'Supprimer',
            variant: 'border-filled',
            alternativeText: 'Supprimer'
        } },
    { label: ViewProduct,
         type: 'button', 
            initialWidth: 160,
         typeAttributes: { 
            label: viewProductButton,
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

        let quantityProblem = false;
        // on créé une nouvelle version de chaque ligne avec la classe CSS appropriée
        this.opportunitiesProduct = result.data.map(row => {
            const hasProblem = row.Quantity > row.Quantity_In_Stock__c;

            if (hasProblem) {
                quantityProblem = true;
            }
            // on retourne une nouvelle version de la ligne avec la classe CSS
            return {
                ...row,quantityClass: hasProblem ? 'slds-theme_error slds-text-title_bold' : ''
            };
        });

        this.quantityProblem = quantityProblem;
        this.error = undefined;

    } else if (result.error) {
        this.error = result.error;
        this.opportunitiesProduct = undefined;
    }
}


 @wire(isAdminUser)
    wiredProfileResults({ data }) {
        this.isAdmin = data === true;
    }

get hasNoProducts() {
    return this.opportunitiesProduct && this.opportunitiesProduct.length === 0;
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
