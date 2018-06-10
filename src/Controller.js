import { PlaceFeedback, Feedback } from './models/AddressInfo';
import { AddressInfo } from './models/AddressInfo';

/**
 * Контроллер приложения. Синхронизирует модель и представление,
 * работает с источниками данных
 */
export default class Controller {
    constructor(view, model, serverProxy, mapProvider) {
        this.model = model;
        this.view = view;
        this.serverProxy = serverProxy;
        this.mapProvider = mapProvider;

        // регистририуем обработчики событий для связи всех компонентов приложения между собой
        // с помощью событий, адресованных друг к другу
        this.initListeners();

        // логин и начальная загрузка страницы
        this.init();
    }

    init() {
        this.mapProvider.loadMap()
            // загрузка имеющихся меток с сервера
            .then(() => this.serverProxy.getAllFeedbacks())
            .then((feedbacks) => {
                // добавляем метку на карту
                this.mapProvider.addPlacemarks(feedbacks);
            })
            .catch(err => console.log(err));
    }

    showAddressInfo(addressString, coordinates) {
        // здесь будет обращение к другому серверу за данными, которое выполняется асинхронно
        new Promise((resolve) => resolve(this.serverProxy.getAddressFeedbacks(addressString)))
            .then((fb) => {
                const feedbacks = fb.map(f => f.feedback);
                const addressInfo = new AddressInfo(addressString, coordinates, feedbacks);

                this.model.setCurrentAddress(addressInfo);
                this.view.openAddressPopup();
            })
            .catch((e) => console.log(e));
    }

    addNewFeedback(newFeedback) {
        const currentAddress = this.model.getCurrentAddress();

        if (currentAddress) {
            const nf = new PlaceFeedback(currentAddress.addressString, currentAddress.coordinates,
                newFeedback.place, newFeedback.opinion, newFeedback.user, new Date());

            // отправляем отзыв на сервер
            this.serverProxy.addAddressFeedBack(nf);

            // добавляем отзыв к списку текущих отзывов модели
            this.model.addAddressFeedback(nf.feedback);

            // добавляем метку на карту
            this.mapProvider.addPlacemark(nf);
        }
    }

    initListeners() {
        // подписка view на обновление данных о текущем выбранном адресе в модели
        this.model.on('currentAddressUpdated', (addressInfo) => {
            this.view.renderAddressPopup(addressInfo);
        });

        // подписка view на обновление данных о текущем выбранном кластере в модели
        this.model.on('currentClusterUpdated', (clusterInfo) => {
            this.view.renderClusterPopup(clusterInfo);
        });

        // подписка контроллера на изменение выбранного адреса на карте
        this.mapProvider.on('currentAddressChanged', ({ addressString, coordinates }) => {
            this.showAddressInfo(addressString, coordinates);
        })

        // подписка контроллера на добавление нового отзыва
        this.view.on('newFeedbackAdded', (newFeedback) => {
            this.addNewFeedback(newFeedback);
        });
    }
}