import { EventEmitter } from './helpers';

/**
 * Model - Базовый класс модели
 */
export default class Model extends EventEmitter {
    constructor() {
        super();

        // текущий выбранный адрес со всеми отзывами
        this.currentAddress = null;

        // текущий выбранный кластер со всеми адресами и отзывами
        this.currentCluster = null;

    }

    getCurrentAddress() {
        return this.currentAddress;
    }

    setCurrentAddress(addressInfo) {
        updateProperty(this, 'currentAddress', addressInfo);
    }

    getCurrentCluster() {
        return this.currentCluster;
    }

    setCurrentCluster(clusterInfo) {
        updateProperty(this, 'currentCluster', clusterInfo);
    }
}

// private methods

// обновление свойства field модели значением data с последующим оповещением
function updateProperty(modelObj, field, data) {
    modelObj[field] = data;

    modelObj.emit(`${field}Updated`, modelObj[field]);
}