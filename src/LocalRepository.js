/**
 * Класс предоставляет доступ к данным в localStorage
 */
export default class LocalReporsitory {

    getDataList() {
        if (!localStorage.dataLists) {
            return [];
        }

        return JSON.parse(localStorage.dataList) || [];
    }

    saveFriendsList(items) {
        localStorage.dataList = JSON.stringify(items);
    }

    deleteDataList() {
        localStorage.dataList = [];
    }
}