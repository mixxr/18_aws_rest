

export class MsBudget {
    constructor(
    public value: number,
    public currency: string = 'EUR',
    public strict: boolean = false,
    public categories: string[] = [],
    public similar:  { [id: string] : boolean; } = {},
    public aroundMe: boolean = false,
    public maxItems:number = 10,
    public currentValue: number = 0,
    public cart?: { [id: string] : number; }, //code:qty
    public position?: string, //geo
    public zip?: string,
    public pin: { [id: string] : boolean; }={}, //do not send to server! only x presentation scope
    public forceDel:boolean = true // //do not send to server! only x presentation scope
    ) {  
        
    }

}