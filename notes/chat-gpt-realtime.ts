import Head from 'next/head';
import { useRouter } from 'next/router';
import FormattedRange from '../../components/FormattedRange';
import EventStatus from '../../components/EventStatus';
import EventList from '../../components/EventList';
import ResetButton from '../../components/ResetButton';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function ShowSchedule() {
  const router = useRouter();
  const { id } = router.query;

  const [schedule, setSchedule] = useState({});
  const [items, setItems] = useState([]);
  const [supabaseClient, setSupabaseClient] = useState(null);

  useEffect(() => {
    // Create a Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setSupabaseClient(supabase);

    // Subscribe to changes to the schedules table
    const schedulesSubscription = supabase
      .from('schedules')
      .on('UPDATE', () => {
        fetchSchedule();
      })
      .subscribe();

    // Subscribe to changes to the items table
    const itemsSubscription = supabase
      .from('items')
      .on('UPDATE', () => {
        fetchItems();
      })
      .subscribe();

    // Fetch the initial data
    fetchSchedule();
    fetchItems();
  } 
    // Unsubscribe when the component unmounts
    return () => {
      schedulesSubscription.unsubscribe();
      itemsSubscription.unsubscribe();
    };
  }, []);

  async function fetchSchedule() {
    let { data, error } = await supabaseClient
      .from('schedules')
      .select('id, title, description, start, end')
      .eq('id', id)
      .single();
    if (error) {
      setSchedule({});
    } else {
      setSchedule(data);
    }
  }

  async function fetchItems() {
    let { data, error } = await supabaseClient
      .from('items')
      .select('*')
      .eq('schedule_id', id)
      .order('planned_start_at', { ascending: true });
    if (error) {
      setItems([]);
    } else {
      setItems(data);
    }
  }

  return (
    <div className="container">
      <Head>
        <title>{`Timeslotter - ${schedule.title}`}</title>
        <meta name="description" content="thisschedule" />
        <link rel="icon" href="/favicon.ico" />
