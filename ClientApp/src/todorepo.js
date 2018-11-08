export class TodoRepository {

    constructor(offlineRepository) {
        this._offlineRepository = offlineRepository;
    }

    LoadItems(callback) {
        let handleOfflineOrErr = err => {
            if (err) {
                console.log(err);
            }
            let data = this._offlineRepository.LoadItems();
            callback(data);
        };

        this._offlineRepository.IsOnline(
            () => { // online callback
                fetch('api/todo')
                    .then(response => response.json())
                    .then(data => {
                        this._offlineRepository.AddItems(data);
                        callback(data)
                    })
                    .catch(err => {
                        handleOfflineOrErr(err);
                    });
            },
            err => { // error or offline callback
                handleOfflineOrErr(err);
            }
        );
    }


    AddItem(item, callback) {
        let handleOfflineOrErr = err => {
            if (err) {
                console.log(err);
            }
            this._offlineRepository.AddItem(item);
            callback();
        };

        this._offlineRepository.IsOnline(
            () => { // online callback
                fetch('api/todo')
                    .then(() => {
                        this._offlineRepository.AddItem(item);
                        callback()
                    })
                    .catch(err => {
                        handleOfflineOrErr(err);
                    });
            },
            err => { // error or offline callback
                handleOfflineOrErr(err);
            }
        );
    }

    UpdateItem(item, callback) {
        let handleOfflineOrErr = err => {
            if (err) {
                console.log(err);
            }
            this._offlineRepository.UpdateItem(item);
            callback();
        };

        this._offlineRepository.IsOnline(
            () => { // online callback
                fetch('api/todo/' + item.id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    })
                    .then(() => {
                        callback();
                    })
                    .catch(err => {
                        handleOfflineOrErr(err);
                    });
            },
            err => { // error or offline callback
                handleOfflineOrErr(err);
            });
    }

    CreateItem(item, callback) {
        let handleOfflineOrErr = err => {
            if (err) {
                console.log(err);
            }
            this._offlineRepository.CreateItem(item);
            callback();
        };

        this._offlineRepository.IsOnline(
            () => { // online callback
                fetch('api/todo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    })
                    .then(() => {
                        callback();
                    })
                    .catch(err => {
                        handleOfflineOrErr(err);
                    });
            },
            err => { // error or offline callback
                handleOfflineOrErr(err);
            });
    }

    DeleteItem(item, callback) {
        let handleOfflineOrErr = err => {
            if (err) {
                console.log(err);
            }
            this._offlineRepository.CreateItem(item);
            callback();
        };

        this._offlineRepository.IsOnline(
            () => {
                fetch('api/todo/' + item.id, {
                        method: 'DELETE'
                    })
                    .then(() => {
                        callback();
                    })
                    .catch(err => {
                        handleOfflineOrErr(err);
                    });
            },
            err => {
                handleOfflineOrErr(err);
            });
    }
}