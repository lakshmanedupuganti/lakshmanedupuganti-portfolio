import { ChangeEvent } from 'react';

class Masking {
  maskedNumber: string;
  maskedLetter: string;
  maskedInputs?: NodeListOf<Element>;

  constructor() {
    this.maskedNumber = 'XdDmMyY9';
    this.maskedLetter = '_';
  }

  init(maskedNumber: string) {
    this.maskedNumber = maskedNumber ?? this.maskedNumber;
    const maskedInputs: NodeListOf<Element> = document.querySelectorAll('.masked');

    this.setUpMasks(maskedInputs);
    this.maskedInputs = maskedInputs;
    this.activateMasking(maskedInputs);
  }

  setUpMasks(inputs: NodeListOf<Element>) {
    const length: number = inputs.length;

    for (let i = 0; i < length; i++) {
      if (inputs[i].getAttribute('form-placeholder') != null) {
        this.createShell(inputs[i]);
      }
    }
  }

  createShell(input: Element) {
    let text = '';
    const placeholder: string = input.getAttribute('form-placeholder') ?? '';

    input.setAttribute('maxlength', placeholder.length.toString());
    input.setAttribute('data-placeholder', placeholder);
    input.removeAttribute('form-placeholder');
    text = input.outerHTML;
  }

  setValueOfMask(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const placeholder: string = e.target.getAttribute('data-placeholder') ?? '';

    return `<i>${value}</i>${placeholder.substring(value.length)}`;
  }

  activateMasking(inputs: NodeListOf<Element>) {
    this.maskedInputs?.forEach((element: Element) => {
      element.addEventListener(
        'keyup',
        (e) => {
          this.handleValueChange(e);
        },
        false
      );
    });
  }

  handleValueChange(e: any) {
    const id: string = e.target.getAttribute('id');

    switch (
      e.keyCode // allows navigating thru input
    ) {
      case 20: // caplocks
      case 17: // control
      case 18: // option
      case 16: // shift
      case 37: // arrow keys
      case 38:
      case 39:
      case 40:
      case 9: // tab (let blur handle tab)
        return;
    }

    const input: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
    const maskedInput: HTMLElement | null = document.getElementById(id + 'Mask');

    // if (input)
    input.value = this.handleCurrentValue(e);

    if (maskedInput) {
      maskedInput.innerHTML = this.setValueOfMask(e);
    }
  }

  handleCurrentValue(e: ChangeEvent<HTMLInputElement>) {
    const isCharsetPresent: string = e.target.getAttribute('data-charset') || '';
    const placeholder: string = isCharsetPresent || e.target.getAttribute('data-placeholder') || '';
    const value: string = e.target.value;
    const l: number = placeholder.length;
    let newValue = '';
    let isInt: boolean;
    let isLetter: boolean;
    // strip special characters
    const strippedValue = isCharsetPresent ? value.replace(/\W/g, '') : value.replace(/\D/g, '');
    const p = this;

    for (let i = 0, j = 0; i < l; i++) {
      const x: boolean = (isInt = !isNaN(parseInt(strippedValue[j])));
      isLetter = strippedValue[j] ? Boolean(strippedValue[j].match(/[A-Z]/i)) : false;
      const matchesNumber = p.maskedNumber.indexOf(placeholder[i]) >= 0;
      const matchesLetter = p.maskedLetter.indexOf(placeholder[i]) >= 0;

      if ((matchesNumber && isInt) || (isCharsetPresent && matchesLetter && isLetter)) {
        newValue += strippedValue[j++];
      } else if (
        (!isCharsetPresent && !isInt && matchesNumber) ||
        (isCharsetPresent && ((matchesLetter && !isLetter) || (matchesNumber && !isInt)))
      ) {
        // masking.errorOnKeyEntry(); // write your own error handling function
        return newValue;
      } else {
        newValue += placeholder[i];
      }

      // break if no characters left and the pattern is non-special character
      if (strippedValue[j] == undefined) {
        break;
      }
    }

    if (e.target.getAttribute('data-valid-example')) {
      return p.validateProgress(e, newValue);
    }

    return newValue;
  }

  validateProgress(e: ChangeEvent<HTMLInputElement>, value: string) {
    const validExample = e.target.getAttribute('data-valid-example') ?? '';
    const pattern = new RegExp(e.target.getAttribute('pattern') ?? '');
    const placeholder = e.target.getAttribute('data-placeholder') ?? '';
    const l = value.length;
    let testValue = '';

    //convert to months
    if (l == 1 && placeholder.toUpperCase().substr(0, 2) == 'MM') {
      if (Number(value) > 1 && Number(value) < 10) {
        value = '0' + value;
      }
      return value;
    }

    // test the value, removing the last character, until what you have is a submatch
    for (let i: number = l; i >= 0; i--) {
      testValue = value + validExample.substr(value.length);
      if (pattern.test(testValue)) {
        return value;
      } else {
        value = value.substr(0, value.length - 1);
      }
    }

    return value;
  }
}

const mask = new Masking();
export default mask;
