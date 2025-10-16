export interface IResult<T=null>{
    data: T,
    status: ResultStatuses,
    errorMessage?: object;

}
export enum ResultStatuses {
    error='error',
    success='success',
    notFound='notFound',
    unauthorized='unauthorized',
    alreadyExist = 'alreadyExist',
    forbidden='forbidden'
}