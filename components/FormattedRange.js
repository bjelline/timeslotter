import React from 'react';

function GermanDateNoTimezone(string) {

  const locale = 'de';

  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  };


  let formattedDate = new Intl.DateTimeFormat(locale, options).format(new Date(string));

  return formattedDate.replace(' MESZ', '').replace(' MEZ', '');
}

export default function FormattedDate(props) {
  let { start, end } = props;

  let formattedStart = GermanDateNoTimezone(start);
  let formattedEnd = GermanDateNoTimezone(end);

  let [startDay, startTime] = formattedStart.split(' um ');
  let [endDay, endTime] = formattedEnd.split(' um ');

  if (startDay === endDay) {
    return (
      <span>{startDay} {startTime} - {endTime}</span>
    );
  } else {
      return (
        <span>{formattedStart} - {formattedEnd}</span>
      );
    }
  }

