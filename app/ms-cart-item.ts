export class MsCartItem {
    constructor(
    public sku: string, // supplier id
    public name: string,
    public price: number,
    public shipCost:number = 0.00,
    public shippedPrice:number = 0.00,
    public BOPIS:boolean=false,
    public currency: string = "EUR",
    public qty: number = 1,
    public outOfStock: boolean = false,
    public description?: string,
    public imgUrl?: string,
    public discount?: number,
    public special?: boolean,
    public shopname?: string, //euronics, yoox, ...
    public crawler?: string, //importio, portia, ...
    public link?: string,
    public category?:string,
    public secondhand:boolean = false, 
    public refresh:number = (new Date()).getTime()
    ) {  
    }
}