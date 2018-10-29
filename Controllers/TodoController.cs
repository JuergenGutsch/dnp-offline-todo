using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using OfflineToDo.Models;
using OfflineToDo.Repositories;

namespace OfflineToDo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : Controller
    {
        private readonly ITodoRepository _todoRepository;

        public TodoController(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        [HttpGet()]
        public ActionResult<IEnumerable<TodoItem>> Get()
        {
            return _todoRepository.AllItems().ToList();
        }

        [HttpPost()]
        public IActionResult Post(TodoItem item)
        {
            var id = _todoRepository.AddItem(item);

            return CreatedAtRoute("Get", new { id = id }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, TodoItem item)
        {
            _todoRepository.UpdateItem(id, item);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _todoRepository.DeleteItem(id);
            return NoContent();
        }
    }
}
