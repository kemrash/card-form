# card-form
## Реализация формы для валидации карты по заданию на Webpack

### Описание
Сделайте форму для онлайн-оплаты. Форма должна иметь следующие поля для ввода:

### Функциональность
номер карты;
дата окончания действия карты (ММ/ГГ);
CVC/CVV (3 цифры на обороте карты);
email для отправки онлайн-чека.
Все поля обязательны для заполнения.

При вводе номера карты должны игнорироваться любые символы, кроме цифр. Цифры автоматически разделяются по 4 штуки пробелом. Номер карты должен проходить валидацию на корректность.

Дата окончания должна быть строго в формате 00/00, где первые 2 цифры — номер месяца, 3-4 цифры — год. Обязательно разделяйте их символом «/», причём делать это нужно автоматически, если в поле введено 2 цифры месяца. Указанные данные должны быть корректными (месяц от 01 до 12) и больше текущей даты (то есть если сегодня 14 марта 2021 года, то минимально возможная дата — 04/21).

В поле для CVC/CVV должно быть введено строго 3 цифры.

Email также должен быть указан в корректном формате.

Проверка корректности введённого значения должна происходить при потере фокуса на поле (событие blur), а при любом вводе в поле ошибка должна сбрасываться.

Под формой нужно расположить кнопку «Оплатить». Она должна быть в состоянии disabled до тех пор, пока пользователь корректно не заполнит все поля. Нажатие на кнопку обрабатывать не нужно.
