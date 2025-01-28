1.//////////// User Register ///////////
//POST
http://localhost:8000/api/users/register

{
  "name": "Bruce Wayne",
  "email": "brucewayne156@gmail.com",
  "password": "Manish@123",
  "role": "hr"
}


2.//////////// User Login ///////////
///POST
http://localhost:8000/api/users/login

{
  "email": "amanyadav51@gmail.com",
  "password": "Manish@123"
}

=======result=======
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQnJ1Y2UgV2F5bmUiLCJyb2xlIjoiaHIiLCJpYXQiOjE3Mzc3NDcyNjAsImV4cCI6MTczNzc1MDg2MH0.ZiZL_jWYXFrSdM1xMY1KEObH1aRgGMveIDccp1VYV74",
    "role": "hr"
}


3.//////////// User Login ///////////
///GET
http://localhost:8000/api/users/me or hr-details, admin-details, superadmindetails {permissions based}

-----copy the login token then paste in Authorization--> (token)

=======result=======

{
    "message": "User details fetched successfully",
    "user": {
        "name": "Bruce Wayne",
        "email": "brucewayne156@gmail.com",
        "role": "hr"
    }
}


4.//////////// User Login ///////////
///PUT
http://localhost:8000/api/users/update-user/67937d122a794103fcc77e5d --> (any user id, )

-----copy the login token then paste in Authorization--> (token)

//Body
{
  "name": "Bruce Wayne",
  "email": "brucewayne156@gmail.com",
  "password": "Manish@123",
  "role": "hr"  // Only superadmins can change role
}

=======result=======
result according to roles{superadmin full access}


5.//////////// User Delete ///////////
///Delete
http://localhost:8000/api/users/delete-user/67937d122a794103fcc77e5d --> (any user id, )

-----copy the login token then paste in Authorization--> (token) --> (Permission only for superadmin)


6.//////////// User GetAll ///////////
///Get 
http://localhost:8000/api/users/getall-user-details

-----copy the login token then paste in Authorization--> (token) --> (Permission based see profile).
{this is admin token and admin seen all user and hr profile}
=======result=======

{
    "message": "Admin and HR details fetched successfully",
    "users": [
        {
            "name": "Manish Kr Singh",
            "email": "manish123@gmail.com",
            "role": "user"
        },
        {
            "name": "Ayush Shekhar",
            "email": "ayushshekhar0001@gmail.com",
            "role": "user"
        },
        {
            "name": "Dheeraj Verma",
            "email": "dheerajverma09@gmail.com",
            "role": "hr"
        },
        {
            "name": "Bruce Wayne",
            "email": "brucewayne156@gmail.com",
            "role": "hr"
        }
    ]
}