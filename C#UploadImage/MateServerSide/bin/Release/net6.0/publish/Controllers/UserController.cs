using MateServerSide.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MateServerSide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public IEnumerable <User> Get()
        {
            return Models.User.Read();
        }

        [HttpPost("Register")]
        public bool Post(string email, [FromBody] string password)
        {
            return Models.User.Registration(email,password);

        }
 

        [HttpPost("Login")]
        public User LogIn(string email, [FromBody] string password)
        {
            return Models.User.Login(email, password);//אם יחזור יחזיר יוזר 
        }

        [HttpPut("UpdateUser")]
        public bool Put([FromBody] Models.User user)
        {
            return Models.User.Update(user);
        }
        //// DELETE api/<UserController>/5
        //[HttpDelete("{id}")]
        //public Object Delete(int id)
        //{
        //    return Models.User.DeleteById(id);
        //}


        // GET: api/<UserController>

    }
}
