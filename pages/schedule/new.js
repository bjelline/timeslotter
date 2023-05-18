import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export default function NewSchedule(props) {
  const router = useRouter();
  const user = useUser();
  const superbaseClient = useSupabaseClient();


  const handleSubmit = async (event) => {
    console.log('form.handleSubmit');
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();


    if ((event.target.date.value.length == 0)
      || (event.target.start.value.length == 0)
      || (event.target.end.value.length == 0)) {
      alert("error: date, start or end not found");
      return;
    }

    // Get data from the form.
    let schedule = {
      title: event.target.title.value,
      description: event.target.description.value,
      start: event.target.date.value + "T" + event.target.start.value,
      end: event.target.date.value + "T" + event.target.end.value,
      time_per_slot: event.target.time_per_slot.value,
      user_id: user.id
    }


    console.dir(schedule);

    // Send the form data to our forms API on Vercel and get a response.
    const { data, error } = await superbaseClient
      .from('schedules')
      .insert(schedule)
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
          <h1>New Event</h1>

          <label htmlFor="title">Title of the Event</label>
          <input type="text" id="title" name="title" value="Wichtiges Event" />

          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value="Many important presentations"></textarea>

          <label htmlFor="start">Date of Event</label>
          <input type="date" id="date" name="date" required />

          <label htmlFor="start">Start of Event</label>
          <input type="time" id="start" name="start" required />

          <label htmlFor="end">End of Event</label>
          <input type="time" id="end" name="end" required />

          <label htmlFor="time_per_slot">Length of Timeslot in Minutes</label>
          <input type="number" id="time_per_slot" name="time_per_slot" value="15" />

          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  )
}
