public with sharing class OpportunityStockCheckInvocable {

    @InvocableMethod(
        label='Publish Opportunity Error Toast'
        description='Publish Platform Event to display toast'
    )
    public static void publishErrorToast(List<ToastInput> inputs) {

        List<OpportunityErrorEvent__e> events = new List<OpportunityErrorEvent__e>();

        for (ToastInput input : inputs) {
            events.add(new OpportunityErrorEvent__e(
                OpportunityId__c = input.opportunityId,
                Message__c = input.message
            ));
        }

        if (!events.isEmpty()) {
            EventBus.publish(events);
        }
    }

    public class ToastInput {
        @InvocableVariable(required=true)
        public Id opportunityId;

        @InvocableVariable(required=true)
        public String message;
    }
}
