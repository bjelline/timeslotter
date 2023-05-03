import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import FormattedRange from '../../components/FormattedRange';
import EventStatus from '../../components/EventStatus';
import EventList from '../../components/EventList';
import ResetButton from '../../components/ResetButton';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const supabase = createServerSupabaseClient(context);
  console.log("serverside in ShowSchedule: try to load id", id);

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

export default function ShowSchedule(props) {
  const router = useRouter();
  const { id } = router.query;
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [schedule, setSchedule] = useState({});
  const [items, setItems] = useState([]);


  const currentIndex = findIfCurrent(items);

  function findIfCurrent(items) {
    const now = new Date();
    const index = items.findIndex((item) => {
      const start = new Date(item.planned_start_at);
      const end = new Date(item.planned_end_at);
      return (start <= now && now <= end);
    });
    return index;
  }


  useEffect(() => {
    console.log("another useEffect in ShowSchedule, copying props to state");
    setSchedule(props.schedule);
    setItems(props.items);
  }, [props.schedule, props.items]);


  function rerenderThisComponent() {
    router.replace(router.asPath);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Timeslotter - ${schedule.title}`}</title>
        <meta name="description" content="thisschedule" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {user ? (
          <ResetButton scheduleId={id} handleComplete={rerenderThisComponent} />
        ) : (<></>)}
        {((!schedule) || (!schedule.start)) ? (
          <p>...loading schedule...</p>
        ) : (
          <>
            <p><FormattedRange start={schedule.start} end={schedule.end} /></p>
            <h1 className={styles.title}>
              {schedule.title}
            </h1>
            <p className="pb-5">{schedule.description}</p>
            {items.length == 0 ? (
              <p>Noch Keine Punkte auf der Tagesordnung.</p>
            ) : (
              <>
                {currentIndex >= 0 ? (
                  <EventStatus item={items[currentIndex]} />
                ) : (
                  <p></p>
                )}
                <EventList items={items} currentIndex={currentIndex} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
