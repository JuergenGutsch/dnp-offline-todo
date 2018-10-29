export class OfflineRepository {

    static LoadItems() {
        return [];
    }

    static AddItems(items) {

    }

    static UpdateItem(item) {
        let items = OfflineRepository.LoadItems();
        let existing = items.find(x => x.id === item.id);
        existing.name = item.name;
        existing.isDone = item.isDone;
        OfflineRepository.AddItems(items);
    }

    static CreateItem(item) {
        let items = OfflineRepository.LoadItems();
        items.push(item);
        OfflineRepository.AddItems(reduced);
    }

    static DeleteItem(item) {
        let items = OfflineRepository.LoadItems();
        let filtered = items.filter(x => x.id !== item.id);
        OfflineRepository.AddItems(filtered);
    }
}