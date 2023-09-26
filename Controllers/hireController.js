const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../Error_Handlers/badRequestError");
const hiringModel = require("../Models/hiringRecords");

const addHiringRecord = async (req, res) => {
    const { user_id, worker_id, serviceDate, serviceCost } = req.body;

    if (!user_id) throw new BadRequestError("User ID is not present");
    if (!worker_id) throw new BadRequestError("Worker ID is not present");
    if (!serviceDate) throw new BadRequestError("Service date is not present");
    if (!serviceCost) throw new BadRequestError("Service cost should be present");

    const hireRecords = await hiringModel.create({ ...req.body });
    res.status(StatusCodes.OK).json({ hireRecords: hireRecords });
}
const allHiringRecords = async (req, res) => {
    const UserModel = require("../Models/userModel");
    const WorkerModel = require("../Models/workerModel");
    console.log("i amm called")
    try {
        const hireRecords = await hiringModel.find({});
        const detail = [];

        // Use Promise.all to wait for all dataMaker calls to complete
        await Promise.all(hireRecords.map(async (record, i) => {
            const userData = await UserModel.findOne({ _id: record.user_id });
            const workerData = await WorkerModel.findOne({ _id: record.worker_id });

            const obj = {
                _id: record._id,
                userData,
                workerData,
                serviceDate: record.serviceDate,
                completed: record.completed,
                settled: record.settled
            };
            console.log(obj);

            detail[i] = obj;
        }));


        res.status(StatusCodes.OK).json({ hireRecords: detail });
    } catch (error) {
        // Handle errors here
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

const viewHistory = async (req, res) => {
    const { user_id } = req.params;

    const hireRecords = await hiringModel.find({ user_id: user_id });

    res.status(StatusCodes.OK).json({ hireRecords: hireRecords });
}

const workCompleted = async (req, res) => {
    const { record_id } = req.params;

    const hireRecords = await hiringModel.findOneAndUpdate({ _id: record_id }, { completed: true }, { new: true, runValidators: true });
    res.status(StatusCodes.OK).json({ hireRecords: hireRecords });
}

const settleCompleted = async (req, res) => {
    const { record_id } = req.params;

    const UserModel = require("../Models/userModel");
    const WorkerModel = require("../Models/workerModel");
    

    const hireRecord = await hiringModel.findOneAndUpdate({ _id: record_id }, { settled: true }, { new: true, runValidators: true });

    try {
        const userData = await UserModel.findOne({ _id: hireRecord.user_id });
        const workerData = await WorkerModel.findOne({ _id: hireRecord.worker_id });

        const obj = {
            _id: hireRecord._id,
            userData,
            workerData,
            serviceDate: hireRecord.serviceDate,
            completed: hireRecord.completed,
            settled: hireRecord.settled
        };



        res.status(StatusCodes.OK).json({ hireRecords: obj });
    } catch (error) {
        // Handle errors here
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }

    res.status(StatusCodes.OK).json({ hireRecords: hireRecords });
}
module.exports = { addHiringRecord, viewHistory, workCompleted, settleCompleted, allHiringRecords };