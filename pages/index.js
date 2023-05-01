import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { supabase } from './../lib/supabaseClient';
import FormattedRange from '../components/FormattedRange';
import ScheduleCards from '../components/ScheduleCards';
import React, { useState, useEffect } from 'react';


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
    <div className={styles.container}>
      <Head>
        <title>Timeslotter - keep tracks of timeslots</title>
        <meta name="description" content="a one page app to keep track of timeslots" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Timeslotter
        </h1>

        <p className={styles.description}>
          Let&apos;s set up your schedule!
        </p>

        <ScheduleCards schedules={schedules}  />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://brigitte-jellinek.at"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by by Brigitte Jellinek
        </a>
      </footer>
    </div>
  )
}
