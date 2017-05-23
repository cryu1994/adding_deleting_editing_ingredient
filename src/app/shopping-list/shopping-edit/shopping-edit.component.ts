import {
  Component, OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { NgForm } from '@angular/forms';

// dont forget to import the subcrition
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm; // used the viewchid to get access to the form. and we already have the access to form as f
  subscription: Subscription;  // i need to store this subscription to the Subscriptioin incase we need to distroy the component.
  editMode = false; // setting the edit mode as false;
  edittedItemindex: number;
  editedItem: Ingredient; // with the returning item from the service, assign that value to new key.

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    // i am already injecting the slService here and subscribing the startedediting subjects.
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        // this function will only triger when we click this unanimous function
        this.editMode = true;  // and now i am setting it as true because i am edting
        this.edittedItemindex = index;
        this.editedItem = this.slService.getIngredient(index); // whenever we get the new item, go to services and then return agian
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount

        });
      }
    );
  }

  onSubmit(form: NgForm ) { // getting NgForm from the html and set it as form
    const value  = form.value; // getting the value of the form from the value property
    const newIngredient = new Ingredient(value.name, value.amount); // creating ingredients with add method

    // checking to see if the user's adding or updating
    if (this.editMode) {
      this.slService.updateIngredient(this.edittedItemindex, newIngredient);
      // if edit mode, then reach out to service and call the update method
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.edittedItemindex);
    this.onClear();

  }
  // and here is the deleting component methods
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
