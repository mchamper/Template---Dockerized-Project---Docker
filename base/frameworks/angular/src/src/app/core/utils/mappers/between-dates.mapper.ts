import moment from "moment";

export const betweenDatesMapper = (dates: Date[], asString?: boolean ) => {
  if (!dates[0] || !dates[1]) {
    return dates;
  }

  let mapped: string | string[] = [
    moment(dates[0]).format('YYYY-MM-DD'),
    moment(dates[1]).format('YYYY-MM-DD'),
    (new Date().getTimezoneOffset()) / 60 + ''
  ];

  if (asString) {
    mapped = mapped.join(',');
  }

  return mapped;
};
