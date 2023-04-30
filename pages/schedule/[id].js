import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import FormattedRange from '../../components/FormattedRange';
import FormattedTime from '../../components/FormattedTime';
import { isToday, isPast, isFuture } from 'date-fns'
import { supabase } from '../../lib/supabaseClient';



export async function getServerSideProps(context) {
  const { id } = context.query;
  console.log("serverside in ShowSchedule: try to load id", id);

  let { data: schedule, error: schedulesError } = await supabase
    .from('schedules')
    .select('id, title, description, start, end')
    .eq('id', id)
    .order('start', { ascending: true })
    .single();
  if (schedulesError) {
    schedule = {};
  }
  console.log("serverside in ShowSchedule: schedule=", schedule);

  let{ data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('schedule_id', id)
    .order('planned_start_at', { ascending: true });
  if (itemsError) {
    items = [];
  }
  console.log("serverside in ShowSchedule: items=", items);


  return {
    props: { schedule: schedule, items: items }
  }
}

export default function ShowSchedule({ schedule, items }) {
  const router = useRouter();
  console.log("ShowSchedule", router.query)
  const { id } = router.query;
  console.log("id", id);

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Timeslotter - ${schedule.title}`}</title>
        <meta name="description" content="thisschedule" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {schedule.title}
        </h1>
        <p>{schedule.descriptin}</p>
        <p><FormattedRange start={schedule.start} end={schedule.end} /></p>
        <ol className="item_list">
          {items.map((item) => (
            <li key={item.id}><FormattedTime time={item.planned_start_at} /> {item.name}</li>
          ))}
        </ol>
      </main>
    </div>
  )
}
