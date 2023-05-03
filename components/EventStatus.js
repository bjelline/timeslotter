import Timer from './Timer';
import OverTimer from './OverTimer';
import FormattedTime from './FormattedTime';


export default function EventStatus({ item }) {
  let fullTime = Math.floor((new Date(item.planned_end_at) - new Date(item.planned_start_at)) / 1000);
  let remainingTime = Math.floor((new Date(item.planned_end_at) - new Date()) / 1000);
  console.log('EventStatus remainingTime', remainingTime)
  return (
    <div className="flex items-center gap-0.5 m-5 p-5 bg-slate-50/50 rounded-full w-full">
      <FormattedTime time={item.planned_start_at} /> -
      <FormattedTime time={item.planned_end_at} />
      <h2 className="">
        {item.name}
      </h2>
      <div className="ml-5">
        {(remainingTime > 0) ? (
          <Timer isPlaying={true} duration={fullTime} initialRemainingTime={remainingTime} />
        ) : (
          <OverTimer isPlaying={true} duration={fullTime} initialRemainingTime={-remainingTime}  />
        )}
      </div>
    </div>
  )
}
