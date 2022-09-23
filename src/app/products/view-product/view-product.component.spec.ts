import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductsService } from '../products.service';
import { HttpClientModule } from '@angular/common/http';

import { ViewProductComponent } from './view-product.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


// describe => global Jasmine function
fdescribe('ViewProductComponent', () => {

  // Arrange
  let component: ViewProductComponent;
  let fixture: ComponentFixture<ViewProductComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      {
        declarations: [ViewProductComponent],
        imports: [RouterTestingModule, HttpClientModule],
        providers: [ProductsService],
      }
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

// testing element in HTML
  it('should h3', () => {
    expect(de?.query(By.css('h3')).nativeElement.innerText);
  });

  // testing element in HTML
  it('should have <p> with "banner works!"', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const p = bannerElement.querySelector('p')!;
    expect(p.textContent).toString();
  });
});
