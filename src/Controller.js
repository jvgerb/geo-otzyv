import { debounce } from './helpers';

/**
 * Контроллер приложения. Синхронизирует модель и представление,
 * работает с источниками данных
 */
export default class Controller {
    constructor(view, model, localRepository) {
        this.model = model;
        this.view = view;
        this.localRepository = localRepository;

        // регистририуем обработчики событий для связи всех компонентов приложения между собой
        // с помощью событий, адресованных друг к другу
        this.initListerens();

        // логин и начальная загрузка страницы
    }

    // инициализация обработчиков событий
    initListerens() {}
}