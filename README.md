# Weather App
Автор: Сулейманов Алмаз
## Использованные библиотеки
* [Yandex Maps Javascript API](https://yandex.com/dev/jsapi30/doc/en/), npm пакет которой называется **ol**
## Использованные API
* [Weather API](https://www.weatherapi.com/my/)
## Деплой
Доступ к сайту: http://46.8.64.188/ (80 http порт)

Для деплоя я использовал простой nginx с настройками по умолчанию, поменял лишь путь к корневой директории проекта. Конфигурация сохранена в файле "default"
## Реализованный функционал
* Отображение информации о погодных условиях в какой-либо точке планеты в реальном времени (кнопка Get weather info). Информация о погодных условиях включает в себя:
    * Температура воздуха
    * Обозначение места (страна, ближайший населенный пункт)
    * Иконка, показывающая облачность и осадки (или их отсутствие)
    * Местное время
    * Скорость ветра
    * Направление ветра
    * Атмосферное давление
* Интеграция с картами Яндекса для удобного выбора места, погоду в котором пользователь хочет получить (кнопка Use coordinates from map берет координаты с центра карты и вставляет их в поля ввода координат)
* Ввод координат места самим пользователем. Если пользователь сам вводит координаты места, то карта автоматически перемещается в это место
* Валидация координат, чтобы не давать WeatherAPI на вход невалидные координаты (при вводе невалидных координат запрос API не отправляется и пользователю сообщается, что он ввел невалидные координаты)
* В случае, если WeatherAPI не нашел состояние погоды в каком-то месте поскольку место расположено слишком далеко от цивилизации и любых метеорологических станций, сообщаем об этом
* Поля ввода координат, карта, интерактивные кнопки и информация о погодных условиях находятся внутри изолированного виджета
* Возможность добавлять и убирать виджеты
