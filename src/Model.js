import { EventEmitter } from './helpers';

/**
 * Model - Базовый класс модели
 */
export default class Model extends EventEmitter {
    constructor() {
        super();

    }

    // получение значения свойства field из модели
    read(field) {
        return this[field];
    }

    // поиск всех элементов в массиве modelField, чье поле searchField содержит в себе подстроку value
    searchBy({ modelField, searchField, value }) {

        return this[modelField].filter((item) => {
            const itemField = item[searchField].toLowerCase();

            return itemField.includes(value.toLowerCase());
        });
    }

    // обновление свойства field модели значением data с последующим оповещением
    // в случае обновления левого и правого видимого списка друзей
    update(field, data) {
        this[field] = data;
    }

    // инициализация модели выполняется из контроллера при старте приложения
    init() {}
}

/**
 * Возвращает номер элемента в массиве list, у которого свойство id имеет указанное значение
 * @param {*} list 
 * @param {*} id 
 */
function getItemIndexById(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            return i;
        }
    }
}