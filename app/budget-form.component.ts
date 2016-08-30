import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NgForm }    from '@angular/forms';

import { MsBudget }    from './ms-budget';

@Component({
  selector: 'budget-form',
  templateUrl: 'app/budget-form.component.html'
})

export class BudgetFormComponent implements OnChanges{
  @Input() itemId: number;
  @Output() notify = new EventEmitter<MsBudget>();
  
  ngOnChanges(changes: SimpleChanges) {
    console.log('form>itemId: ', changes['itemId'].currentValue);
    //this.setModel(changes['itemId'].currentValue);
    this.concatOption(changes, 'avoid'); // TODO: loop on options 
  }

  concatOption(changes: SimpleChanges, option: string){
    if ( changes[option])
        this.model[option] = this.model[option] + changes[option].currentValue + ':';
  }

  model:MsBudget;


  ngOnInit(){
    console.log('form>itemId:', this.itemId);
    this.model = new MsBudget(0);
  }

  currencies = ["EUR", "USD"];

  submitted = false;

  onSubmit() { 
    console.log('onSubmit:',this.submitted);
    //this.cartSvc.startSearch(this.model);
    this.notify.emit(this.model);
    this.submitted = true; 
  }
  onEdit() { this.submitted = false; }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  // TODO: Workaround until NgForm has a reset method (#6822)
  active = true;

  newBudget() {
    this.model = new MsBudget(0);
    this.active = false;
    setTimeout(() => this.active = true, 0);
  }
  
  // Reveal in html:
  //   Name via form.controls = {{showFormControls(heroForm)}}
  showFormControls(form: NgForm) {

    //return form && form.controls['name'] &&
    //form.controls['name'].value; 
    return "todo";
  }

}