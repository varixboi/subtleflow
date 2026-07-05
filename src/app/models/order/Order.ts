import { OrderStatus } from "./OrderStatus";

export interface Order{
    id: string,

    customerName: string,
    phoneNo: string,

    productId: string,
    color: string,
    designName: string,
    sizeQty: Record<string, number>,

    status: OrderStatus;
}