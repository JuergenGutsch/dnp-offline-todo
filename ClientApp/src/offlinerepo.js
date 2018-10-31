export class OfflineRepository {

    constructor() {
        this.CanSync(() => {
            this.Sync();
        })
    }

    CanSync(callback) {
        this.CheckState(online => {
            if (online) {
                callback();
            }
        });

        window.setTimeout(() => {
            this.CanSync(callback);
        }, 5000);
    }

    IsOnline(callback) {
        this.CheckState((state) => {
            this._isOnline = state;
            callback(state);
        });
    }

    CheckState(callback) {
        fetch("/ping.js")
            .then(response => response.json())
            .then((data) => {
                this._isOnline = true;
                callback(true);
            })
            .catch((err) => {
                console.log(err);
                this._isOnline = false;
                callback(false);
            });
    }

    Sync() {

    }

    LoadItems() {
        var storage = window.localStorage;
        if (typeof(storage) === "undefined") {
            alert("Your browser doesn't support offline storage.")
        }

        var todoItems = [];
        var raw_todoItems = storage.todoItems;
        if (raw_todoItems) {
            todoItems = JSON.parse(raw_todoItems);
        }
        return todoItems;
    }

    AddItems(items) {
        var storage = window.localStorage;
        if (typeof(storage) === "undefined") {
            alert("Your browser doesn't support offline storage.")
        }

        storage.todoItems = JSON.stringify(items);
    }

    UpdateItem(item) {
        let items = OfflineRepository.LoadItems();
        let existing = items.find(x => x.id === item.id);
        existing.name = item.name;
        existing.isDone = item.isDone;
        OfflineRepository.AddItems(items);
    }

    CreateItem(item) {
        let items = OfflineRepository.LoadItems();
        items.push(item);
        OfflineRepository.AddItems(items);
    }

    DeleteItem(item) {
        let items = OfflineRepository.LoadItems();
        let filtered = items.filter(x => x.id !== item.id);
        OfflineRepository.AddItems(filtered);
    }
}