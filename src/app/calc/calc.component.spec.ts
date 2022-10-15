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
    it('container Element should not have class light-theme by default', () => {
      const containerEl: HTMLElement = fixture.debugElement.query(
        By.css('.container')
      ).nativeElement;

      spyOn(window, 'matchMedia').and.returnValue({
        matches: true,
      } as any);

      expect(containerEl.classList.contains('light-theme'))
        .withContext('matches OS theme')
        .toBeFalse();
    });

    it('container Element should not have class light-theme by default', () => {
      const containerEl: HTMLElement = fixture.debugElement.query(
        By.css('.container')
      ).nativeElement;

      spyOn(window, 'matchMedia').and.returnValue({
        matches: false,
      } as any);

      expect(containerEl.classList.contains('light-theme'))
        .withContext('not matches OS theme')
        .toBeFalse();
    });

    it('container Element should have class light-theme', () => {
      component.theme = 'light';
      const containerEl: HTMLElement = fixture.debugElement.query(
        By.css('.container')
      ).nativeElement;

      spyOn(window, 'matchMedia').and.returnValue({
        matches: true,
      } as any);

      component.ngAfterViewInit();

      expect(containerEl.classList.contains('light-theme'))
        .withContext('theme is light and OS theme is dark')
        .toBeTrue();
    });

    it('container Element should have class light-theme', () => {
      component.theme = 'light';
      const containerEl: HTMLElement = fixture.debugElement.query(
        By.css('.container')
      ).nativeElement;

      spyOn(window, 'matchMedia').and.returnValue({
        matches: false,
      } as any);

      component.ngAfterViewInit();

      expect(containerEl.classList.contains('light-theme'))
        .withContext('theme is light and OS theme is light')
        .toBeFalse();
    });

    it('container Element should have class light-theme', () => {
      component.theme = 'dark';
      const containerEl: HTMLElement = fixture.debugElement.query(
        By.css('.container')
      ).nativeElement;

      spyOn(window, 'matchMedia').and.returnValue({
        matches: true,
      } as any);

      component.ngAfterViewInit();

      expect(containerEl.classList.contains('light-theme'))
        .withContext('theme is dark and OS theme is light')
        .toBeTrue();
    });

    it('container Element should have class light-theme', () => {
      component.theme = 'dark';
      const containerEl: HTMLElement = fixture.debugElement.query(
        By.css('.container')
      ).nativeElement;

      spyOn(window, 'matchMedia').and.returnValue({
        matches: false,
      } as any);

      component.ngAfterViewInit();

      expect(containerEl.classList.contains('light-theme'))
        .withContext('theme is dark and OS theme is dark')
        .toBeFalse();
    });
  });

  describe('getter value()', () => {
    it('should call autoShrink() if inputEl is true', () => {
      component.inputEl = fixture.debugElement.query(By.css('.input-field'));
      const autoShrink: jasmine.Spy = spyOn(component, 'autoShrinkFont');

      component.value;

      expect(autoShrink).toHaveBeenCalled();
    });

    it('should call autoShrink() if inputEl is true', () => {
      const autoShrink: jasmine.Spy = spyOn(component, 'autoShrinkFont');
      component.inputEl = null!;

      component.value;

      expect(autoShrink).not.toHaveBeenCalled();
    });

    it('should call format()', () => {
      const format: jasmine.Spy = spyOn(component, 'format');

      component.value;

      expect(format).toHaveBeenCalled();
    });
  });

  describe('setter value()', () => {
    it('should concatenate by default', () => {
      const value: string = '555';
      const input: string = '4';

      component._value = value;
      component.isSolved = false;
      component.isSolved = false;
      component.value = input;
      const result: string = component.format(value + input);

      expect(component.value).toBe(result);
    });

    it('should concatenate by default', () => {
      const value: string = '555.';
      const input: string = '4';

      component._value = value;
      component.isSolved = false;
      component.isSolved = false;
      component.value = input;
      const result: string = component.format(value + input);

      expect(component.value).withContext('includes.').toBe(result);
    });

    it('should change value to new input if', () => {
      component._value = '55';
      component.isSolved = true;
      component.isSolving = false;
      component.value = '7';
      expect(component.value).withContext('isSolved is true').toBe('7');

      component.isSolved = false;
      component.isSolving = true;
      component.value = '7';
      expect(component.value).withContext('isSolving is true').toBe('7');

      component._value = '0';
      component.isSolved = false;
      component.isSolving = false;
      component.value = '7';
      expect(component.value).withContext('isSolving is true').toBe('7');
    });

    it('should change concatenate value with . only if 0', () => {
      const value: string = '0';
      const input: string = '.';
      const result: string = component.format(value + input);

      component._value = value;
      component.isSolved = false;
      component.isSolving = false;
      component.value = input;

      expect(component.value).toBe(result);
    });

    it('should change value to 0 if input is . and value is ""', () => {
      component.value = '';
      component.value = '.';

      expect(component.value).toBe('0.');
    });

    it('should change value to 0 if input is . and value is ""', () => {
      const value: string = '';
      const input: string = '.';

      component.value = value;
      component.value = input;

      expect(component.value).toBe('0' + input);
    });

    it('should remain constant if length is upto 9', () => {
      const value: string = '123456789';
      const input: string = '6';
      const result: string = component.format(value);

      component.value = value;
      component.value = input;

      expect(component.value).toBe(result);
    });

    it('should call validateFullstop()', () => {
      const validationFn: jasmine.Spy = spyOn(component, 'validateFullStop');

      component.value = '.';

      expect(validationFn).toHaveBeenCalled();
    });
  });
});
