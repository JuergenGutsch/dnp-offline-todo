export class TodoRepository {

    constructor(offlineRepository) {
        this._offlineRepository = offlineRepository;
    }

    LoadItems(callback) {
        let data = []
        if (this._offlineRepository.isOnline) {
            fetch('api/todo')
                .then(response => response.json())
                .then(data => {
                    this._offlineRepository.AddItems(data);
                    callback(data)
                })
                .catch(err => {
                    console.log(err);
                    data = this._offlineRepository.LoadItems();
                });
        } else {
            data = this._offlineRepository.LoadItems();
        }
        return data;
    }

    UpdateItem(item, callback) {
        this._offlineRepository.UpdateItem(item);
        fetch('api/todo/' + item.id, {
                method: 'PUT',
                contentType: 'application/json',
                body: JSON.stringify(item)
            })
            .then(response => response.json())
            .then(data => {
                callback(data);
            });
    }

    CreateItem(item, callback) {
        this._offlineRepository.CreateItem(item);
        fetch('api/todo', {
                method: 'POST',
                contentType: 'application/json',
                body: JSON.stringify(item)
            })
            .then(response => response.json())
            .then(() => {
                callback();
            });

    }

    DeleteItem(item, callback) {
        this._offlineRepository.DeleteItem(item);
        fetch('api/todo/' + item.id, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(() => {
                callback();
            });
    }
}