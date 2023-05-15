import React from 'react';

export default function FormattedTime(props) {
  let { time } = props;

  const locale = 'de';

  const options = {
    hour: 'numeric',
    minute: 'numeric'
  };

  let formattedTime = new Intl.DateTimeFormat(locale, options).format(new Date(time));

  return (
    <span className="w-18 text-right font-mono" >{formattedTime}</span>
  )
}
/*
  import { FlapDisplay, Presets } from 'react-split-flap-effect';

  return (
    <FlapDisplay
      className="flap-display"
      chars={Presets.NUM + ':'}
      length={formattedTime.length}
      value={formattedTime}
      timing={30}
    />
  )
*/


