using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
namespace MateServerSide.Models.DAL
{
    public class DBservices
    {
        public DBservices()
        {

        }

        //------User Services------//
        public List<User> ReadUsers()
        {

            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }


            cmd = CreateCommandWithStoredProcedure("SP_Get_All_Users", con, null);             // create the command


            List<User> userList = new List<User>();

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (dataReader.Read())
                {
                    User user = new User();
                    user.Id = Convert.ToInt32(dataReader["id"]);
                    user.Fullname = dataReader["fullname"] == DBNull.Value ? "" : dataReader["fullname"].ToString();
                    user.Password = dataReader["password"] == DBNull.Value ? "" : dataReader["password"].ToString();
                    user.Introduction = dataReader["introduction"] == DBNull.Value ? "" : dataReader["introduction"].ToString();
                    user.Gender = dataReader["gender"] == DBNull.Value ? ' ' : Convert.ToChar(dataReader["gender"]);
                    user.Age = dataReader["age"] == DBNull.Value ? 0 : Convert.ToInt32(dataReader["age"]);
                    user.Instagram = dataReader["instagram"] == DBNull.Value ? "" : dataReader["instagram"].ToString();
                    user.Email = dataReader["email"] == DBNull.Value ? "" : dataReader["email"].ToString();
                    user.PhoneNumber = dataReader["phoneNumber"] == DBNull.Value ? "" : dataReader["phoneNumber"].ToString();
                    user.ProfileImage = dataReader["profileImage"] == DBNull.Value ? "" : dataReader["profileImage"].ToString();
                    user.City = dataReader["city"] == DBNull.Value ? "" : dataReader["city"].ToString();

                    // Assuming travelPlan and tripInterests are stored as comma-separated values in the database
                    string travelPlanStr = dataReader["travelPlan"] == DBNull.Value ? "" : dataReader["travelPlan"].ToString();
                    string tripInterestsStr = dataReader["tripInterests"] == DBNull.Value ? "" : dataReader["tripInterests"].ToString();
                    List<string> travelPlanList = new List<string>(travelPlanStr.Split(','));
                    List<string> tripInterestsList = new List<string>(tripInterestsStr.Split(','));

                    user.TravelPlan = travelPlanList;
                    user.TripInterests = tripInterestsList;
                    userList.Add(user);

                }
                return userList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

        //public User GetUserById(int id)
        //{

        //    SqlConnection con;
        //    SqlCommand cmd;

        //    try
        //    {
        //        con = connect("myProjDB"); // create the connection
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
        //    paramDic.Add("@id", id);

        //    cmd = CreateCommandWithStoredProcedure("SP_Get_User_By_Id", con, paramDic);             // create the command

        //    User user = new User();


        //    try
        //    {

        //        SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

        //        while (dataReader.Read())
        //        {
        //            user.Id = Convert.ToInt32(dataReader["id"]);
        //            user.Country = dataReader["country"].ToString();
        //            user.Email = dataReader["email"].ToString();
        //            user.Password = dataReader["password"].ToString();
        //            user.PhoneNumber = dataReader["phoneNumber"].ToString();
        //        }
        //        return user;
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    finally
        //    {
        //        if (con != null)
        //        {
        //            // close the db connection
        //            con.Close();
        //        }
        //    }

        //}

        //public User LogIn(string email,string password)
        //{

        //    SqlConnection con;
        //    SqlCommand cmd;

        //    try
        //    {
        //        con = connect("myProjDB"); // create the connection
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
        //    paramDic.Add("@email", email);
        //    paramDic.Add("@password", password);


        //    cmd = CreateCommandWithStoredProcedure("Sp_Login_User", con, paramDic);             // create the command

        //    User user = new User();


        //    try
        //    {

        //        SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

        //        while (dataReader.Read())
        //        {
        //            user.Id = Convert.ToInt32(dataReader["id"]);
        //            user.Country = dataReader["country"].ToString();
        //            user.Email = dataReader["email"].ToString();
        //            user.Password = dataReader["password"].ToString();
        //            user.PhoneNumber = dataReader["phoneNumber"].ToString();
        //        }
        //        if (user.Email == null)
        //        {
        //            throw new Exception("User Doesnt exits");
        //        }
        //        return user;
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    finally
        //    {
        //        if (con != null)
        //        {
        //            // close the db connection
        //            con.Close();
        //        }
        //    }

        //}

        //public bool Insert(User user)
        //{

        //    SqlConnection con;
        //    SqlCommand cmd;

        //    try
        //    {
        //        con = connect("myProjDB"); // create the connection
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
        //    paramDic.Add("@country", user.Country);
        //    paramDic.Add("@email", user.Email);
        //    paramDic.Add("@password", user.Password);
        //    paramDic.Add("@phoneNumber", user.PhoneNumber);


        //    cmd = CreateCommandWithStoredProcedure("SP_Insert_User", con, paramDic);             // create the command

        //    try
        //    {
        //        int numEffected = cmd.ExecuteNonQuery(); // execute the command
        //        /*int numEffected = Convert.ToInt32(cmd.ExecuteScalar());*/ // returning the id
        //        return numEffected == 1 ;
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    finally
        //    {
        //        if (con != null)
        //        {
        //            // close the db connection
        //            con.Close();
        //        }
        //    }

        //}

        //public bool UpdateUser(User user)
        //{

        //    SqlConnection con;
        //    SqlCommand cmd;

        //    try
        //    {
        //        con = connect("myProjDB"); // create the connection
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
        //    paramDic.Add("@id", user.Id);
        //    paramDic.Add("@country", user.Country);
        //    paramDic.Add("@email", user.Email);
        //    paramDic.Add("@password", user.Password);
        //    paramDic.Add("@phoneNumber", user.PhoneNumber);


        //    cmd = CreateCommandWithStoredProcedure("Sp_Update_User_By_Id", con, paramDic);             // create the command

        //    try
        //    {
        //        int numEffected = cmd.ExecuteNonQuery(); // execute the command
        //        //int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
        //        return numEffected==1;
        //    }

        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    finally
        //    {
        //        if (con != null)
        //        {
        //            // close the db connection
        //            con.Close();
        //        }
        //    }

        //}

        //public int DeleteUserById(int id)
        //{

        //    SqlConnection con;
        //    SqlCommand cmd;

        //    try
        //    {
        //        con = connect("myProjDB"); // create the connection
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
        //    paramDic.Add("@id", id);





        //    cmd = CreateCommandWithStoredProcedure("SP_Delete_User_By_Id", con, paramDic);             // create the command

        //    try
        //    {
        //        // int numEffected = cmd.ExecuteNonQuery(); // execute the command
        //        int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
        //        return numEffected;
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }

        //    finally
        //    {
        //        if (con != null)
        //        {
        //            // close the db connection
        //            con.Close();
        //        }
        //    }

        //}

        public bool Register(string email,string password)
        {

            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@email", email);
            paramDic.Add("@password", password);


            cmd = CreateCommandWithStoredProcedure("SP_Register_User", con, paramDic);             // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                /*int numEffected = Convert.ToInt32(cmd.ExecuteScalar());*/ // returning the id
                return numEffected == 1;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

        public User Login(string email, string password)
        {

            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@email", email);
            paramDic.Add("@password", password);


            cmd = CreateCommandWithStoredProcedure("SP_Login_User", con, paramDic);             // create the command

            User user = new User();


            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (dataReader.Read())
                {
                    user.Id = Convert.ToInt32(dataReader["id"]);
                    user.Fullname = dataReader["fullname"] == DBNull.Value ? "" : dataReader["fullname"].ToString();
                    user.Password = dataReader["password"] == DBNull.Value ? "" : dataReader["password"].ToString();
                    user.Introduction = dataReader["introduction"] == DBNull.Value ? "" : dataReader["introduction"].ToString();
                    user.Gender = dataReader["gender"] == DBNull.Value ? ' ' : Convert.ToChar(dataReader["gender"]);
                    user.Age = dataReader["age"] == DBNull.Value ? 0 : Convert.ToInt32(dataReader["age"]);
                    user.Instagram = dataReader["instagram"] == DBNull.Value ? "" : dataReader["instagram"].ToString();
                    user.Email = dataReader["email"] == DBNull.Value ? "" : dataReader["email"].ToString();
                    user.PhoneNumber = dataReader["phoneNumber"] == DBNull.Value ? "" : dataReader["phoneNumber"].ToString();
                    user.ProfileImage = dataReader["profileImage"] == DBNull.Value ? "" : dataReader["profileImage"].ToString();
                    user.City = dataReader["city"] == DBNull.Value ? "" : dataReader["city"].ToString();

                    // Assuming travelPlan and tripInterests are stored as comma-separated values in the database
                    string travelPlanStr = dataReader["travelPlan"] == DBNull.Value ? "" : dataReader["travelPlan"].ToString();
                    string tripInterestsStr = dataReader["tripInterests"] == DBNull.Value ? "" : dataReader["tripInterests"].ToString();
                    List<string> travelPlanList = new List<string>(travelPlanStr.Split(','));
                    List<string> tripInterestsList = new List<string>(tripInterestsStr.Split(','));

                    user.TravelPlan = travelPlanList;
                    user.TripInterests = tripInterestsList;
                }
                if (user.Email == null)
                {
                    throw new Exception("User Doesnt exits");
                }
                return user;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

        public bool UpdateUser(User user)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@id", user.Id);
            paramDic.Add("@fullname", user.Fullname);
            paramDic.Add("@password", user.Password);
            paramDic.Add("@introduction", user.Introduction);
            paramDic.Add("@gender", user.Gender);
            paramDic.Add("@age", user.Age);
            paramDic.Add("@instagram", user.Instagram);
            paramDic.Add("@email", user.Email);
            paramDic.Add("@phoneNumber", user.PhoneNumber);
            paramDic.Add("@profileImage", user.ProfileImage);
            paramDic.Add("@city", user.City);
            string travelPlanString = string.Join(",", user.TravelPlan);
            string tripInterestsString = string.Join(",", user.TripInterests);

            // Add the serialized strings to the dictionary
            paramDic.Add("@travelPlan", travelPlanString);
            paramDic.Add("@tripInterests", tripInterestsString);
          
            cmd = CreateCommandWithStoredProcedure("SP_Update_User_By_Id", con, paramDic); // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected == 1;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }


        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }


        private SqlCommand CreateCommandWithStoredProcedure(String spName, SqlConnection con, Dictionary<string, object> paramDic)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            if (paramDic != null)
                foreach (KeyValuePair<string, object> param in paramDic)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);

                }


            return cmd;
        }
    }
}
