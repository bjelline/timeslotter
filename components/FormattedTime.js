import React from 'react';

export default function FormattedTime( { time, className } ) {
  const locale = 'de';

  const options = {
    hour: 'numeric',
    minute: '2-digit'
  };

  let formattedTime = new Intl.DateTimeFormat(locale, options).format(new Date(time));
  if(formattedTime.startsWith('0')) formattedTime = formattedTime.slice(1);

  return (
    <span className={`text-right font-mono ${className}`} >{formattedTime}</span>
  )
}



