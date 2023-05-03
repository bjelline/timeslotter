import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import numeral from 'numeral';


export default function Timer({duration, initialRemainingTime, isPlaying}){


  function fmt(sek) {
    return numeral(sek).format('00:00:00').replace(/^0*:?0*/, '')
  }

  return (
    <CountdownCircleTimer
      isPlaying={isPlaying}
      duration={duration}
      initialRemainingTime={initialRemainingTime}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[7, 5, 2, 0]}
    >
      {({ remainingTime }) => `${fmt(remainingTime)} von ${fmt(duration)}`}
    </CountdownCircleTimer>
  )
}
