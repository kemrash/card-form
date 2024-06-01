import { el, setChildren } from 'redom';
import valid from 'card-validator';
import IMask from 'imask';
import { images } from './images.js';

export default class Form {
  constructor() {
    this.form = el('form', {
      className: 'form',
      noValidate: 'novalidate',
      ariaLive: 'polite',
    });
    this.inputsNames = ['number', 'enddate', 'cvc', 'email'];
    this.inputs = {};
    this.error = {};
    this.isValid = {
      number: false,
      enddate: false,
      cvc: false,
      email: false,
    };
    this.createInputs();
    this.addMask();
    this.getCardType();

    return this.form;
  }

  createInputs() {
    setChildren(this.form, [
      this.inputsNames.map((name) => {
        const $labelForm = el(
          'label',
          {
            className: `form__label form__label_${name}`,
          },
          [
            el(
              'span',
              { className: 'form__span' },
              name === 'number'
                ? 'Номер карты'
                : name === 'enddate'
                ? 'Действительна до'
                : name === 'cvc'
                ? 'CVC/CVV'
                : 'Ваш email'
            ),
            name === 'number'
              ? el('div', { className: 'form__card-inner' }, [
                  (this.inputs[name] = el('input', {
                    className: `form__input form__input_${name}`,
                    id: name,
                    name: name,
                    type: 'text',
                    ariaLabel: 'Номер карты',
                    autocomplete: 'off',
                  })),
                  (this.cardImg = el('img', {
                    className: 'form__img',
                    src: images.default,
                    alt: 'Карта',
                  })),
                ])
              : (this.inputs[name] = el('input', {
                  className: `form__input form__input_${name}`,
                  id: name,
                  name: name,
                  type:
                    name === 'enddate'
                      ? 'text'
                      : name === 'cvc'
                      ? 'number'
                      : name === 'email'
                      ? 'email'
                      : 'number',
                  ariaLabel:
                    name === 'enddate'
                      ? 'Действительна до'
                      : name === 'cvc'
                      ? 'CVC/CVV'
                      : 'Ваш email',
                  autocomplete: 'off',
                })),
          ]
        );

        this.inputs[name].addEventListener('blur', (event) => {
          this.getEventBlur(event);
        });

        this.inputs[name].addEventListener('keypress', (event) => {
          this.testPressKey(event);
        });

        this.inputs[name].addEventListener('input', (event) => {
          this.clearErrorInputAndText(event);
        });

        return $labelForm;
      }),
      el(
        'div',
        {
          className: 'form__inner',
        },
        (this.submitButton = el(
          'button',
          { className: 'btn-reset form__btn', disabled: true },
          'Оплатить'
        ))
      ),
    ]);
  }

  testPressKey(event) {
    if (event.currentTarget.name === 'email') {
      if (event.key === ' ') {
        event.preventDefault();
      }
      return;
    }

    if (event.key === '-' || event.key === 'е') {
      event.preventDefault();
    }
  }

  getEventBlur(event) {
    const value = event.currentTarget.value.trim();

    if (!value) {
      return;
    }

    this.testValidAll(event.target.name, value);
  }

  testValidAll(name, value) {
    if (typeof name !== 'string' && typeof value !== 'string') {
      throw new TypeError('Значения должны быть строками');
    }

    if (name === 'number') {
      this.testValidNumber(name, value);
    }

    if (name === 'enddate') {
      this.testValidEndDate(name, value);
    }

    if (name === 'cvc') {
      this.testValidCvc(name, value);
    }

    if (name === 'email') {
      this.testValidEmail(name, value);
    }
  }

  testValidNumber(name, value) {
    this.isValidInput(
      name,
      valid.number(value).isValid,
      'Неверный номер карты'
    );
  }

  testValidEndDate(name, value) {
    let [month, year] = value.split('/');

    if (!month || !year) {
      this.createErrorText(name, 'Неверная дата окончания действия карты');
      this.isValid[name] = false;
      return;
    }

    const maxMonth = 12;
    const minMonth = 1;
    const numberOfZeroAdditionsToRecord = 10;

    month = Number(month);
    year = Number(year);

    if (month > maxMonth) {
      month = maxMonth;
    }

    let testMonth = month - minMonth;
    let testYaer = year;

    if (testMonth < minMonth) {
      testMonth = maxMonth;
      testYaer = --testYaer;
    }

    this.isValidInput(
      name,
      valid.expirationDate(`${testMonth}/${testYaer}`, Number.MAX_SAFE_INTEGER)
        .isValid,
      'Просроченная дата окончания действия карты'
    );

    if (month < numberOfZeroAdditionsToRecord) {
      month = '0' + month;
    }

    this.inputs['enddate'].value = `${month}/${year}`;
  }

  testValidCvc(name, value) {
    const maxCvcLength = 3;

    if (value.length > maxCvcLength) {
      throw new Error('Слишком большое значение');
    }

    this.isValidInput(
      name,
      valid.postalCode(value).isValid,
      'Неверный формат CVC/CVV'
    );
  }

  testValidEmail(name, value) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    this.isValidInput(name, pattern.test(value), 'Неверный формат email');
  }

  isValidInput(name, isTestValid = false, textError = '') {
    if (
      typeof name !== 'string' &&
      typeof isTestValid !== 'boolean' &&
      typeof textError !== 'string'
    ) {
      throw new TypeError('Не верный тип данных');
    }

    if (isTestValid) {
      this.isValid[name] = true;
      if (
        this.submitButton &&
        this.submitButton.hasAttribute('disabled') &&
        this.isTestAllValid()
      ) {
        this.submitButton.removeAttribute('disabled');
      }
    } else {
      this.createErrorText(name, textError);
      this.isValid[name] = false;
      if (this.submitButton && !this.submitButton.hasAttribute('disabled')) {
        this.submitButton.setAttribute('disabled', true);
      }
    }
  }

  isTestAllValid() {
    return Object.values(this.isValid).every((value) => value === true);
  }

  addMask() {
    if (!this.inputs) {
      return;
    }

    if (this.inputs.number) {
      IMask(this.inputs.number, {
        mask: '0000 0000 0000 0000 00',
      });
    }

    if (this.inputs.enddate) {
      IMask(this.inputs.enddate, {
        mask: '00/00',
      });
    }

    if (this.inputs.cvc) {
      IMask(this.inputs.cvc, {
        mask: '000',
      });
    }
  }

  createErrorText(inputName, text) {
    if (typeof inputName !== 'string' && typeof text !== 'string') {
      throw new TypeError('Значения должны быть строками');
    }

    if (!this.inputs[inputName]) {
      return;
    }

    this.inputs[inputName].classList.add('form__input_error');

    const parentLabel = this.inputs[inputName].closest('.form__label');

    if (this.error[inputName]) {
      this.error[inputName].textContent = text;
    } else {
      this.error[inputName] = el('span', {
        className: 'form__error',
        textContent: text,
      });

      parentLabel.append(this.error[inputName]);
    }
  }

  clearErrorInputAndText(event) {
    if (event.currentTarget.classList.contains('form__input_error')) {
      event.currentTarget.classList.remove('form__input_error');
    }

    if (this.error[event.currentTarget.name]) {
      this.error[event.currentTarget.name].remove();
      this.error[event.currentTarget.name] = null;
    }
  }

  getCardType() {
    if (!this.inputs['number']) {
      return;
    }

    this.inputs['number'].addEventListener('input', (event) => {
      this.cardType = valid.number(event.currentTarget.value.trim()).card?.type;
    });
  }

  set cardType(value) {
    this._cardType = value;

    if (this._cardType !== this.currentCardType) {
      this.currentCardType = this._cardType;

      if (this.currentCardType) {
        this.cardImg.src = images[this.currentCardType];
        this.cardImg.alt = `Карта ${this.currentCardType}`;
      } else {
        this.cardImg.src = images.default;
        this.cardImg.alt = `Карта`;
      }
    }

    this.cardImg.addEventListener('error', () => {
      this.cardImg.src = images.default;
    });
  }

  get cardType() {
    return this._cardType;
  }
}
