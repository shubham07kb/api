function str(a) {
    return a.toString();
}
function inFixedStr(a, b) {
    if (typeof a !== 'string') {
        a = str(a);
    }
    if (typeof a === 'string') {
        while (a.length < b) {
            a = '0' + a;
        }
    }
    return a
}
function getDate(a=0) { 
    var cdate = new Date();
    cdate = new Date(cdate.getTime() + (a + cdate.getTimezoneOffset()) * 60000);
    cdate = { year: cdate.getFullYear(), month: cdate.getMonth() + 1, day: cdate.getDay(), date: cdate.getDate(), hour: cdate.getHours(), minute: cdate.getMinutes(), second: cdate.getSeconds(), millisecond: cdate.getMilliseconds() };
    cdate = { inNumber: { year: cdate.year, month: cdate.month, day: cdate.day, date: cdate.date, hour: cdate.hour, minute: cdate.minute, second: cdate.second, millisecond: cdate.millisecond }, inString: { year: str(cdate.year), month: str(cdate.month), day: str(cdate.day), date: str(cdate.date), hour: str(cdate.hour), minute: str(cdate.minute), second: str(cdate.second), millisecond: str(cdate.millisecond) }, inFixedString: { year: inFixedStr(cdate.year, 4), month: inFixedStr(cdate.month, 2), day: inFixedStr(cdate.day, 2), date: inFixedStr(cdate.date, 2), hour: inFixedStr(cdate.hour, 2), minute: inFixedStr(cdate.minute, 2), second: inFixedStr(cdate.second, 2), millisecond: inFixedStr(cdate.millisecond, 3) } };
    return cdate;
}
function circularToJSON(obj) {
    const cache = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                return '[Circular Reference]';
            }
            cache.add(value);
        }
        return value;
    });
}
module.exports = {
    str: str,
    getDate: getDate,
    circularToJSON: circularToJSON
}