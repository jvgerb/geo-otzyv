import AddressInfo from './models/AddressInfo';

/**
 * Контроллер приложения. Синхронизирует модель и представление,
 * работает с источниками данных
 */
export default class Controller {
    constructor(view, model, serverProxy) {
        this.model = model;
        this.view = view;
        this.serverProxy = serverProxy;
        this.myMap = null;
        this.clusterer = null;

        // регистририуем обработчики событий для связи всех компонентов приложения между собой
        // с помощью событий, адресованных друг к другу
        this.initListeners();

        // логин и начальная загрузка страницы
        this.init();
    }

    init() {
        this.loadMap()
            // загрузка имеющихся меток с сервера
            .then(() => this.serverProxy.getAllFeedbacks())
            .then((feedbacks) => {
                console.log(feedbacks);

                return feedbacks;
            })
            .catch(err => console.log(err));
    }

    loadMap() {
        // ждем загрузку карты
        return new Promise(resolve => ymaps.ready(resolve))
            // инициализация карты
            .then(() => {
                this.myMap = new ymaps.Map('map', {
                    center: [47.23, 38.90], // Таганрог
                    zoom: 15
                }, {
                    searchControlProvider: 'yandex#search'
                });
                this.clusterer = new ymaps.Clusterer({
                    preset: 'islands#invertedVioletClusterIcons',
                    clusterDisableClickZoom: true,
                    openBalloonOnClick: false
                });

                this.myMap.geoObjects.add(this.clusterer);

                // замена дефолтного курсора
                this.myMap.cursors.push('pointer');

                const self = this;

                this.myMap.events.add('click', function(e) {

                    // if (!this.myMap.balloon.isOpen()){

                    // } else {
                    //     this.myMap.balloon.close();
                    // }

                    // Получение координат щелчка
                    var coords = e.get('coords');

                    // new Promise(resolve => resolve(getGeoCode(coords)))

                    getGeoCode(coords)
                        .then((address) => {
                            console.log(address);

                            self.model.setCurrentAddress({ addressString: address });
                            self.view.openAddressPopup();
                        })
                        .catch(err => console.log(err));
                });
            });
    }

    showAddressInfo(address) {
        // здесь будет обращение к другому серверу за данными, которое выполняется асинхронно
        new Promise((resolve) => {
                const feedbacks = this.serverProxy.getAddressFeedbacks(address.addressCode);

                resolve();

                return feedbacks;
            })
            .then((feedbacks) => {
                const addressInfo = new AddressInfo(address.addressString, address.addressCode, feedbacks);

                this.view.openAddressPopup(addressInfo);
            })
            .catch((e) => console.log(e));
    }

    showClusterInfo(addresses) {
        // здесь будет обращение к другому серверу за данными, которое выполняется асинхронно
        new Promise((resolve) => {
                const clusterFeedbacks = this.serverProxy.getClusterFeedbacks(addresses);

                resolve();

                return clusterFeedbacks;
            })
            .then((clusterFeedbacks) => {
                this.view.openClusterPopup(clusterFeedbacks);
            })
            .catch((e) => console.log(e));
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
    }
}

// private methods

function getGeoCode(addressCode) {
    return ymaps.geocode(addressCode)
        .then(result => {
            const points = result.geoObjects.toArray();

            if (points.length) {
                const firstGeoObject = points[0];

                const addressString = firstGeoObject.getAddressLine();

                return addressString;
            }

            return null;
        })
        .catch(err => console.log(err));
}