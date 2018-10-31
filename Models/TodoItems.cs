namespace OfflineToDo.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDone { get; set; }

        public override string ToString()
        {
            return $"({Id}) {Name} {IsDone}";
        }
    }
}
