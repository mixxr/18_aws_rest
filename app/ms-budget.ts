export class MsBudget {
    constructor(
    public value: number,
    public currency: string = 'EUR',
    public strict: boolean = false,
    public categories: string = '',
    public consider: string = ';',
    public similar: string = ';',
    public aroundMe: boolean = false,
    public position?: string,
    public zip?: string
    ) {  }
}