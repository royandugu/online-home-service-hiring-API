## For front end
1. `/api/V1/sendOtp` <- POST request to sms the OTP to user's number
2. `/api/V1/validateOtp` <- POST request to validate the user entered OTP
3. `/api/V1/register` <- POST request to register a new user 
4. `/api/V1/login` <- POST request to login an existing user

## Note <Registration>
1. Firstly the phone number is validated through OTP
2. Then the name and email is entered by the user along with the password

## System flow (User opens the application for the first time) 

Step-1 <br>

User opens the application, there a phone number entering input box is present.
They enter their number and press the submit button. Here the API calls the route
where sendPhoneOtp is present. There the phone otp is sent to the user through SMS.
Now an OTP entering interface is displayed to the user. They enter the OTP and as they
press the submit button, the application makes call to another route in the API where validatePhoneOtp 
is present. If the OTP is invalid then AuthenticationError is thrown by the API. Now if it is valid
then user is moved to the register section. Here user enters their firstName, lastName, password and email(optional). If user doesnot enter their email then their account is created. Somehow if user enters the 
email and it matches the format, then API emails them another OTP and user is redirected to OTP entering page. Here the user has to enter the OTP mailed to their entered email. If it is correct then their account is created.  

## Todo
1. Add the controllers to the routes and then console the OTP. Check if the OTP validation works
2. Test 1:- Check SOCIAIR API data format for phone number. Plus check axios