import { EventEmitter } from './helpers';
import addressPopupTmpl from '../views/address-popup.hbs';

/**
 * Класс представления
 */
export default class View extends EventEmitter {
    constructor() {
        super();

        this.addressPopupDiv = document.querySelector('#address-overlay');

        // мэппинг между именем шаблона и его функцией рендера / хтмл-элементом
        this.renderMap = new Map(
            [
                ['address', {
                    renderFunc: addressPopupTmpl,
                    container: this.addressPopupDiv
                }]
            ]);

        this.initListeners();
    }

    // перерендерить попап с адресом
    renderAddressPopup(addressInfo) {
        this.render('address', addressInfo);
    }

    // открывает попап со всеми отзывами по одному адресу
    openAddressPopup(position) {
        const newPosition = getBalloonPosition(position, POPUP_HEIGHT, POPUP_WIDTH);

        this.addressPopupDiv.style.left = newPosition.x;
        this.addressPopupDiv.style.top = newPosition.y;
        toggleVisibility(this.addressPopupDiv, true);
    }

    // закрывает попап со всеми отзывами по одному адресу
    closeAddressPopup() {
        toggleVisibility(this.addressPopupDiv, false);
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

    // Заполняет шаблон из .hbs-файла данными из переданного объекта и вставляет их в html страницы
    render(templateName, model) {
        const renderInfo = this.renderMap.get(templateName);

        if (!renderInfo.renderFunc) {
            throw new Error(`Не зарегистрирован метод рендера для шаблона ${templateName}`);
        } else if (!renderInfo.container) {
            throw new Error(`Не зарегистрирован html-контейнер для шаблона ${templateName}`);
        } else {
            renderInfo.container.innerHTML = renderInfo.renderFunc(model);
        }
    }

    initListeners() {

        // вешаем все на документ, потому что остальные элементы
        // будут созданы позже
        document.addEventListener('click', (e) => {
            // клик по ссылке адреса из карусели
            if (e.target.classList.contains('balloon-link')) {
                e.preventDefault();
                this.emit('clusterLinkClicked', { addressString: e.target.innerText, position: [e.clientX, e.clientY] });

                return;
            }

            switch (e.target.getAttribute('id')) {
                // закрыть попап с адресом
                case 'address-close':
                    this.closeAddressPopup();
                    break;
                    // отправить отзыв
                case 'add-feedback':
                    this.sendFeedback();
                    break;
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

/**
 * Расчет позиции попапа
 */
function getBalloonPosition([clickX, clickY], popupWidth, popupHeight) {
    const windowWidth = window.innerWidth + window.scrollX;
    const windowHeight = window.innerHeight + window.scrollY;

    let popupLeft = 0;
    let popupTop = 0;

    if (clickX + popupWidth > windowWidth) {
        popupLeft = clickX - popupWidth
    } else {
        popupLeft = clickX;
    }

    if (clickY + popupHeight > windowHeight) {
        popupTop = clickY - popupHeight
    } else {
        popupTop = clickY
    }

    if (popupLeft < window.scrollX) {
        popupLeft = window.scrollX;
    }

    if (popupTop < window.scrollY) {
        popupTop = window.scrollY;
    }

    if (popupLeft < 0 || popupLeft == undefined) {
        popupLeft = 0;
    }
    if (popupTop < 0 || popupTop == undefined) {
        popupTop = 0;
    }

    return { x: popupLeft + 'px', y: popupTop + 'px' }
}

var POPUP_HEIGHT = 380;
var POPUP_WIDTH = 500;