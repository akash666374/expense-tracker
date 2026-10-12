import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {

  let component: Dashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([])]
    });

    component = TestBed.createComponent(Dashboard).componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});