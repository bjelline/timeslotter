import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import React, { useState } from 'react';

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
  console.log("for schedule ${schedule} there are ${items?.length} items")
  if (items?.length > 0) {
    console.log("first item end_at is", typeof items[0].end_at, " is ", items[0].end_at);
  }


  return {
    props: {
      schedule: schedule,
      items: items
    }
  }
}

export default function EditSchedule({ schedule }) {
  const router = useRouter();
  const user = useUser();
  const superbaseClient = useSupabaseClient();

  // for the form, split up start and end into date and time
  const [formData, setFormData] = useState({ ...schedule,
    date: schedule.start.substr(0, 10),
    start: schedule.start.substr(11, 5),
    end: schedule.end.substr(11, 5),
    no_items: ((new Date(schedule.end) - new Date(schedule.start)) / 1000 / 60) / schedule.time_per_slot
  });

  const handleChange = (e) => {
    let end_time = new Date(formData.date + "T" + formData.end);
    let start_time = new Date(formData.date + "T" + formData.start);
    let time_diff_mins = (end_time - start_time) / 1000 / 60;
    let no_items = Math.floor(time_diff_mins / formData.time_per_slot);
    console.log(`recalculating: there are ${no_items} timeslots of ${formData.time_per_slot} mins in ${time_diff_mins} mins`);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      no_items: no_items
    });
  };

  const handleSubmit = async (event) => {
    console.log('form.handleSubmit');
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    if ((formData.date.length == 0)
      || (formData.start.length == 0)
      || (formData.end.length == 0)) {
      alert("error: date, start or end not found");
      return;
    }

    // Get data from the form.
    let new_schedule = {
      title: formData.title,
      description: formData.description,
      start: formData.date + "T" + formData.start,
      end: formData.date + "T" + formData.end,
      time_per_slot: formData.time_per_slot,
      user_id: user.id
    }

    console.dir(schedule);

    // Send the form data to our forms API on Vercel and get a response.
    const { data, error } = await superbaseClient
      .from('schedules')
      .update(new_schedule)
      .eq('id', schedule.id)
      .select()


    if (error) {
      alert(`error: ${error.message}`);
    } else {
      console.log("it worked!");
      console.dir(data);
      let id = data[0].id;
      router.push(`/schedule/${id}`);
    }
  };


  return (
    <div className="my_container">
      <Head>
        <title>Timeslotter - New Event</title>
        <meta name="description" content="Create a new Schedule" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main flex items-center justify-center">
        <form className="flex flex-col rounded-lg bg-white/50 p-5" action="/api/schedule/create" method="post"
          onSubmit={handleSubmit}>
          <h1>Edit Event</h1>

          <label htmlFor="title">Title of the Event</label>
          <input type="text" id="title" name="title"
            value={formData.title} onChange={handleChange} />

          <label htmlFor="description">Description</label>
          <textarea id="description" name="description"
            value={formData.description} onChange={handleChange}></textarea>

          <label htmlFor="date">Date of Event</label>
          <input type="date" id="date" name="date" required className="text-right"
            value={formData.date}  onChange={handleChange} />

          <label htmlFor="start">Start time of Event</label>
          <input type="time" id="start" name="start" required  className="text-right"
            value={formData.start}  onChange={handleChange} />

          <label htmlFor="end">End time of Event</label>
          <input type="time" id="end" name="end" required  className="text-right"
            value={formData.end}  onChange={handleChange} />

          <label htmlFor="time_per_slot">Length of Timeslot in Minutes</label>
          <input type="number" id="time_per_slot" name="time_per_slot"  className="text-right"
            value={formData.time_per_slot} onChange={handleChange} />

          <label htmlFor="no_items">Number of Timeslots</label>
          <input type="text" id="no_items" name="no_items" disabled className="text-right"
            value={formData.no_items} />

          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  )
}
