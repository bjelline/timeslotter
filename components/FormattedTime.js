import React from 'react';

export default function FormattedTime(props) {
  let { time } = props;

  const locale = 'de';

  const options = {
    hour: 'numeric',
    minute: 'numeric'
  };

  let formattedTime = new Intl.DateTimeFormat(locale, options).format(new Date(time));

  return <span className="time">{formattedTime}</span>;
}

