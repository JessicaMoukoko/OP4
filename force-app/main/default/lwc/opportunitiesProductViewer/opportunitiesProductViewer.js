import { LightningElement, api, wire  } from 'lwc';  
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';
import getUserProfileName from '@salesforce/apex/ProfileIdentifier.getUserProfileName';

export default class OpportunitiesProductViewer extends LightningElement {

@api recordId;
isAdmin = false;
isCommercial = false;
opportunities;
error;
profileError;
wiredOpportunitiesProductsResults;  

columns = [
        { label: 'Nom du Produit', fieldName: 'Product2.Name', type: 'text' },
        { label: 'Prix Unitaire', fieldName: 'UnitPrice', type: 'number' },
        { label: 'Prix Total', fieldName: 'TotalPrice', type: 'number' },
        { label: 'Quantité', fieldName: 'Quantity', type: 'number' },
        { label: 'Quantité en Stock', fieldName: 'Product2.QuantityInStock__c', type: 'number' }
    ];


    @wire(getOpportunityProducts,{ OpportunityId: '$recordId' })
    wiredOpportunities(result) {
        this.wiredOpportunitiesProductsResults = result;
        if (result.data) {
            this.opportunities = result.data;
        } else if (result.error) {
            this.error = result.error;
        }
    }

    @wire(getUserProfileName)
wiredProfile({ data, profileError }) {
    if (data) {
        this.isAdmin = data === 'System Administrator';
        this.isCommercial = data === 'Custom: Sales Profile';
    } else if (profileError) {
        this.profileError = profileError;
    }
}
}