import Timer from './Timer';
import FormattedTime from './FormattedTime';


export default function EventStatus({item}) {
  return (
    <div className="flex items-center gap-0.5 m-5 p-5 bg-slate-50/50 rounded-full w-full">
      <FormattedTime time={item.planned_start_at} /> -
      <FormattedTime time={item.planned_end_at} />
      <h2 className="">
        {item.name}
      </h2>
      <div className="ml-5">
        <Timer isPlaying={false} duration={5*60} />
      </div>
    </div>
  )
}
