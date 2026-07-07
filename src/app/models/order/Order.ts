import { OrderStatus } from "./OrderStatus";

export interface Order{
    id: string,

    customerName: string,
    phoneNo: string,

    productId: string,
    color: string,
    designId: string,
    sizeQty: Record<string, number>,

    status: OrderStatus
}