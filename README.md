
## ADMIN 

Login : `localhost:5000/api/V1/admin/login` {
    request : POST 
    req.body{phoneNumber , password}
}
AllChats : `localhost:5000/api/V1/admin/chats` {
    request : GET
}


## SYSTEM
SendOtp : `localhost:5000/api/V1/system/sendOtp`{
    request:POST
    req.body{phoneNumber}
}
ValidateOtp : `localhost:5000/api/V1/system/validateOtp`{
    request:POST
    req.body{userEnteredOTP,phoneNumber}
}
GetSpecificChat: `localhost:5000/api/V1/system/chat?user_id = & worker_id=`{
    request:GET
}
CreateChat: `localhost:5000/api/V1/system/chat/`{
    request:POST
    req.body{user_id , worker_id , sender_id , reciever_id , data}
}

## USER
register: `localhost:5000/api/V1/users/register`{
    request:POST
    req.body{firstName,lastName,phoneNumber,address,password}
}
login: `localhost:5000/api/V1/users/login`{
    request:POST
    req.body{phoneNumber,password}
}
editDetails: `localhost:5000/api/V1/users/editDetails/:id`{
    request:POST
    req.body{details ... }
}
hireRequest : `localhost:5000/api/V1/users/hire/:id`{
    request:POST
    req.body{user_id,firstName}
}
individualUser: `localhost:5000/api/V1/users/:id`{
    request;GET
}

## Worker
GetWorker: `localhost:5000/api/V1/worker/getWorkers`{
    request:GET
    queries:{
        address=add, 
        sort=review or cost or both, 
        field=fied,
        numericFilters=cost>500 
    }    
}
indvWorker: `localhost:5000/api/V1/worker/:id`{
    request: GET
}
Register: `localhost:5000/api/V1/worker/register`{
    request:POST
    req.body{firstName,lastName,phoneNumber,field,address,password,workRegistryNumber,companyName,startDate,endDate,skillsLearned}
}
Login: `localhost:5000/api/V1/worker/login`{
    request:POST
    req.body{password,phoneNumber}
}
EditDetails: `localhost:5000/api/V1/worker/editDetails/:id`{
    request:POST
    req.body{...editTerms}
}
AcceptHire: `localhost:5000/api/V1/worker/acceptHire`{
    request:POST
    req.body{user_id , worker_id , serviceDate}
}

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

## Token plan

## Next commit 
1. Different gmail account for Gharaima and it's id and all for email
2. Figure out a way to find out how to add html (if possible react) to the email sending



NOTE: Fix the throw thingy. Then test all possibilities in sendOtp and validateOtp
