export const getIdByDate = ():string => {
    let date = new Date()
    let sDate = date.toLocaleDateString()
    let sTime = date.toLocaleTimeString()
    return sDate + ' ' + sTime
}