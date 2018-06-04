/**
 * Класс предоставляет доступ к данным в localStorage
 */
export default class ServerProxy {

    // выборка всех отзывов
    getAllFeedbacks() {
        if (!localStorage.feedbacks) {
            return [];
        }

        return JSON.parse(localStorage.feedbacks) || [];
    }

    // добавление отзыва
    addAddressFeedBack(info) {

        if (!info) {
            return;
        }
        const feedbacks = this.getAllFeedbacks();

        feedbacks.push(info);

        localStorage.feedbacks = JSON.stringify(feedbacks);
    }

    // выборка отзывов по адресу
    getAddressFeedbacks(addressCode) {
        if (!addressCode) {
            return [];
        }
        const feedbacks = this.getAllFeedbacks();

        if (!feedbacks || feedbacks.length === 0) {
            return [];
        }

        const filtered = feedbacks
            .filter(item => item.addressCode && item.addressCode === addressCode)
            .sort(feedbackSort);

        if (filtered.length === 0) {
            return [];
        }

        return filtered[0];
    }

    // выборка отзывов по кластеру
    getClusterFeedbacks(addressCodes) {
        if (!addressCodes || addressCodes.length === 0) {
            return [];
        }
        const feedbacks = this.getAllFeedbacks();

        if (!feedbacks || feedbacks.length === 0) {
            return [];
        }

        const filtered = feedbacks
            .filter(item => item.addressCode && addressCodes.include(item.addressCode))
            .sort(feedbackSort);

        if (filtered.length === 0) {
            return [];
        }

        return filtered[0];
    }
}

function feedbackSort(item1, item2) {
    if (item1.date < item2.date) {
        return -1;
    }
    if (item1.date > item2.date) {
        return 1;
    }

    return 0;
}