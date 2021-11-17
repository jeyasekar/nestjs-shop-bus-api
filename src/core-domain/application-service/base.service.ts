export interface IBaseService<TInput, TResult> {
    handle(data?: TInput, param?: any):
        Promise<TResult> | Promise<TResult[]>;
}