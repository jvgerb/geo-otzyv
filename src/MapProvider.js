import { EventEmitter } from './helpers';

export default class Model extends EventEmitter {
    constructor() {
        super();
        this.myMap = null;
        this.clusterer = null;

        // инициализация карты
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
                    // Получение координат щелчка
                    var coords = e.get('coords');

                    getGeoCode(coords)
                        .then((address) => {
                            self.emit('currentAddressChanged', { address: address });
                        })
                        .catch(err => console.log(err));
                });
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