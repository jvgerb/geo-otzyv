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

                var self = this;

                this.myMap.events.add('click', function(e) {

                    // if (!this.myMap.balloon.isOpen()){

                    // } else {
                    //     this.myMap.balloon.close();
                    // }

                    // Получение координат щелчка
                    var coords = e.get('coords');

                    new Promise((resolve) => resolve(self.getGeoCode(coords)))
                        .then((address) => {
                            alert(address);
                            console.log(address);
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

    // private functions

    getGeoCode(addressCode) {
        const addressCodeFixed = addressCode
            .map(i => +i.toFixed(2));

        if (this.addressCache.has(addressCodeFixed)) {
            console.log(`take address from cache addressString ${this.addressCache.get(addressCode)}`);

            return Promise.resolve(this.addressCache.get(addressCodeFixed));
        }

        return ymaps.geocode(addressCode)
            .then(result => {
                const points = result.geoObjects.toArray();

                if (points.length) {
                    const firstGeoObject = points[0];

                    const addressString = firstGeoObject.getAddressLine();

                    const addressCodeFixed = addressCode
                        .map(i => +i.toFixed(2));

                    this.addressCache.set(addressCodeFixed, addressString);

                    return addressString;
                }
            })
            .catch(err => console.log(err));
    }
}