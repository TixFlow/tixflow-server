export class ItemResponseData<T>{
    data: T;
    message: string;
}

export class ListResponseData<T>{
    page: number;
    size: number;
    total: number;
    totalPage: number;
    data: T[];
    message: string;
}