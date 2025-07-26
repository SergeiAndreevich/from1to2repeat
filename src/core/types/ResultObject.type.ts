export interface IResult<T=null>{
    data: T,
    status: ResultStatuses,
    errorMessage?: string;

}
export enum ResultStatuses {
    error='error',
    success='success',
    notFound='notFound',
    unauthorized='unauthorized',
}