using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GenFu;
using Microsoft.AspNetCore.Mvc;
using OfflineToDo.Models;

namespace OfflineToDo.Repositories
{
    public interface ITodoRepository
    {
        IEnumerable<TodoItem> AllItems();
        TodoItem Item(int id);
        int AddItem(TodoItem item);
        void UpdateItem(int id, TodoItem item);
        void DeleteItem(int id);
        void SyncItems(IEnumerable<TodoItem> items);
    }
    public class TodoRepository : ITodoRepository
    {
        public TodoRepository()
        {
            var i = 1;
            GenFu.GenFu.Configure<TodoItem>()
                .Fill<int>(c => c.Id, () => { return i++; })
                .Fill<DateTime>(c => c.CreateDate, () => { return DateTime.Now.AddDays(i * -1); })
                .Fill<DateTime>(c => c.UpdateDate, () => { return DateTime.Now.AddDays(i * -1); });

            TodoItems = A.ListOf<TodoItem>(14);
        }

        private ICollection<TodoItem> TodoItems { get; set; }

        public IEnumerable<TodoItem> AllItems()
        {
            return TodoItems;
        }

        public TodoItem Item(int id)
        {
            return TodoItems.FirstOrDefault(x => x.Id == id);
        }

        public int AddItem([FromBody]TodoItem item)
        {
            var newId = TodoItems.Max(x => x.Id) + 1;
            item.Id = newId;
            TodoItems.Add(item);
            return newId;
        }

        public void UpdateItem(int id, [FromBody]TodoItem item)
        {
            var existing = TodoItems.FirstOrDefault(x => x.Id == id);
            existing.Name = item.Name;
            existing.IsDone = item.IsDone;
            existing.UpdateDate = item.UpdateDate;
        }

        public void DeleteItem(int id)
        {
            var existing = TodoItems.FirstOrDefault(x => x.Id == id);
            TodoItems.Remove(existing);
        }

public void SyncItems(IEnumerable<TodoItem> items)
{
    foreach (var item in items)
    {
        if (item.Id <= 0)
        {
            AddItem(item);
        }
        else
        {
            UpdateItem(item.Id, item);
        }
    }
    var deleted = TodoItems.Where(x => items.All(y => y.Id != x.Id));
    foreach(var item in deleted){
        TodoItems.Remove(item);
    }
}
    }
}