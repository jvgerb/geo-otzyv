import AddressInfo from '../models/addressInfo';

/**
 * Контроллер приложения. Синхронизирует модель и представление,
 * работает с источниками данных
 */
export default class Controller {
    constructor(view, model, serverProxy, map) {
        this.model = model;
        this.view = view;
        this.serverProxy = serverProxy;
        this.map = map;

        // логин и начальная загрузка страницы
        this.init();
    }

    init() {

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
}