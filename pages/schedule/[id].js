import Head from 'next/head';
import { useRouter } from 'next/router';
import FormattedTime from '../../components/FormattedTime';
import FormattedRange from '../../components/FormattedRange';
import EventDashboard from '../../components/EventDashboard';
import AdminBar from '../../components/AdminBar';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import AddItem from '../../components/AddItem';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const supabase = createServerSupabaseClient(context);
  console.log("serverside in ShowSchedule: try to load id", id);

  let { data: schedule, error: schedulesError } = await supabase
    .from('schedules')
    .select('*')
    .eq('id', id)
    .single();
  if (schedulesError) {
    console.log("error loading schedule", schedulesError);

    schedule = {};
  }
  // console.log("serverside in ShowSchedule: schedule=", schedule);

  let { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('schedule_id', id)
    .order('start_at', { ascending: true });

  if (itemsError) {
    console.log("error loading items", itemsError);
    items = [];
  }
  // console.log("serverside in ShowSchedule: schedule and ", items.length, " items for ", id);
  console.log("first item end_at is", typeof items[0].end_at, " is ", items[0].end_at);


  return {
    props: {
      schedule: schedule,
      items: items
    }
  }
}

export default function ShowSchedule(props) {
  const router = useRouter();
  const { id } = router.query;
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [schedule, setSchedule] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    console.log("another useEffect in ShowSchedule, copying props to state");
    setSchedule(props.schedule);
    setItems(props.items);
  }, [props.schedule, props.items]);


  function rerenderThisComponent() {
    router.replace(router.asPath);
  }

  return (
    <>
      <Head>
        <title>{`Timeslotter - ${schedule.title}`}</title>
        <meta name="description" content="thisschedule" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        {user ? (
          <AdminBar supabaseClient={supabaseClient} scheduleId={id} handleComplete={rerenderThisComponent} setItems={setItems} />
        ) : (<></>)}
        {((!schedule) || (!schedule.start)) ? (
          <p>...loading schedule...</p>
        ) : (
          <>
            <h1 className="title">
              {schedule.title}
            </h1>
            <p className="mb-5 w-80 text-center">{schedule.description}</p>
            <p className="mb-5">
              <FormattedRange start={schedule.start} end={schedule.end} />
            </p>
            {items.length == 0 ? (
              <p>Noch Keine Punkte auf der Tagesordnung.</p>
            ) : (
              <EventDashboard supabaseClient={supabaseClient} schedule={schedule} items={items} setItems={setItems} />
            )}
            <AddItem schedule={schedule} items={items} setItems={setItems} />
          </>
        )}
      </main>
    </>
  )
}
