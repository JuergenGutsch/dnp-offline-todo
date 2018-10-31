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
    }
    public class TodoRepository : ITodoRepository
    {
        public TodoRepository()
        {
            var i = 1;
            GenFu.GenFu.Configure<TodoItem>()
                .Fill<int>(c => c.Id, () => { return i++; });

            Items = A.ListOf<TodoItem>(14);
        }

        private ICollection<TodoItem> Items { get; set; }

        public IEnumerable<TodoItem> AllItems()
        {
            return Items;
        }

        public TodoItem Item(int id)
        {
            return Items.FirstOrDefault(x => x.Id == id);
        }

        public int AddItem([FromBody]TodoItem item)
        {
            var newId = Items.Max(x => x.Id) + 1;
            item.Id = newId;
            Items.Add(item);
            return newId;
        }

        public void UpdateItem(int id, [FromBody]TodoItem item)
        {
            var existing = Items.FirstOrDefault(x => x.Id == id);
            existing.Name = item.Name;
            existing.IsDone = item.IsDone;
        }

        public void DeleteItem(int id)
        {
            var existing = Items.FirstOrDefault(x => x.Id == id);
            Items.Remove(existing);
        }
    }
}