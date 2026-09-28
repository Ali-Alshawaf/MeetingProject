using MeetingProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetingProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MeetingDbContext _context;
        public UserController(MeetingDbContext context) {
            _context = context;
        
        }
        [HttpGet]
        public async Task<List<User>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            return users;

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);

            if (user == null) { 
            return NotFound();
            }


            return Ok(user);

        }

        [HttpPost]
        public async Task<IActionResult> AddUser(User u)
        {
            var user = new User()
            {
                FirstName = u.FirstName,
                MidName = u.MidName,
                LastName = u.LastName,
                MobileNumber = u.MobileNumber,
            };

            await _context.Users.AddAsync(user);
            return Ok(user);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(User user)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Id == user.Id);

            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.FirstName = user.FirstName;
            existingUser.MidName = user.MidName;
            existingUser.LastName = user.LastName;
            existingUser.MobileNumber = user.MobileNumber;

            await _context.SaveChangesAsync();

            return Ok(existingUser);
        }


        [HttpDelete]
        public void DeleteUser(int id) { 
        var user = _context.Users.SingleOrDefault(u => u.Id == id);

            if (user != null)
            {

                _context.Users.Remove(user);
            }
        
        }


    }
}
