import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import FormattedRange from '../../components/FormattedRange';
import EventStatus from '../../components/EventStatus';
import EventList from '../../components/EventList';
import ResetButton from '../../components/ResetButton';
import { supabase } from '../../lib/supabaseClient';

export async function getServerSideProps(context) {
  const { id } = context.query;
  // console.log("serverside in ShowSchedule: try to load id", id);

  let { data: schedule, error: schedulesError } = await supabase
    .from('schedules')
    .select('id, title, description, start, end')
    .eq('id', id)
    .single();
  if (schedulesError) {
    schedule = {};
  }
  // console.log("serverside in ShowSchedule: schedule=", schedule);

  let { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('schedule_id', id)
    .order('planned_start_at', { ascending: true });
  if (itemsError) {
    items = [];
  }
  // console.log("serverside in ShowSchedule: items=", items);


  return {
    props: { schedule: schedule, items: items }
  }
}

// realtime

// supabase
//   .channel('any')
//   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'items' }, handleItemInserted)
//   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'items' }, handleItemUpdated)
//   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'schemas' }, handleSchemaUpdated)
//   .subscribe()

export default function ShowSchedule({ schedule, items }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Timeslotter - ${schedule.title}`}</title>
        <meta name="description" content="thisschedule" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ResetButton scheduleId={id} />
        <p><FormattedRange start={schedule.start} end={schedule.end} /></p>
        <h1 className={styles.title}>
          {schedule.title}
        </h1>
        <p>{schedule.description}</p>
        {items.length == 0 ? (
          <p>Noch Keine Punkte auf der Tagesordnung.</p>
        ) : (
          <>
            <EventStatus item={items[0]} />
            <EventList items={items} />
          </>
        )}
      </main>
    </div>
  )
}
