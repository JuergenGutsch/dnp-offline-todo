export class TodoRepository {

    static LoadItems(callback) {
        let data = OfflineRepository.LoadItems();
        if (!data && data.length === 0) {
            fetch('api/todo')
                .then(response => response.json())
                .then(data => {
                    OfflineRepository.AddItems(data);
                    callback(data)
                });
        }
    }

    static UpdateItem(item, callback) {
        OfflineRepository.UpdateItem(item);
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

    static CreateItem(item, callback) {
        OfflineRepository.CreateItem(item);
        fetch('api/todo', {
                method: 'POST',
                contentType: 'application/json',
                body: JSON.stringify(item)
            })
            .then(response => response.json())
            .then(() => {
                callback(data);
            });

    }

    static DeleteItem(callback) {
        OfflineRepository.DeleteItem(item);
        fetch('api/todo/' + item.id, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(() => {
                callback();
            });
    }
}