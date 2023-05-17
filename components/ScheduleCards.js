import ScheduleCard from '../components/ScheduleCard';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export default function ScheduleCards({ schedules }) {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  async function handleDelete(schedule_id) {

    const { error } = await supabaseClient
      .from('schedules')
      .delete()
      .eq('id', schedule_id)

    if (error) {
      console.log("error", error);
    } else {
      router.push(`/`);
    }

  }

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
        <ScheduleCard key={sch.id} schedule={sch} handleDelete={handleDelete} />
      ))}
    </div>
  );
}
