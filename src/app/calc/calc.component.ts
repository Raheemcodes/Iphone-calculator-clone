import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CalcComponent implements OnInit, AfterViewInit {
  @ViewChild('input') inputEl!: ElementRef<HTMLElement>;
  @ViewChild('container') container!: ElementRef<HTMLElement>;
  @Input('theme') theme!: 'dark' | 'light';

  highlightedBtn: HTMLButtonElement | null = null;
  isSolving: boolean = false;
  isSolved: boolean = true;
  problem: string = '';
  _value: string = '0';
  answer: string = '';
  operand: string = '';
  highlightEL: string = '';

  isDragging: boolean = false;
  startPosX: number = 0;
  startPosY: number = 0;
  translate: number = 0;
  threshold: number = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersLightScheme = window.matchMedia(
      '(prefers-color-scheme: light)'
    );

    const containerEL: HTMLElement = this.container.nativeElement;

    if (this.theme == 'light' && prefersDarkScheme.matches) {
      containerEL.classList.add('light-theme');
    }
    if (this.theme == 'dark' && prefersLightScheme.matches) {
      containerEL.classList.add('light-theme');
    }
  }

  get value(): string {
    if (this.inputEl) this.autoShrinkFont();

    return this.format(this._value);
  }

  set value(input: string) {
    if (this.isSolved || this.isSolving || (this._value == '0' && input != '.'))
      this._value = '';

    if (input == '.' && this._value == '') this.value = '0';

    const length: number =
      this._value[0] == '-' ? this._value.length - 1 : this._value.length;

    if (length >= 9) return;
    if (input == '.' && this.validateFullStop()) return;

    this._value += input;

    this.isSolving = false;
    this.isSolved = false;
  }

  format(input: string): string {
    input = this.roundupExp(input).replace('+', '');
    let output: string = this.handleCommas(input);

    if (input.includes('.')) output = this.noCommas(input, '.');
    if (input.includes('e') && !input.includes('.'))
      output = this.noCommas(input, 'e');

    return output;
  }

  noCommas(input: string, exception: string): string {
    const [preSymbol, exSymbol] = input.split(exception);
    input = this.handleCommas(preSymbol);

    return [input, exSymbol].join(exception);
  }

  handleCommas(input: string): string {
    const regex = new RegExp(/\B(?=(\d{3})+(?!\d))/g);

    return input.replace(regex, ',');
  }

  arithmetic(input: '+' | '-' | '*' | '/') {
    if (this.isSolving) {
      this.operand = input;
      return;
    }

    if (!this.isSolved) {
      this.answer = this.operation().toString();
      this._value = this.answer;
    }

    this.isSolving = true;
    this.isSolved = false;
    this.operand = input;
    this.problem = this._value;
  }

  special(input: '%' | '+/-') {
    if (input == '+/-') this._value = (-+this._value).toString();
    else if (input == '%') this._value = (+this._value / 100).toString();
  }

  equate() {
    this.answer = this.operation().toString();
    this._value = this.answer;
    this.reset();
    this.isSolved = true;
  }

  operation(): number {
    if (this.operand == '+') return +this.problem + +this._value;
    else if (this.operand == '-') return +this.problem - +this._value;
    else if (this.operand == '*') return +this.problem * +this._value;
    else if (this.operand == '/') return +this.problem / +this._value;
    else return +this._value;
  }

  clear() {
    this._value = '0';

    if (!this.isSolving) {
      this.reHighLight();
      this.isSolving = true;
    } else this.reset();
  }

  reset() {
    this.problem = '';
    this.operand = '';
    this.isSolving = false;
    this.isSolved = true;
    this.highlightedBtn = null;
  }

  roundUp(input: number, support: number = 0): number {
    const strInput: string = input.toString().split('.')[0];
    const length: number = strInput.length > 9 ? 9 : strInput.length;
    const toX: number = Math.pow(10, 9 - length - support);

    return Math.round(input * toX) / toX;
  }

  roundupExp(input: string): string {
    if (+input > 999999999 || +input < -999999999) {
      input = (+input).toExponential();
    }

    const [BEFORE_E, AFTER_E]: string[] = input.split('e');
    const inputArrPoint: string[] = input.split('.');

    if (input.includes('e')) {
      input = this.roundUp(+BEFORE_E, AFTER_E.length).toString();

      return [input, AFTER_E].join('e');
    } else if (inputArrPoint[1] != '' && input.length > 9) {
      return this.roundUp(+input).toString();
    } else return input;
  }

  validateFullStop(): boolean {
    return this._value.includes('.');
  }

  autoShrinkFont() {
    let input: HTMLElement = this.inputEl.nativeElement;
    let max = 1;

    if (input.scrollWidth == input.clientWidth) {
      input.style.fontSize = '1em';
    }

    while (input.scrollWidth > input.clientWidth) {
      input.style.fontSize = `${max}em`;
      input = this.inputEl.nativeElement;

      max -= 0.01;
    }
  }

  backspace() {
    if (!this.isSolved && !this.isSolving) {
      if (
        (this._value[0] == '-' && this._value.length == 2) ||
        this._value.length <= 1
      ) {
        this._value = '0';
      } else this._value = this._value.slice(0, -1);
    }
  }

  highlight(event: Event | { currentTarget: HTMLElement }) {
    const specialBtns: NodeListOf<HTMLElement> =
      this.el.nativeElement.shadowRoot!.querySelectorAll('button');
    const curBtn: HTMLButtonElement = event.currentTarget as HTMLButtonElement;

    specialBtns.forEach((el) => {
      if (el.classList.contains('highlighted')) {
        el.classList.remove('highlighted');
      }
    });

    if (
      curBtn.classList.contains('arithmetic-btn') &&
      !curBtn.classList.contains('equal')
    ) {
      this.highlightedBtn = curBtn;
      curBtn.classList.add('highlighted');
    }

    if (curBtn.classList.contains('equal')) this.highlightedBtn = null;
  }

  reHighLight() {
    if (this.highlightedBtn)
      this.highlight({ currentTarget: this.highlightedBtn });
  }

  getPositionX(event: MouseEvent | TouchEvent): number {
    return event.type.includes('mouse')
      ? (event as MouseEvent).pageX
      : (event as TouchEvent).touches[0].clientX;
  }

  getPositionY(event: MouseEvent | TouchEvent): number {
    return event.type.includes('mouse')
      ? (event as MouseEvent).pageY
      : (event as TouchEvent).touches[0].clientY;
  }

  onTouchStart(event: MouseEvent | TouchEvent) {
    const slide: HTMLElement = event.currentTarget as HTMLElement;
    this.startPosX = this.getPositionX(event);
    this.startPosY = this.getPositionY(event);
    this.isDragging = true;
    this.threshold = slide.clientWidth / 5;
  }

  onTouchMove(event: MouseEvent | TouchEvent) {
    if (this.isDragging) {
      const currentTranslateX = this.getPositionX(event) - this.startPosX;
      const currentTranslateY = this.getPositionY(event) - this.startPosY;

      if (Math.abs(currentTranslateY) < Math.abs(currentTranslateX)) {
        if (event.cancelable) event.preventDefault();
        this.translate = currentTranslateX;
      }
    }
  }

  onTouchEnd() {
    this.isDragging = false;
    const movedBy = Math.abs(this.translate);

    if (movedBy > this.threshold) this.backspace();
  }
}
