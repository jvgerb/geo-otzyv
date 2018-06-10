import { EventEmitter } from './helpers';

export default class Model extends EventEmitter {
    constructor() {
        super();
        this.myMap = null;
        this.clusterer = null;
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

                // создаем макет содержимого кластера
                const customItemContentLayout = createClusterBalloonTemplate();

                this.clusterer = new ymaps.Clusterer({
                    preset: 'islands#invertedDarkorangeClusterIcons',
                    clusterDisableClickZoom: true,
                    clusterOpenBalloonOnClick: true,
                    clusterBalloonContentLayout: 'cluster#balloonCarousel',
                    clusterBalloonItemContentLayout: customItemContentLayout,
                });

                this.myMap.geoObjects.add(this.clusterer);

                // замена дефолтного курсора
                this.myMap.cursors.push('pointer');

                addGeoObjectClickHandler(this.myMap, this);

                // const self = this;

                // this.clusterer.events.add('balloonopen', function(e) {
                //     const t = self.clusterer.geoObjects;

                //     // var objectState = this.clusterer.getObjectState(this.clusterer.geoObjects[0]);

                //     // if (objectState.isClustered) {
                //     //     // Если метка находится в кластере, выставим ее в качестве активного объекта.
                //     //     // Тогда она будет "выбрана" в открытом балуне кластера.
                //     //     objectState.cluster.state.set('activeObject', this.clusterer.geoObjects[0]);
                //     //     // clusterer.balloon.open(objectState.cluster);
                //     // }
                //     //    this.clusterer.properties.set('balloonContent', 'newContent');
                // });
            });
    }

    addPlacemark(feedback) {
        this.clusterer.add(createPlacemark(feedback, this));
    }

    addPlacemarks(feedbacks) {
        const placemarks = feedbacks.map(item => createPlacemark(item, this));

        this.clusterer.add(placemarks);
    }

    closeClusterBalloon() {
        this.clusterer.balloon.close();
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

/**
 * Создание кастомного шаблона для баллуна кластера
 */
function createClusterBalloonTemplate() {
    // Создаем собственный макет с информацией о выбранном геообъекте.
    const tmpl = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h2 class=balloon-header>{{ properties.place|raw }}</h2>' +
        '<a href="#" class=balloon-link>{{ properties.address|raw }}</a>' +
        '<div class=balloon-body>{{ properties.message|raw }}</div>' +
        '<div class=balloon-footer>{{ properties.dateFormatted|raw }}</div>'
    );

    return tmpl;
}

/**
 * Создание метки
 * @param {PlaceFeedback} fb - данные об адресе и отзыве
 *  @param {MapProvider} map -  Объект провайдера карты, оповещающий о событии
 */
function createPlacemark(fb, map) {
    const pm = new ymaps.Placemark(fb.coordinates, {
        place: fb.feedback.place,
        message: fb.feedback.message,
        dateFormatted: fb.feedback.dateFormatted,
        address: fb.addressString
    }, { preset: 'islands#darkOrangeDotIcon' });

    addGeoObjectClickHandler(pm, map);

    return pm;
}