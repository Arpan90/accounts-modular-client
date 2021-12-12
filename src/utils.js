export const convertToFy = (year) =>{
    return `${year}-${Number(year+1)}` ;
}
export const convertFromFy = (fy) =>{
    return fy.split('-')[0];
}

export const determineFy = (date) =>{
    let breakdown = date.split('-');
    let year = Number(breakdown[0]);
    let month = Number(breakdown[1]);
    if(month < 4){
        console.log("determineFy: ", `${year - 1}-${year}`);
        return `${year - 1}-${year}`; 
    }
    console.log("determineFy: ", `${year}-${year + 1}`);
    return `${year}-${year + 1}`;
}

export const determineYearWithDate = (fy, date) =>{
    let month = Number(date.split('-')[1]);
    let yearIndex = 0;
    if(month < 4){
        yearIndex = 1;
    }
    return `${fy.split('-')[yearIndex]}-${monthAndDay(date)}`;
}

export const monthAndDay = (date, val = 1) => {
    let breakdown = date.split('-')
    breakdown.shift();
    if(val === -1){
        return [breakdown[1], breakdown[0]].join('-');
    }
    return breakdown.join('-');
}

export const dbDateToFullDate = (year, dbDate) =>{
    let breakdown = dbDate.split('-');
    let month = Number(breakdown[1]);
    let yearArr = year.split('-');
    return `${ month < 4 ? yearArr[1] : yearArr[0] }-${[breakdown[1], breakdown[0]].join('-')}`;
}

export const dayWithMonthNameHandler = (dbDate) =>{
    const MONTHS = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    };
    Object.freeze(MONTHS);
    console.log("test dbdate split: ", dbDate);
    let breakdown = dbDate.split("-")
    console.log("test utils: ", dbDate, breakdown);
    return `${breakdown[0]}-${MONTHS[breakdown[1]]}`;
}
