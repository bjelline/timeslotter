import { createClient } from '@supabase/supabase-js'
import { differenceInSeconds, add } from 'date-fns'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export async function adminRewriteScheduleStartNow( supabase, id ) {
  let { data: schedule, error: schedulesError } = await supabase
    .from('schedules')
    .select('id, title, description, start, end')
    .eq('id', id)
    .single();
  if (schedulesError) {
    schedule = {};
  }
  console.log("serverside in adminRewriteScheduleStartNow: schedule=", schedule);

  let { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('schedule_id', id)
    .order('planned_start_at', { ascending: true });
  if (itemsError) {
    items = [];
  }
  console.log("serverside in adminRewriteScheduleStartNow: items=", items);

  let now = new Date();
  let newStart = now;
  let duration = differenceInSeconds(new Date(schedule.end), new Date(schedule.start));

  console.log("duration: ", duration, "Seconds");
  let newEnd = add(now, { seconds: duration });

  console.log("moving start + end to now: ", newStart.toISOString(), newEnd.toISOString(), "from", schedule.start, schedule.end);

  let { error: updateScheduleError } = await supabase
  .from('schedules')
  .update({ start: newStart.toISOString(), end: newEnd.toISOString() })
  .eq('id', id);


  if(updateScheduleError) {
    console.log(updateScheduleError);
  } else {
    console.log("updated schedule, no errors.");
  }

  newStart = now;

  for(let item of items) {
    duration = differenceInSeconds(new Date(item.planned_end_at), new Date(item.planned_start_at));
    newEnd = add(newStart, { seconds: duration });
    console.log("now updateing item", item.id, item.planned_start_at, "to", newStart);
    let { error: updateItemError } = await supabase
    .from('items')
    .update({ planned_start_at: newStart.toISOString(), planned_end_at: newEnd.toISOString() })
    .eq('id', item.id);
    if(updateItemError) {
      console.log(updateItemError);
    } else {
      console.log("updated item, no errors.");
    }
    newStart = newEnd;

  }

}
