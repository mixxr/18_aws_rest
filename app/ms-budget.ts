export class MsBudget {
    constructor(
    public value: number,
    public currency: string = 'EUR',
    public strict: boolean = false,
    public categories: string = '',
    public saved: string = '',
    public removed: string = '',
    public similar: string = '',
    public avoid: string = '',
    public aroundMe: boolean = false,
    public position?: string,
    public zip?: string
    ) {  }
}