import React from 'react';

export default function FormattedDate(props) {
  let { date } = props;

  const locale = 'de';

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  };

  let formattedDate = new Intl.DateTimeFormat(locale, options).format(new Date(date));

  return <div>{formattedDate}</div>;
}

