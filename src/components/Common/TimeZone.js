import moment from "moment-timezone";

// 取得正確日期時間 function
const timeCheck = (currentTZ, isBegin = true, day = 0) => {
  const venezuelaTimeNow = moment
    .tz(new Date(), "America/Caracas")
    .format(isBegin ? "YYYY-MM-DDT00:00:00" : "YYYY-MM-DDT23:59:59");
  const ShanghaiTimeNow = moment
    .tz(new Date(), "Asia/Shanghai")
    .format(isBegin ? "YYYY-MM-DDT00:00:00" : "YYYY-MM-DDT23:59:59");
  const LondonTimeNow = moment
    .tz(new Date(), "Europe/London")
    .format(isBegin ? "YYYY-MM-DDT00:00:00" : "YYYY-MM-DDT23:59:59");
  switch (currentTZ) {
    case "4":
      return `${moment(LondonTimeNow)
        .add(-day, "days")
        .add(`-${currentTZ}`, "hours")
        .format("YYYY-MM-DDTHH:mm:ss")}-04:00`;
    case "12":
      return `${moment(ShanghaiTimeNow)
        .add(-day, "days")
        .add(`-${currentTZ}`, "hours")
        .format("YYYY-MM-DDTHH:mm:ss")}-04:00`;
    default:
      return `${moment(venezuelaTimeNow)
        .add(-day, "days")
        .format("YYYY-MM-DDTHH:mm:ss")}-04:00`;
  }
};
export const timeZone = {
  now: () => {
    // 取 -12小時 時差 地區 美洲委內瑞拉
    const venezuelaTimeNow = moment.tz(new Date(), "America/Caracas");
    return `${moment(venezuelaTimeNow).format("YYYY-MM-DDTHH:mm:ss")}-04:00`;
  },
  beforeThirty: () => {
    // 取 -12小時 時差 地區 美洲委內瑞拉
    const venezuelaTimeNow = moment.tz(new Date(), "America/Caracas");
    return `${moment(venezuelaTimeNow)
      .add(-30, "minutes")
      .format("YYYY-MM-DDTHH:mm:ss")}-04:00`;
  },
  getTodayBegin: (currentTZ = 0) => {
    return timeCheck(currentTZ, true);
  },
  getTodayEnd: (currentTZ = 0) => {
    return timeCheck(currentTZ, false);
  },
  getCusDateBegin: (day = 0, currentTZ = 0) => {
    return timeCheck(currentTZ, true, day);
  },
  getCusDateEnd: (day = 0, currentTZ = 0) => {
    return timeCheck(currentTZ, false, day);
  },
  getCusDateShow: (day = 0, currentTZ = 0) => {
    // 取 -12小時 時差 地區 美洲委內瑞拉
    const venezuelaTimeNow = moment.tz(new Date(), "America/Caracas");
    return `${moment(venezuelaTimeNow)
      .add(-day, "days")
      .add(currentTZ, "hours")
      .format("YYYY/MM/DD")}`;
  },
};
