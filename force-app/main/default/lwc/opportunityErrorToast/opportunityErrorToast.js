import { LightningElement } from 'lwc';
import { subscribe, onError } from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OpportunityErrorToast extends LightningElement {
    
    channelName = '/event/OpportunityErrorEvent__e';
    subscription = {};

    connectedCallback() {
        this.registerErrorListener();
        this.handleSubscribe();
    }

    handleSubscribe() {
        const messageCallback = (response) => {
            const message = response.data.payload.Message__c;
            this.showToast(message);
        };

        subscribe(this.channelName, -1, messageCallback).then(response => {
            this.subscription = response;
        });
    }

    registerErrorListener() {
        onError(error => {
            console.error('EMP API error:', error);
        });
    }

    showToast(message) {
        const evt = new ShowToastEvent({
       //     title: 'Erreur Opportunité',
            message: message,
            variant: 'error',
            mode: 'sticky'
        });
        this.dispatchEvent(evt);
    }
}
