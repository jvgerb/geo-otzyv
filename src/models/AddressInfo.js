/**
 * Единичный отзыв
 * @param {string} place - Место
 * @param {string} msg - Сообщение
 * @param {string} userName - Юзер
 * @param {Date} date - Дата
 */
export function Feedback(place, msg, userName, date) {
    return {
        place: place,
        userName: userName,
        message: msg,
        date: date,
        dateFormatted: formatDate(date)
    }
}

/**
 * Единичный отзыв, включащий данные об адресе
 * В этом формате хранятся отзывы на сервере
 * @param {string} addressString - строка адреса
 * @param {number[2]} coordinates - координаты
 * @param {string} place - Место
 * @param {string} msg - Сообщение
 * @param {string} userName - Юзер
 * @param {Date} date - Дата
 */
export function PlaceFeedback(addressString, coordinates, place, msg, userName, date) {
    return {
        addressString: addressString,
        coordinates: coordinates,
        feedback: new Feedback(place, msg, userName, date)
    }
}

/**
 * Единичный адрес с отзывами
 * В этом формате хранится текущий выбранный адрес
 * @param {string} addressString - строка адреса
 * @param {string} coordinates - координаты
 * @param {Feedback[]} feedbacks - массив отзывов в формате Feedback
 */
export function AddressInfo(addressString, coordinates, feedbacks) {
    return {
        addressString: addressString,
        coordinates: coordinates,
        feedbacks: feedbacks,
        hasNoFeedbacks: function() {
            return !feedbacks || !feedbacks.length;
        }
    }
}

function formatDate(date) {
    const m = date.getMonth();
    const d = date.getDate();

    return `${date.getFullYear()}.${(m <= 9 ? '0' + m : m) }.${(d <= 9 ? '0' + d : d) } ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}