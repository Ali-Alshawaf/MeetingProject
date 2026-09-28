namespace MeetingProject.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;

        public string MidName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string MobileNumber { get; set; } = string.Empty;
    }
}
