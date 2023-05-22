const OtpModel = require("../Models/phoneOtp");
const BadRequestError = require("../Error_Handlers/badRequestError");

const getWorker = async (req, res) => {
    const { address, numericFilters} = req.query;

    if (address) queryObject.address = address;

    if (numericFilters) {
        const operationMap = {
            ">=": "$gte",
            "<=": "$lte",
            ">": "$gt",
            "<": "$lt",
            "=": "$eq"
        }
        const $regEx = /\b(>=|<=|>|<|=)\b/g;
        const filters = numericFilters.replace($regEx, (match) => `-${operationMap[match]}-`);
        const options = ["rating"];
        filters.split(',').forEach((comp) => {
            const [field, operator, value] = comp.split('-');
            if (options.includes(field)) queryObject[field] = { [operator]: parseInt([value]) };
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


// const sortOnReviews = async (req, res) => {
//     const { address, review, sort } = req.query; //?address=123
//     const queryObject = {};

//     if(address) queryObject.address=address;
//     if(review) queryObject.review={ $eq: parseInt(price) }
//     const result = WorkerModel.find(queryObject);

//     if (sort) {
//         const sortArray = sort.split(',').join(' ');
//         result.sort(sortArray);
//     }
//     if (field) {
//         const fieldArray = field.split(',').join(' ');
//         result.select(fieldArray);
//     }

//     // ? review >=5
//     const limit = parseInt(req.query.limit) || 10;
//     const page = parseInt(req.query.page) || 1;
//     const skip = (page - 1) * limit;
//     result.skip(skip).limit(limit);

//     if (review) {
//         //Numeric filters setup
//         const operationMap = {
//             ">=": "$gte",
//             "<=": "$lte",
//             ">": "$gt",
//             "<": "$lt",
//             "=": "$eq"
//         }
//         const $regEx = /\b(>=|<=|>|<|=)\b/g;
//         const filters = numericFilters.replace($regEx, (match) => `-${operationMap[match]}-`);
//         const options = ["rating"];
//         filters.split(',').forEach((comp) => {
//             const [field, operator, value] = comp.split('-');
//             if (options.includes(field)) queryObject[field] = { [operator]: parseInt([value]) };
//             result.find(queryObject);
//         })
//     }
//     const products = await result;
//     res.status(200).json({ noOfProducts: products.length, pageNo: page, data: products });
// }

module.exports = { sendPhoneOtp, validatePhoneOtp, getWorker}