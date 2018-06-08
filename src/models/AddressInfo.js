/**
 * Единичный отзыв, привязанный к адресу 
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
        date: date
    }
}

/**
 * Данные об адресе
 * @param {string} addressString - строка адреса
 * @param {string} addressCode - геокод адреса
 */
export function Address(addressString, addressCode) {
    return {
        addressString: addressString,
        addressCode: addressCode
    }
}

/**
 * Единичный адрес с отзывами
 * @param {string} addressString - строка адреса
 * @param {string} addressCode - геокод адреса
 * @param {Feedback} feedbacks - массив отзывов
 */
export function AddressInfo(addressString, addressCode, feedbacks) {
    return {
        address: new Address(addressString, addressCode),
        feedbacks: feedbacks,
        hasFeedbacks: feedbacks && feedbacks.length
    }
}

/**
 * Единичный отзыв, включащий данные об адресе
 * @param {string} addressString - строка адреса
 * @param {string} addressCode - геокод адреса
 * @param {string} place - Место
 * @param {string} msg - Сообщение
 * @param {string} userName - Юзер
 * @param {Date} date - Дата
 */
export function PlaceFeedback(addressString, addressCode, place, msg, userName, date) {
    return {
        address: new Address(addressString, addressCode),
        feedback: new Feedback(place, msg, userName, date)
    }
}