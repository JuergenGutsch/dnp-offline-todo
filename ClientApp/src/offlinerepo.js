export class OfflineRepository {

    isOnline = false;
    
    constructor(){
        // this.CheckState((state) => {
        //     this.isOnline = state;
        // });
    }

    CheckState(callback) {
        fetch("/ping.js")
            .then(response => response.json())
            .then((data) => {
                this.isOnline = true;
                callback(true);
            })
            .catch((err) => {
                console.log(err);
                this.isOnline = false;
                callback(false);
            })

        window.setTimeout(() => {
            this.CheckState(callback);
        }, 1000)
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