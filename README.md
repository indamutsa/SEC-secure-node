In this module, we will hash and validate the password using bcrypt. We would like to ensure that the password is hashed and stored securely in the database. We will use mongo pre-hook savers to hash the password before saving it to the database and then bcrypt compare method to validate the password.

![alt text](image/home.png)

We will see how we register a user and then hash the password before saving it to the database. We will use the bcrypt compare method to validate the password. If the password is valid, we will return the user details. If the password is invalid, we will return an error message.

![alt text](image/registration.png)
![alt text](image/hashed.png)
