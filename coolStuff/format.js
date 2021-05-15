function formatNumber(value, percision = 3, eMax = 5, eMin = -3,) {
    value = D(value)
    if (value.e > eMax || (value.e < eMin && eMin)) {
        let m = Math.round(value.m * 10 ** percision) / (10 ** percision)
        if (m.toString().length === 1) m += ".000"
        else {
            m += "0000000" //aite tf is this. 
            m = m.slice(0, percision + 2)
        }
        return m + "e" + value.e
    } else {
        let ret = Math.round(value.m * 10 ** value.e) //value without commas
        return ret.toLocaleString()
    }
}

function display(value) {
    return formatNumber(value, 3, 5, 0)
}

function displayDecimal(value) {
    return formatNumber(value, 3, 0, -4) //aite tf is this
}

function toCTime(ms) {
    const days = Math.floor(ms / (3600000 * 24)),
        hours = Math.floor(ms % (3600000 * 24) / 3600000),
        minutes = Math.floor((ms % 3600000) / 60000),
        seconds = Math.floor((ms % 60000) / 1000),
        msec = Math.floor(ms % 1000);
    if (days) return `${days}d ${("0"+hours).slice(-2)}:${("0"+minutes).slice(-2)}:${("0"+seconds).slice(-2)}`
    if (hours) return `${hours}:${("0"+minutes).slice(-2)}:${("0"+seconds).slice(-2)}`
    if (minutes) return `${minutes}:${("0"+seconds).slice(-2)}`
    if (seconds) return `0:${("0"+seconds).slice(-2)}.${("000"+msec).slice(-3)}`
    return `0:00.${("000"+msec).slice(-3)}`
}