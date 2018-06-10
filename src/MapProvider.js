import { EventEmitter } from './helpers';
import { EPROTONOSUPPORT } from 'constants';

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
                    preset: 'islands#invertedDarkorangeClusterIcons',
                    clusterDisableClickZoom: true,
                    openBalloonOnClick: true,
                    balloonContentBodyLayout: 'cluster#balloonCarouselContent'

                });

                this.myMap.geoObjects.add(this.clusterer);

                // замена дефолтного курсора
                this.myMap.cursors.push('pointer');

                addGeoObjectClickHandler(this.myMap, this);
            });
    }

    addPlacemark(coords) {
        const pm = new ymaps.Placemark(coords, {}, { preset: 'islands#darkOrangeDotIcon' });

        addGeoObjectClickHandler(pm, this);

        this.clusterer.add(pm);
    }

    addPlacemarks(feedbacks) {
        const placemarks = feedbacks.map(item => {
            const pm = new ymaps.Placemark(item.coordinates, {}, { preset: 'islands#darkOrangeDotIcon' })

            addGeoObjectClickHandler(pm, this);

            return pm;
        });

        this.clusterer.add(placemarks);
    }
}

// private methods
/**
 * Получение адреса по координатам
 * @param {number[2]} coords - Координаты объекта
 */
function getGeoCode(coords) {
    return ymaps.geocode(coords)
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

/**
 * Добавление обработчика клика для геообъекта 
 * @param {object} obj - геообъект (карта или метка)
 * @param {MapProvider} map - Объект провайдера карты, оповещающий о событии
 */
function addGeoObjectClickHandler(obj, map) {
    obj.events.add('click', function(e) {
        // Получение координат щелчка
        var coords = e.get('coords');

        getGeoCode(coords)
            .then((address) => {
                map.emit('currentAddressChanged', { addressString: address, coordinates: coords });
            })
            .catch(err => console.log(err));
    });
}