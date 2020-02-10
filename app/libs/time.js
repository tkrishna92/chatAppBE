const moment = require('moment');
const momentTz = require('moment-timezone');
const timeZone = "Asia/Calcutta";

let now = () =>{
    console.log("time . now called");
    return moment().utc().format();
}


let getLocalTime = () =>{
    console.log(moment().format());
    return moment().format();
}

let convertTimeToLocalTime = (time) =>{
    console.log("time . convert local time called");
    return momentTz.tz(time, timeZone).format('LLLL');
}

module.exports = {
    timeNow : now,
    LocalTime : getLocalTime,
    convertTimeToLocal : convertTimeToLocalTime
}