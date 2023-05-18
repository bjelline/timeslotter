import FormattedTime from './FormattedTime';
import FormattedDate from './FormattedDate';

export default function OverTime({ lastItemEndAt, overTime: overTimeProp, schedule, timeSlotLength: timeSlotLengthProp }) {
  let overTime = Math.round(overTimeProp / 60 / 1000 );
  let timeSlotLength = Math.round(timeSlotLengthProp );
  let slot = (Math.abs(timeSlotLength - schedule.time_per_slot) < 1) ? (
    <p>The time slot length will be {schedule.time_per_slot}mins as planned.</p>
  ) : (
    <p>The time slot length will be <span className="text-red-600">{timeSlotLength}mins instead of {schedule.time_per_slot}mins</span>.</p>
  );

  if (Math.abs(overTime) <= 1)
    return (
      <>
        <p>
          Current Schedule will run on time, and finish at {' '}
          <FormattedTime time={schedule.end} /> {' '}
          as planned.
        </p>
        {slot}
      </>
    );

  if (overTime > 0)
    return (
      <>
        <p>
          Current Schedule will run {' '}
          <span className="text-red-600">
            {overTime}
            {'\u00A0'}
            minutes over time, will end at {' '}
            <FormattedTime time={lastItemEndAt} />
          </span>
        </p >
        {slot}
      </>
    );

  if (overTime < 0)
    return (
      <>
        <p>
          Current Schedule will run finish
          {overTime }
          minutes early at {' '}
          <FormattedTime time={lastItemEndAt} />
        </p>
        {slot}
      </>
    )
}
