export interface Coupon{
    id: number,
    code: string,
    discountPercentage: number,
    expirationDate: Date,
    isGlobal: boolean,
    tourId: number
}