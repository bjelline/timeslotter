import Head from 'next/head'
import { supabase } from './../lib/supabaseClient';
import ScheduleCards from '../components/ScheduleCards';
import React from 'react';


export async function getServerSideProps() {
  let { data, error } = await supabase.from('schedules').select('id, title, description, start, end').order('start', { ascending: true });
  if( error ) {
    data = [];
  }
  return {
    props: { schedules: data }
  }
}


export default function Home({schedules}) {

  return (
    <>
      <Head>
        <title>Timeslotter - keep tracks of timeslots</title>
        <meta name="description" content="a one page app to keep track of timeslots" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          Timeslotter
        </h1>

        <p className="description">
          Let&apos;s set up your schedule!
        </p>

        <div className="cards_container">
        <ScheduleCards schedules={schedules}  />
        </div>
      </main>
    </>
  )
}
