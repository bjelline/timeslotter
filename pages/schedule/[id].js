import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import FormattedRange from '../../components/FormattedRange';
import EventStatus from '../../components/EventStatus';
import EventList from '../../components/EventList';
import ResetButton from '../../components/ResetButton';
import { useState, useEffect, useLayoutEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient.js';


export async function getServerSideProps(context) {
  const { id } = context.query;
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

  const [schedule, setSchedule] = useState({});
  const [items, setItems] = useState([]);

  /* realtime disabled
  const [supabaseClient, setSupabaseClient] = useState(null);


  useEffect(() => {


    async function fetchSchedule() {
      if (!supabaseClient) return;
      let { data, error } = await supabaseClient
        .from('schedules')
        .select('id, title, description, start, end')
        .eq('id', id)
        .single();


      if (error) {
        console.log("fetchSchedule error", error);
        setSchedule({});
      } else {
        console.log("fetchSchedule got data", data);
        setSchedule(data);
      }
    }

    async function fetchItems(supabase = null) {
      if (!supabaseClient) return;
      let { data, error } = await supabaseClient
        .from('items')
        .select('*')
        .eq('schedule_id', id)
        .order('planned_start_at', { ascending: true });
      if (error) {
        console.log("fetchItems error", error);
        setItems([]);
      } else {
        console.log("fetchItems got data", data);
        setItems(data);
      }
    }

    // Create a Supabase client
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    setSupabaseClient(supa);

    const broadcasts = supa
      .channel('test')
      .on('broadcast', { event: '*' }, (payload) => console.log(payload))
      .subscribe()


    const subscription = supa
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `schedule_id=eq.${id}`
        },
        (payload) => {
          console.log("items", payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'schemas',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log("schema", payload)
        }
      )
      .subscribe();

    console.log("subscribed to supabase realtime changes at ", process.env.NEXT_PUBLIC_SUPABASE_URL);

    // Unsubscribe when the component unmounts
    return () => {
      console.log("unsubscribed from supabase realtime changes");
      subscription.unsubscribe();
      broadcasts.unsubscribe();
    };
  }, [id]);

  */

  useEffect(() => {
    console.log("another useEffect in ShowSchedule, copying props to state");
    setSchedule(props.schedule);
    setItems(props.items);
  }, [props.schedule, props.items]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Timeslotter - ${schedule.title}`}</title>
        <meta name="description" content="thisschedule" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ResetButton scheduleId={id} />
        {((!schedule) || (!schedule.start)) ? (
          <p>...loading schedule...</p>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  )
}
