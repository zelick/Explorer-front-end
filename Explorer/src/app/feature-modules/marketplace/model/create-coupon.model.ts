export interface CreateCoupon{
    discountPercentage: number,
    expirationDate: Date,
    isGlobal: boolean,
    tourId: number | null
}