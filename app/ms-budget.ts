export class MsBudget {
    constructor(
    public value: number,
    public currency: string = 'EUR',
    public strict: boolean = false,
    public categories: string = '',
    public similar: string = ';',
    public aroundMe: boolean = false,
    public cart?: { [id: string] : number; }, //code:qty
    public position?: string,
    public zip?: string
    ) {  }
}