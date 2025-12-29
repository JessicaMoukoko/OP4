import { LightningElement } from 'lwc';
import OpportunityProductController from '@salesforce/apex/OpportuniutyProductController.getOpportunityProducts';

export default class OpportunitiesProductViewer extends LightningElement {}

    
columns = [
        { label: 'Nom du Produit', fieldName: 'Product2.Name', type: 'text' },
        { label: 'Prix Unitaire', fieldName: 'UnitPrice', type: 'Number' },
        { label: 'Prix Total', fieldName: 'TotalPrice', type: 'Number' },
        { label: 'Quantité', fieldName: 'Quantity', type: 'Number' },
        { label: 'Quantité en Stock', fieldName: 'QuantityInStock__c', type: 'Number' }
    ];


        
    