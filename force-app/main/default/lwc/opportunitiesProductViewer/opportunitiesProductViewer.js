import { LightningElement, api, wire  } from 'lwc';  
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';
import deleteOpportunityProduct from '@salesforce/apex/OpportunityProductController.deleteOpportunityProduct';
import isAdminUser from '@salesforce/apex/ProfileController.isAdminUser';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import Delete from '@salesforce/label/c.Delete';
import ViewProduct from '@salesforce/label/c.ViewProduct';
import HasNoProducts from '@salesforce/label/c.HasNoProducts';
import OpportunityProducts from '@salesforce/label/c.OpportunityProducts';
import OrangeMessageError from '@salesforce/label/c.OrangeMessageError';
import productName from '@salesforce/label/c.productName';
import UnitPrice from '@salesforce/label/c.UnitPrice';
import ProductQuantity from '@salesforce/label/c.ProductQuantity';
import totalPrice from '@salesforce/label/c.totalPrice';
import quantityInStock from '@salesforce/label/c.quantityInStock';
import viewProductButton from '@salesforce/label/c.viewProductButton';
import USER_ID from '@salesforce/user/Id';


export default class OpportunitiesProductViewer extends  NavigationMixin(LightningElement)  {

 // Récupération de l'ID utilisateur courant
 
userId; 
connectedCallback() {
    this.userId = USER_ID;
}

@api recordId;
isAdmin = false;
isCommercial = false;
opportunitiesProduct;
error;
wiredOpportunitiesProductsResults;
wiredProfileResults;
MessageOrange = OrangeMessageError ;
PasdeProduit = HasNoProducts ;
titlecard = OpportunityProducts;

              // colonnes pour le profil Commercial

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

             // colonnes pour le profil Administrateur

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

           // Récupération des produits liés à l'opportunité

   @wire(getOpportunityProducts, { opportunityId: '$recordId' })
wiredOpportunities(result) {
    
    // on stocke le résultat du wire pour le rafraîchir plus tard
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

      // Vérification du profil utilisateur grace à la méthode Apex

@wire(isAdminUser, { userId: '$userId' })
    wiredProfileResults({ data }) {
        this.isAdmin = data === true;
        this.isCommercial = data !== true;
    }
     // propriétés calculées pour déterminer l'affichage des tableaux

 get hasNoProducts() {
    return this.opportunitiesProduct && this.opportunitiesProduct.length === 0;
}

   // propriété calculée pour afficher le tableau Commercial 

 get isCommercialTable() {
    return this.isCommercial && !this.hasNoProducts;
}
    // propriété calculée pour afficher le tableau Administrateur
 get isAdminTable() {
    return this.isAdmin && !this.hasNoProducts;
}

   // gestion des actions sur les lignes du tableau

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
  // suppression d'un produit de l'opportunité 

 handleDelete(opportunityLineItemId) {
        deleteOpportunityProduct({ opportunityLineItemId: opportunityLineItemId })
            .then(() => {
                refreshApex(this.wiredOpportunitiesProductsResults);
            })
            .catch(error => {
                console.error('Erreur suppression :', error);
            });
    }
    // navigation vers la page du produit lié au produit de l'opportunité

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