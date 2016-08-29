export class MsCartItem {
    constructor(
    public id: number,
    public name: string,
    public price: number,
    public qty: number = 1,
    public outOfStock: boolean = false,
    public description?: string,
    public imgUrl?: string,
    public discount?: number,
    public special?: boolean,
    public origin?: string,
    public link?: string
    ) {  
    }
}