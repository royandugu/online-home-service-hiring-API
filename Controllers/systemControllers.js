const sortOnReviews = async (req, res) => {
    const { address, review, sort } = req.query; //?address=123
    const queryObject = {};

    if(address) queryObject.address=address;
    if(review) queryObject.review={ $eq: parseInt(price) }
    const result = WorkerModel.find(queryObject);

    if (sort) {
        const sortArray = sort.split(',').join(' ');
        result.sort(sortArray);
    }
    if (field) {
        const fieldArray = field.split(',').join(' ');
        result.select(fieldArray);
    }

    // ? review >=5
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result.skip(skip).limit(limit);

    if (review) {
        //Numeric filters setup
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
    const products = await result;
    res.status(200).json({ noOfProducts: products.length, pageNo: page, data: products });
}