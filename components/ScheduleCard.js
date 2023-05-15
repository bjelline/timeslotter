import Link from 'next/link'
import FormattedRange from '../components/FormattedRange';
import { isToday, isPast, isFuture } from 'date-fns'

export default function ScheduleCard({ schedule }) {
  let startDateTime = new Date(schedule.start);
  let endDateTime = new Date(schedule.end);
  let className = "card";

  if (isToday(startDateTime)) {
    className += " " + "today";
  } else if (isPast(startDateTime)) {
    className += " " + "past";
  } else if (isFuture(startDateTime)) {
    className += " " + "future";
  }

  return (
    <Link
      href={{
        pathname: '/schedule/[id]',
        query: { id: schedule.id },
      }}
      className={className} key={schedule.id}
    >
      <h2>{schedule.title || "not title"}</h2>
      <p>
        <FormattedRange start={schedule.start} end={schedule.end} />
      </p>
      <p>{schedule.description}</p>
    </Link>
  );
}
