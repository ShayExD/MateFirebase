using MateServerSide.Models.DAL;
using System.Diagnostics.Metrics;

namespace MateServerSide.Models
{
    public class User
    {
        
        public User()
        {

        }
        public User(int id, string fullname, string password, string introduction, char gender, int age, string instagram, string email, string phoneNumber, string profileImage, string city, List<string> travelPlan, List<string> tripInterests)
        {
            Id = id;
            Fullname = fullname;
            Password = password;
            Introduction = introduction;
            Gender = gender;
            Age = age;
            Instagram = instagram;
            Email = email;
            PhoneNumber = phoneNumber;
            ProfileImage = profileImage;
            City = city;
            TripInterests = tripInterests;
            TravelPlan= travelPlan;
        }

        public int Id { get; set; }
        public string Fullname { get; set; }
        public string Password { get; set; }
        public string Introduction { get; set; }
        public char Gender { get; set; }
        public int Age { get; set; }
        public string Instagram { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string ProfileImage { get; set; }
        public string City { get; set; }
        public List<string> TravelPlan { get; set; }
        //public List<Trip> CreatedTrips { get; set; }
        //public List<Trip> JoinToTrips { get; set; }
        public List<string> TripInterests { get; set; }
        public static List<User> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadUsers();// - needs Implements on dbServices
        }

        public static bool Registration(string email, string password)
        {
            DBservices dbs = new DBservices();
            return dbs.Register(email, password);

        }

        public static User Login(string email, string password)
        {
            DBservices dbs = new DBservices();
            return dbs.Login(email, password);


        }

        public static bool Update(User user)
        {
            DBservices dbs = new DBservices();
            return dbs.UpdateUser(user); // - needs Implements on dbServices return num of rows affected

        }

        //public static bool DeleteById(int id)
        //{
        //    DBservices dbs = new DBservices();
        //    try
        //    {
        //        dbs.DeleteUserById(id);
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception("doesnt exist user with this id");

        //    }
        //}


    }



}
