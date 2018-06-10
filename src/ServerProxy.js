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
     * @param {string} addressString 
     * @returns {[PlaceFeedback]} - возвращает массив отзывов в формате PlaceFeedback
     */
    getAddressFeedbacks(addressString) {
        if (!addressString) {
            return [];
        }
        const feedbacks = this.getAllFeedbacks();

        if (!feedbacks || feedbacks.length === 0) {
            return [];
        }

        const filtered = feedbacks
            .filter(item => item.addressString === addressString)
            .sort(feedbackSort);

        if (filtered.length === 0) {
            return [];
        }

        return filtered;
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