import Link from 'next/link'
import FormattedRange from '../components/FormattedRange';
import { isToday, isPast, isFuture } from 'date-fns'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'




export default function ScheduleCard({ schedule, handleDelete }) {
  let startDateTime = new Date(schedule.start);
  let endDateTime = new Date(schedule.end);
  let className = "card";
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  if (isToday(startDateTime)) {
    className += " " + "today";
  } else if (isPast(startDateTime)) {
    className += " " + "past";
  } else if (isFuture(startDateTime)) {
    className += " " + "future";
  }



  return (
    <div className={className} key={schedule.id}>
      <h2 className="flex justify-between">
        <Link
          href={{
            pathname: '/schedule/[id]',
            query: { id: schedule.id },
          }}
        >
          {schedule.title || "not title"}
        </Link>
        {user && user.id == schedule.user_id && (
          <button
            className="bg-white rounded-full w-6"
            onClick={async () => handleDelete(schedule.id)}
          >x</button>
        )}
      </h2>
      <p>
        <FormattedRange start={schedule.start} end={schedule.end} />
      </p>
      <p>{schedule.description}</p>
    </div >
  );
}
