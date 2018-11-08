export class OfflineRepository {

    isDirty = false;

    IsOnline(trueCallback, falseCallback) {
        this.CheckState(isOnline => {
            if (isOnline) {
                trueCallback(isOnline);
                if (this.isDirty) {
                    this.Sync();
                }
            } else {
                falseCallback();
            }
        });
    }

    CheckState(callback) {
        fetch('/api/todo/ping')
            .then(response => response.json())
            .then(data => {
                callback(true);
            })
            .catch(err => {
                console.log(err);
                callback(false);
            });
    }

    Sync() {
        var items = this.LoadItems();
        fetch('', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(items)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Sync done: ' + data);
            })
            .catch(err => {
                console.log('Sync failed: ' + err);
            });
        this.isDirty = false;
    }

    LoadItems() {
        var storage = window.localStorage;
        if (typeof(storage) === 'undefined') {
            alert('Your browser doesn\'t support offline storage.');
            return;
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
        if (typeof(storage) === 'undefined') {
            alert('Your browser doesn\'t support offline storage.');
            return;
        }

        storage.todoItems = JSON.stringify(items);
        this.isDirty = true;
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