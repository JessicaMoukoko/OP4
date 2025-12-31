import { LightningElement, api, wire  } from 'lwc';  
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';

export default class OpportunitiesProductViewer extends LightningElement {

@api recordId;
isAdmin = true;
isCommercial = false;
opportunities;
error;
wiredOpportunitiesProductsResults;  

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

get hasNoProducts() {
    return this.opportunities && this.opportunities.length === 0;
}
}