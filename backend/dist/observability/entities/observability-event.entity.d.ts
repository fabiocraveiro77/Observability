export declare class ObservabilityEvent {
    id: string;
    timestamp: Date;
    app_name: string;
    execution_id: string;
    transaction_id: string;
    trace_id: string;
    partner_name: string;
    step_current: number;
    step_total: number;
    action_code: string;
    status: string;
    payload_data: any;
    payload_type: any;
    request_data: any;
    response_data: any;
    error_stacktrace: string;
    internal_reference: string;
    external_reference: string;
}
