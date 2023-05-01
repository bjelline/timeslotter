import { CountdownCircleTimer } from
    'react-countdown-circle-timer'

export default function Timer({duration, isPlaying}){
  return (
    <CountdownCircleTimer
      isPlaying={isPlaying}
      duration={duration}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[7, 5, 2, 0]}
    >
      {({ remainingTime }) => `Noch ${remainingTime} Sekunden`}
    </CountdownCircleTimer>
  )
}
