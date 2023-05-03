import { CountdownCircleTimer } from
    'react-countdown-circle-timer'

export default function OverTimer({duration, initialRemainingTime, isPlaying}){
  return (
    <CountdownCircleTimer
      isPlaying={isPlaying}
      duration={duration}
      isGrowing={true}
      initialRemainingTime={initialRemainingTime}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[7, 5, 2, 0]}
    >
      {({ remainingTime }) => `${remainingTime} sek drüber`}
    </CountdownCircleTimer>
  )
}
