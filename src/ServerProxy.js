import AddressInfo from '../models/addressInfo';

/**
 * Класс предоставляет доступ к данным в localStorage
 */
export default class ServerProxy {

    /**
     * Выборка всех отзывов
     * @returns {[PlaceFeedback]} - возвращает массив отзывов в формате PlaceFeedback
     */
    getAllFeedbacks() {
        if (!localStorage.feedbacks) {
            return [];
        }

        return JSON.parse(localStorage.feedbacks) || [];
    }

    /**
     * Добавление отзыва
     * @param {PlaceFeedback} placeFeedback 
     */
    addAddressFeedBack(placeFeedback) {

        if (!placeFeedback) {
            return;
        }
        const feedbacks = this.getAllFeedbacks();

        feedbacks.push(placeFeedback);

        localStorage.feedbacks = JSON.stringify(feedbacks);
    }

    /**
     * Выборка всех отзывов
     * @param {string} addressCode 
     * @returns {[Feedback]} - возвращает массив отзывов в формате Feedback
     */
    getAddressFeedbacks(addressCode) {
        if (!addressCode) {
            return [];
        }
        const feedbacks = this.getAllFeedbacks();

        if (!feedbacks || feedbacks.length === 0) {
            return [];
        }

        const filtered = feedbacks
            .filter(item => item.addressCode && item.address.addressCode === addressCode)
            .sort(feedbackSort)
            .map(f => f.feedback);

        if (filtered.length === 0) {
            return [];
        }

        return filtered[0];
    }

    /**
     * Выборка всех отзывов по кластеру
     * @param {[string]} addressCodes - массив геокодов адресов, для которых надо выполнять поиск
     * @returns {[PlaceFeedback]} - возвращает массив отзывов в формате PlaceFeedback
     */
    getClusterFeedbacks(addressCodes) {
        if (!addressCodes || addressCodes.length === 0) {
            return [];
        }
        const feedbacks = this.getAllFeedbacks();

        if (!feedbacks || feedbacks.length === 0) {
            return [];
        }

        const filtered = feedbacks
            .filter(item => item.address.addressCode && addressCodes.includes(item.address.addressCode))
            .sort(feedbackSort);

        if (filtered.length === 0) {
            return [];
        }

        return filtered[0];
    }
}

/**
 * Сортировка отзывов по дате в обратном порядке
 * @param {*} item1 
 * @param {*} item2 
 */
function feedbackSort(item1, item2) {
    if (item1.feedback.date < item2.feedback.date) {
        return 1;
    }
    if (item1.feedback.date > item2.feedback.date) {
        return -1;
    }

    return 0;
}