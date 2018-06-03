import { EventEmitter } from './helpers';

/**
 * Класс представления
 */
export default class View extends EventEmitter {
    constructor() {
        super();

        // регистрация обработчиков для связи view с контроллером,
        // т.к. view не имеет полномочий напрямую обновить данные в модели
        // при поиске и перемещении элементов между списками
        this.initListeners();
    }

    // Заполненняет шаблон из .hbs-файла данными из переданного объекта и вставляет их в html страницы
    render(renderFunc, htmlContainer, templateName, obj) {
        if (!renderFunc) {
            throw new Error(`Не зарегистрирован метод рендера для шаблона ${templateName}`);
        } else if (!htmlContainer) {
            throw new Error(`Не зарегистрирован html-контейнер для шаблона ${templateName}`);
        } else {

            htmlContainer.innerHTML = renderFunc(obj);
        }
    }

    initListeners() {}
}