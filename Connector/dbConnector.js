const {connect}=require("mongoose");
const dbConnector=(url)=>{
    return connect(url);
}
module.exports=dbConnector;