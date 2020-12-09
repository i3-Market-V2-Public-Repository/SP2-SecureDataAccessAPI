import { Entity, model, property } from "@loopback/repository";

@model()
export class DataRequest extends Entity{

    @property({name: 'provider_id', description: 'Uniquely identifies the provider.'}) provider_id: string
    @property({name: 'data_id', description: 'Identifies the exact data the consumer wants to receive.'}) data_id: string
    @property({name: 'data_format', description: 'Data format preffered by the consumer: CSV, XML, JSON.'}) data_format: string
    @property({name: 'start_offset', description: 'Start offset when transferring data.'}) start_offset: string
    @property({name: 'end_offset', description: 'End offset for transferring data.'}) end_offset: string

}
@model()
export class StatusRequest extends Entity{
    @property({name: 'transfer_id', description: 'Uniquely identifies the transfer.'}) transfer_id: string
}
@model()
export class TrackingRequest extends Entity{
    @property({name: 'transfer_id', description: 'Uniquely identifies the transfer.'}) transfer_id: string
}
@model()
export class ReportRequest extends Entity{
    @property({name: 'transfer_id', description: 'Uniquely identifies the transfer.'}) transfer_id: string
}