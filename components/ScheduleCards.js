import ScheduleCard from '../components/ScheduleCard';

export default function ScheduleCards({ schedules }) {
  if(!schedules)
    return (
      <div className="flex_band">
        no data yet
      </div>
    )

  // console.log("ScheduleCards", schedules);
  // console.log("typeof schedules", typeof schedules[0]);

  return (
    <div className="flex_band">
      {schedules.map((sch) => (
        <ScheduleCard key={sch.id} schedule={sch} />
      ))}
    </div>
  );
}
