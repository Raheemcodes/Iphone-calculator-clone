import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement, NgElementConstructor } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { CalcComponent } from './calc/calc.component';

@NgModule({
  declarations: [CalcComponent],
  imports: [BrowserModule],
  providers: [{ provide: Window, useValue: window }],
  entryComponents: [CalcComponent],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const calcElement: NgElementConstructor<CalcComponent> =
      createCustomElement(CalcComponent, { injector: this.injector });

    customElements.define('i-calc', calcElement);
  }
}
