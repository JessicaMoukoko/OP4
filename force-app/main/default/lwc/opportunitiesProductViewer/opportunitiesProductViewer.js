import { LightningElement, api, wire  } from 'lwc';  
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';
import isAdminUser from '@salesforce/apex/ProfileController.isAdminUser';
export default class OpportunitiesProductViewer extends LightningElement {

@api recordId;
isAdmin = false;
isCommercial = false;
opportunities;
error;
wiredOpportunitiesProductsResults;
wiredProfileResults;  

columns = [
       { label: 'Nom du Produit', fieldName: 'ProductName__c', type: 'text' },
        { label: 'Prix Unitaire', fieldName: 'UnitPrice', type: 'number' },
        { label: 'Prix Total', fieldName: 'TotalPrice', type: 'number' },
        { label: 'Quantité', fieldName: 'Quantity', type: 'number' },
      { label: 'Quantité en Stock', fieldName: 'Quantity_In_Stock__c', type: 'number' }
    ];


    @wire(getOpportunityProducts, { opportunityId: '$recordId' })
wiredOpportunities(result) {
    this.wiredOpportunitiesProductsResults = result;

    if (result.data) {
        this.opportunities = result.data;
        this.error = undefined; 
    } else if (result.error) {
        this.error = result.error;
        this.opportunities = undefined;
    }
}

 @wire(isAdminUser,{})
wiredProfileResults(result2) {
    this.wiredProfileResults = result2;

    if (result2.data) {
        this.isAdmin = true;
        this.isCommercial = undefined;
        this.error = undefined;
    } else {
        this.isCommercial = true;
        this.isAdmin = undefined;
        this.error = undefined;
    }
}

get hasNoProducts() {
    return this.opportunities && this.opportunities.length === 0;
}
}