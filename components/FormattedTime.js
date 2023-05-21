import React from 'react';
import { fmtTime } from '../lib/data_normalizer';

export default function FormattedTime({ time, className }) {
  return (
    <span className={`text-right font-mono ${className}`} >{fmtTime(time)}</span>
  )
}



