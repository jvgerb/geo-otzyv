import { EventEmitter } from './helpers';
import addressPopupTmpl from '../views/address-popup.hbs';
import clusterPopupTmpl from '../views/cluster-popup.hbs';

/**
 * Класс представления
 */
export default class View extends EventEmitter {
    constructor() {
        super();

        this.addressPopupDiv = document.querySelector('#address-overlay');
        this.clusterPopupDiv = document.querySelector('#cluster-overlay');

        // мэппинг между именем шаблона и функцией рендера
        this.renderMap = new Map(
            [
                ['address-overlay', addressPopupTmpl],
                ['cluster-overlay', clusterPopupTmpl]
            ]);

        // мэппинг между именем шаблона и его хтмл-элементом
        this.containerMap = new Map(
            [
                ['address-overlay', this.addressPopupDiv],
                ['cluster-overlay', this.clusterPopupDiv]
            ]);

        this.initListeners();
    }

    // перерендерить попап с адресом
    renderAddressPopup(addressInfo) {
        this.render('address-overlay', addressInfo);
    }

    // перерендерить попап с кластером
    renderClusterPopup(clusterInfo) {
        this.render('cluster-overlay', clusterInfo);
    }

    // открывает попап со всеми отзывами по одному адресу
    openAddressPopup() {
        toggleVisibility(this.addressPopupDiv, true);
    }

    // закрывает попап со всеми отзывами по одному адресу
    closeAddressPopup() {
        toggleVisibility(this.addressPopupDiv, false);
    }

    // открывает попап со всеми отзывами по одному кластеру
    openClusterPopup() {
        toggleVisibility(this.clusterPopupDiv, true);
    }

    // закрывает попап со всеми отзывами по одному кластеру
    closeClusterPopup() {
        toggleVisibility(this.clusterPopupDiv, false);
    }

    // отправить отзыв
    sendFeedback() {

        const newUser = document.querySelector('#new-user');
        const newPlace = document.querySelector('#new-place');
        const newOpinion = document.querySelector('#new-opinion');

        if (newUser.value && newPlace.value && newOpinion.value) {
            this.emit('newFeedbackAdded', {
                user: newUser.value,
                place: newPlace.value,
                opinion: newOpinion.value
            })
        }
    }

    // клик по ссылке адреса из карусели
    openAddressPopupFromCluster(e) {
        e.preventDefault();
        this.closeClusterPopup();

        const addressString = e.target.getAttribute('name');

        if (!addressString) {
            return;
        }

        // TODO
        // передать контроллеру addressCode, чтобы тот получил данные по адресу и открыл попап
        // либо чтобы обновил данные в полях для двойных привязок и открыл попап
    }

    // Заполняет шаблон из .hbs-файла данными из переданного объекта и вставляет их в html страницы
    render(templateName, model) {
        const renderFunc = this.renderMap.get(templateName),
            htmlContainer = this.containerMap.get(templateName);

        if (!renderFunc) {
            throw new Error(`Не зарегистрирован метод рендера для шаблона ${templateName}`);
        } else if (!htmlContainer) {
            throw new Error(`Не зарегистрирован html-контейнер для шаблона ${templateName}`);
        } else {
            htmlContainer.innerHTML = renderFunc(model);
        }
    }

    initListeners() {

        // вешаем все на документ, потому что остальные элементы
        // будут созданы позже
        document.addEventListener('click', (e) => {

            // клик по ссылке адреса из карусели
            if (e.target.classList.contains('cluster-link')) {
                alert('cluster-link click');
                this.openAddressPopupFromCluster(e);

                return;
            }

            switch (e.target.getAttribute('id')) {
                // закрыть попап с адресом
                case 'popup-close-btn':
                case 'address-close':
                    this.closeAddressPopup();
                    break;
                    // закрыть попап с кластером
                case 'cluster-close-btn':
                case 'cluster-close':
                    this.closeClusterPopup();
                    break;
                    // отправить отзыв
                case 'add-feedback':
                    this.sendFeedback();
                    break;
                    // перемотка карусели влево

                    // перемотка карусели вправо

                    // переход на отзыв № в карусели
                default:
                    break;
            }
        })
    }
}

/**
 * Переключение видимости хтмл-элемента
 * @param {*} element 
 * @param {*} condition 
 */
function toggleVisibility(element, condition) {
    if (condition) {
        element.classList.remove('display-none');

        return;
    }
    element.classList.add('display-none');
}