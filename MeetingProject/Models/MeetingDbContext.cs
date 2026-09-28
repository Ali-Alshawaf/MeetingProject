using Microsoft.EntityFrameworkCore;

namespace MeetingProject.Models
{
    public class MeetingDbContext : DbContext
    {
        public MeetingDbContext(DbContextOptions<MeetingDbContext> options ):base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
