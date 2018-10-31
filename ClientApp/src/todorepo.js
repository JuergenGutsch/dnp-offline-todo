export class TodoRepository {

    constructor(offlineRepository) {
        this._offlineRepository = offlineRepository;
    }

    LoadItems(callback) {
        this._offlineRepository.IsOnline(isOnline => {
            if (isOnline) {
                fetch('api/todo')
                    .then(response => response.json())
                    .then(data => {
                        this._offlineRepository.AddItems(data);
                        callback(data)
                    })
                    .catch(err => {
                        console.log(err);
                        let data = this._offlineRepository.LoadItems();
                        callback(data)
                    });
            } else {
                let data = this._offlineRepository.LoadItems();
                callback(data)
            }
        });
    }

    UpdateItem(item, callback) {
        this._offlineRepository.IsOnline(isOnline => {
            if (isOnline) {
                fetch('api/todo/' + item.id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    })
                    .then(() => {
                        callback();
                    })
                    .catch(err => {
                        console.log(err);
                        this._offlineRepository.UpdateItem(item);
                    });
            } else {
                this._offlineRepository.UpdateItem(item);
            }
        });
    }

    CreateItem(item, callback) {
        this._offlineRepository.IsOnline(isOnline => {
            if (isOnline) {
                fetch('api/todo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    })
                    .then(() => {
                        callback();
                    })
                    .catch(err => {
                        console.log(err);
                        this._offlineRepository.CreateItem(item);
                    });
            } else {
                this._offlineRepository.CreateItem(item);
            }
        });
    }

    DeleteItem(item, callback) {
        this._offlineRepository.IsOnline(isOnline => {
            if (isOnline) {
                fetch('api/todo/' + item.id, {
                        method: 'DELETE'
                    })
                    .then(() => {
                        callback();
                    })
                    .catch(err => {
                        console.log(err);
                        this._offlineRepository.DeleteItem(item);
                    });
            } else {
                this._offlineRepository.DeleteItem(item);
            }
        });
    }
}