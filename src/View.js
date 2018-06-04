import addressPopupTmpl from '../views/address-popup.hbs';
import clusterPopupTmpl from '../views/cluster-popup.hbs';

/**
 * Класс представления
 */
export default class View {
    constructor() {
        this.addressPopupDiv = document.querySelector('#address-overlay');
        this.clusterPopupDiv = document.querySelector('#cluster-overlay');
        this.centerFeedback = document.querySelector('#center-feedback');

        this.addressCloseBtn = document.querySelector('#address-close');
        this.clusterCloseBtn = document.querySelector('#cluster-close');
        this.addFeedbackBtn = document.querySelector('#add-feedback');

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

        this.addEventListeners();
    }

    // Заполненняет шаблон из .hbs-файла данными из переданного объекта и вставляет их в html страницы
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

    // открывает попап со всеми отзывами по одному адресу
    openAddressPopup(addressInfo) {
        toggleVisibility(this.addressPopupDiv, true);
        this.render('address-overlay', addressInfo);
    }

    // закрывает попап со всеми отзывами по одному адресу
    closeAddressPopup() {
        toggleVisibility(this.addressPopupDiv, false);
    }

    // открывает попап со всеми отзывами по одному кластеру
    openClusterPopup(clusterInfo) {
        toggleVisibility(this.clusterPopupDiv, true);
        this.render('cluster-overlay', clusterInfo);
    }

    // закрывает попап со всеми отзывами по одному кластеру
    closeClusterPopup() {
        toggleVisibility(this.clusterPopupDiv, false);
    }

    addEventListeners() {
        // клик по ссылке адреса из карусели
        this.centerFeedback.addEventListener('click', (e) => {
            if (!e.target.classList.contains('cluster-link')) {
                return;
            }
            e.preventDefault();
            this.closeClusterPopup();

            const addressCode = e.target.getAttribute('name');

            if (!addressCode) {
                return;
            }

            // TODO
            // передать контроллеру addressCode, чтобы тот получил данные по адресу и открыл попап
            // либо чтобы обновил данные в полях для двойных привязок и открыл попап
        });

        // закрыть попап с адресом
        this.addressCloseBtn.addEventListener('click', () => {
            this.closeAddressPopup();
        });

        // закрыть попап с кластером
        this.clusterCloseBtn.addEventListener('click', () => {
            this.closeClusterPopup();
        });

        // Отправить отзыв
        this.addFeedbackBtn.addEventListener('click', () => {

            // TODO
            // отправить отзыв контроллеру и обновить список отзывов в попапе
            // из тех, что вернет контроллер
            // либо чтобы контроллер обновил данные в полях для двойных привязок
        });

        // перемотка карусели влево

        // перемотка карусели вправо

        // переход на отзыв № в карусели
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