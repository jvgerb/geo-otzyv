import addressPopupTmpl from '../views/address-popup.hbs';
import clusterPopupTmpl from '../views/cluster-popup.hbs';

/**
 * Класс представления
 */
export default class View {
    constructor() {
        this.addressPopupDiv = document.querySelector('#address-overlay');
        this.clusterPopupDiv = document.querySelector('#cluster-overlay');

        // this.centerFeedback = document.querySelector('#center-feedback');

        // this.addressCloseBtn = document.querySelector('#address-close');
        // this.clusterCloseBtn = document.querySelector('#cluster-close');
        // this.addFeedbackBtn = document.querySelector('#add-feedback');

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

    // отправить отзыв
    sendFeedback() {
        // TODO
        // отправить отзыв контроллеру и обновить список отзывов в попапе
        // из тех, что вернет контроллер
        // либо чтобы контроллер обновил данные в полях для двойных привязок
    }

    // клик по ссылке адреса из карусели
    openAddressPopupFromCluster(e) {
        e.preventDefault();
        this.closeClusterPopup();

        const addressCode = e.target.getAttribute('name');

        if (!addressCode) {
            return;
        }

        // TODO
        // передать контроллеру addressCode, чтобы тот получил данные по адресу и открыл попап
        // либо чтобы обновил данные в полях для двойных привязок и открыл попап
    }

    addEventListeners() {

        // вешаем все на документ, потому что остальные элементы
        // будут созданы позже
        document.addEventListener('click', (e) => {

            // клик по ссылке адреса из карусели
            if (e.target.classList.contains('cluster-link')) {
                this.openAddressPopupFromCluster(e);

                return;
            }

            switch (e.target) {
                // закрыть попап с адресом
                case this.addressCloseBtn:
                    this.closeAddressPopup();
                    break;
                    // закрыть попап с кластером
                case this.clusterCloseBtn:
                    this.closeClusterPopup();
                    break;
                    // отправить отзыв
                case this.addFeedbackBtn:
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