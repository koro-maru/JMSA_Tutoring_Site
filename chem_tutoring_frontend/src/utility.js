const parseDate = (dateInput) => {
  const date = new Date(dateInput);
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + parseTime(dateInput);
}

const parseTime = (dateInput) => {
  const date = new Date(dateInput);
  const AMPM = date.getHours() >= 12 ? "PM" : "AM";
  return ((AMPM == "PM" ? date.getHours() - 12 : date.getHours()) + ":" + date.getMinutes() + " " + AMPM);
}

const subjectList = [];
//Later to be stuffed into DB


module.exports = {
  "parseDate": parseDate,
  "parseTime": parseTime,
  subjectList: subjectList
}