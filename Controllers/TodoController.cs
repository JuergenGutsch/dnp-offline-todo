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

        [HttpGet("{id}")]
        public ActionResult<TodoItem> Get(int id)
        {
            return _todoRepository.AllItems().First(x => x.Id == id);
        }

        [HttpPost()]
        public IActionResult Post(TodoItem item)
        {
            _todoRepository.AddItem(item);

            return NoContent();
        }


        [HttpPost("sync")]
        public IActionResult PostSync(IEnumerable<TodoItem> items)
        {
            _todoRepository.SyncItems(items);

            return NoContent();
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

        [HttpGet("ping")]
        public ActionResult<object> Ping()
        {
            return new { Success = true };
        }
    }
}
