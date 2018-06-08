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

        this.addressCache = new Map();
        // логин и начальная загрузка страницы
        this.init();
    }

    init() {
        new Promise(resolve => ymaps.ready(resolve)) // ждем загрузку карты
            // инициализация карты
            .then(() => {
                this.myMap = new ymaps.Map('map', {
                    center: [47.23, 38.90], // Таганрог
                    zoom: 13
                }, {
                    searchControlProvider: 'yandex#search'
                });
                this.clusterer = new ymaps.Clusterer({
                    preset: 'islands#invertedVioletClusterIcons',
                    clusterDisableClickZoom: true,
                    openBalloonOnClick: false
                });

                this.myMap.geoObjects.add(this.clusterer);
            })
            // загрузка имеющихся меток с сервера
            .then(() => this.serverProxy.getAllFeedbacks())
            .then((feedbacks) => {
                console.log(feedbacks);

                return feedbacks;
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

    // private functions

    getGeoCode(address) {
        if (this.addressCache.has(address)) {
            return Promise.resolve(this.addressCache.get(address));
        }

        return ymaps.geocode(address)
            .then(result => {
                const points = result.geoObjects.toArray();

                if (points.length) {
                    const coors = points[0].geometry.getCoordinates();

                    this.addressCache.set(address, coors);

                    return coors;
                }
            });
    }
}