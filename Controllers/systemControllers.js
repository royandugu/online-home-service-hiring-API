const OtpModel = require("../Models/phoneOtp");
const WorkerModel=require("../Models/workerModel");
const BadRequestError = require("../Error_Handlers/badRequestError");
const { StatusCodes } = require("http-status-codes");

const getWorkers = async (req, res) => {
    const { address, sort , field, numericFilters} = req.query; 
    //sort = review sort = price
    
    const queryObject={};

    if (address) queryObject.address = address;
    if (field) queryObject.field=field;

    const result = WorkerModel.find({...queryObject});
    
    if(sort){
        const sortArray=sort.split(",").join(" ");
        result.sort(sortArray);
    }
    if(numericFilters){
        const operationMap={
            ">=":"$gte",
            "<=":"$lte",
            ">":"$gt",
            "<":"$lt",
            "=":"$eq"
        }
        const $regEx=/\b(>=|<=|>|<|=)\b/g;
        const filters=numericFilters.replace($regEx,(match)=>`-${operationMap[match]}-`);
        const options=["serviceCost","avgReview"];
        filters.split(',').forEach((comp)=>{
            const [field,operator,value] = comp.split('-');
            if(options.includes(field)) queryObject[field]={[operator]:parseInt([value])};
            result.find(queryObject);
        })
    }

    const workers = await result;
    res.status(200).json({ workers:workers});
    
}

const sendPhoneOtp = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) throw new BadRequestError("Missing phone number");
    else if (phoneNumber.length != 10) throw new BadRequestError("Invalid phone number provided");

    const information = await OtpModel.find({ phoneNumber: phoneNumber });
    const otpGenerator=require("otp-generator");
    const phoneOtp = otpGenerator.generate(6);

    //Token
    const apiToken = "Bearer " + process.env.API_TOKEN;

    //options setup
    const options = {
        method: 'POST',
        headers: {
            "Authorization": apiToken,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "message": `${phoneOtp} is your Gharmai-register verification code`,
            "mobile": phoneNumber
        })
    }

    //Senting the request to sociair API
    const sociFetcher = async () => {
        const data = await fetch(process.env.SOCI_URL, options);
        const response = await data.json();
        return response;
    }
    const response = await sociFetcher();
    if (response.message === "Sorry! SMS could not be sent. Invalid mobile number") return res.status(StatusCodes.BAD_REQUEST).json({ message: response.message });
    else if (response.message === "Unauthenticated") return res.status(StatusCodes.UNAUTHORIZED).json({ message: response.message });
    else if (response.message === "Success! SMS has been sent") {
        if (information.length === 0) await OtpModel.create({ otp: phoneOtp, phoneNumber: phoneNumber });
        else {
            await OtpModel.findOneAndUpdate({ phoneNumber: phoneNumber }, { otp: phoneOtp }, { new: true, runValidators: true });
        }
        res.status(StatusCodes.OK).json({ message: response.message, phoneNumber: phoneNumber })
    }
    else return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Unknown error occured while posting data to SOCI AIR API" })
}

const validatePhoneOtp = async (req, res) => {
    const { userOtp, phoneNumber } = req.body;

    if (!userOtp) throw new BadRequestError("The OTP is not present");
    if (userOtp.length != 6) throw new BadRequestError("Invalid OTP format");
    if (!phoneNumber) throw new BadRequestError("Phone number not avaliable");
    if (phoneNumber.length != 10) throw new BadRequestError("Invalid phone number");

    const actualOtp = await OtpModel.findOne({ phoneNumber: phoneNumber }); //get the OTP from the session
    const isValid = actualOtp.isValid();


    if (!isValid) throw new AuthenticationError("The OTP provided has already expired");

    if (userOtp === actualOtp.otp) {
        actualOtp.expireOtp();
        return res.status(StatusCodes.OK).json({ message: "Otp validated", phoneNumber: phoneNumber });
    }
    else throw new AuthenticationError("The provided OTP doesnot match with the one assigned to you");
}

const hiringRequestController=async (req,res)=>{
    const {id}=req.params;
    const {userId,firstName}=req.body;

    const worker=await WorkerModel.findOne({_id : id});

    if(!worker) throw new BadRequestError("Invalid worker hiring request");
    if(worker.status === "busy" || worker.status === "dontDisturb") throw new BadRequestError("You cannot hire busy or dontDisturb workers");
   

    worker.notifications=[...worker.notifications , {id:userId , message:`${firstName} has requested you for service`}]
    await worker.save();

    res.status(StatusCodes.OK).json({message: "The worker has been notified"});
}

const hireConfirmationController=async (req,res)=>{
    const HireRecordModel=require("../Models/hiringRecords");

    const {user_id , worker_id , serviceDate}=req.body;


    if(!user_id) throw new BadRequestError("User id must be present");
    if(!worker_id) throw new BadRequestError("Worker id must be present");
    if(!serviceDate) throw new BadRequestError("Service date must be present");

    const hireRecord=await HireRecordModel.create({...req.body});

    res.status(StatusCodes.CREATED).json({message:"Hire accepted", hireRecord:hireRecord});
}

const searchDetails=()=>{
    
}

module.exports = { sendPhoneOtp, validatePhoneOtp, getWorkers, hiringRequestController,hireConfirmationController}