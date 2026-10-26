
import { TestBed } from '@angular/core/testing';
import { AddExpense } from './add-expense';

describe.skip('AddExpense', () => {
  let component: AddExpense;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddExpense]
    });

    const fixture = TestBed.createComponent(AddExpense);
    component = fixture.componentInstance;
  });

  // 1. Check component creation
  it.only('should be created', () => {
    expect(component).toBeTruthy();
    console.log('AddExpense Component: Created successfully');
  });

  // 2. Check initial form state
  it('should have an invalid form initially', () => {
    expect(component.expenseForm.invalid).toBe(true);
    console.log('Initial Form Invalid:', component.expenseForm.invalid);
  });

  // 3. Check invalid form submission
  it('should mark all fields as touched when form is invalid', () => {
    component.addExpense();

    expect(component.expenseForm.touched).toBe(true);
    console.log('Invalid Form Submission: Fields marked as touched');
  });

  // 4. Check adding an expense
  it('should emit an expense when the form is valid', () => {
    const expectedExpense = {
      id: null,
      name: 'Lunch',
      amount: 200,
      category: 'Food',
      date: '2026-10-12'
    };

    let emittedExpense: any;

    component.expenseAdded.subscribe(value => {
      emittedExpense = value;
    });

    component.expenseForm.setValue({
      name: 'Lunch',
      amount: 200,
      category: 'Food',
      date: '2026-10-12'
    });

    component.addExpense();

    console.log('Added Expense:', emittedExpense);

    expect(emittedExpense).toEqual(expectedExpense);
  });

  // 5. Check update confirmation
  it('should show update confirmation when editing an expense', () => {
    component.expenseForm.setValue({
      name: 'Lunch',
      amount: 200,
      category: 'Food',
      date: '2026-10-12'
    });

    component.editingId = '1';
    component.addExpense();

    console.log(
      'Update Confirmation:',
      component.showUpdateConfirmation
    );

    expect(component.showUpdateConfirmation).toBe(true);
  });

  // 6. Check cancelling an update
  it('should hide update confirmation when cancelled', () => {
    component.showUpdateConfirmation = true;
    component.cancelUpdate();

    console.log(
      'Confirmation After Cancel:',
      component.showUpdateConfirmation
    );

    expect(component.showUpdateConfirmation).toBe(false);
  });

  // 7. Check confirming an update
  it('should emit the updated expense when confirmed', () => {
    let emittedExpense: any;

    component.expenseAdded.subscribe(value => {
      emittedExpense = value;
    });

    component.expenseForm.setValue({
      name: 'Dinner',
      amount: 350,
      category: 'Food',
      date: '2026-10-12'
    });

    component.editingId = '1';
    component.showUpdateConfirmation = true;

    component.confirmUpdate();

    console.log('Updated Expense:', emittedExpense);

    expect(component.showUpdateConfirmation).toBe(false);

    expect(emittedExpense).toEqual({
      id: '1',
      name: 'Dinner',
      amount: 350,
      category: 'Food',
      date: '2026-10-12'
    });
  });

  // 8. Check loading expense details
  it('should load expense details when editing', () => {
    const expense = {
      id: '5',
      name: 'Bus',
      amount: 50,
      category: 'Travel',
      date: '2026-10-10'
    };

    component.editExpense(expense);

    console.log('Expense Loaded for Editing:', component.expenseForm.getRawValue());

    expect(component.editingId).toBe('5');

    expect(component.expenseForm.getRawValue()).toEqual({
      name: 'Bus',
      amount: 50,
      category: 'Travel',
      date: '2026-10-10'
    });
  });

  // 9. Check clearing the form
  it('should clear the form and reset editing state', () => {
    component.editingId = '5';
    component.showUpdateConfirmation = true;

    component.clearForm();

    console.log('Form After Clearing:', component.expenseForm.getRawValue());
    console.log('Editing ID After Clearing:', component.editingId);
    console.log('Confirmation After Clearing:', component.showUpdateConfirmation);

    expect(component.expenseForm.getRawValue()).toEqual({
      name: '',
      amount: 0,
      category: '',
      date: ''
    });

    expect(component.editingId).toBe(null);
    expect(component.showUpdateConfirmation).toBe(false);
  });

  // 10. Check amount validation
  it.skip('should reject an amount less than 1', () => {
    component.expenseForm.setValue({
      name: 'Lunch',
      amount: 0,
      category: 'Food',
      date: '2026-10-12'
    });

    const amountControl = component.expenseForm.get('amount');

    console.log('Amount:', amountControl?.value);
    console.log('Amount Is Invalid:', amountControl?.invalid);

    expect(amountControl?.invalid).toBe(true);
  });
});
