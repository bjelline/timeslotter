import styles from '../styles/Home.module.css'
import Link from 'next/link'
import FormattedRange from '../components/FormattedRange';
import { isToday, isPast, isFuture } from 'date-fns'


export default function ScheduleCard({ schedule }) {
  console.log("ScheduleCard", schedule);

  let startDateTime = new Date(schedule.start);
  let endDateTime = new Date(schedule.end);

  let className = styles.card;

  console.log("className", className, " typeof className=", typeof className);

  if (isToday(startDateTime)) {
    className += " " + styles.today;
  } else if (isPast(startDateTime)) {
    className += " " + styles.past;
  } else if (isFuture(startDateTime)) {
    className += " " + styles.future;
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
