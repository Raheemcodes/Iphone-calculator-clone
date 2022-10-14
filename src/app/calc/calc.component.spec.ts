import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CalcComponent } from './calc.component';

describe('CalcComponent', () => {
  let component: CalcComponent;
  let fixture: ComponentFixture<CalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalcComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit()', () => {
    it('container Element should not have class light-theme', () => {
      const prefersDarkScheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      );
      const containerEl: HTMLElement = fixture.debugElement.query(
        By.css('.container')
      ).nativeElement;

      if (prefersDarkScheme.matches) {
        expect(containerEl.classList.contains('light-theme'))
          .withContext('dark mode')
          .toBeFalse();
      } else {
        expect(containerEl.classList.contains('light-theme'))
          .withContext('light mode')
          .toBeFalse();
      }
    });

    // it('container Element should have class light-theme', () => {});
  });
});
