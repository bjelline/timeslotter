import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';




export default function AddItem({ schedule }) {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();


  const handleSubmit = async (event) => {
    console.log('AddItem.handleSubmit');
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    let name = event.target.name.value;
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let params = { "p_schedule_id": schedule.id, "p_name": name };
    const { data, error } = await supabaseClient.rpc('insert_next_item', params);

    if (error) {
      alert(`error: ${error.message}`);
    } else {
      router.push(`/schedule/${schedule.id}`);
    }
  };


  return (
    <>
      {user && user.id == schedule.user_id && (
        <form className="flex flex-row gap-2 rounded-lg bg-white/50 p-5" action="/api/schedule/create" method="post"
        onSubmit={handleSubmit}>
          <label htmlFor="name">Add</label>
          <input type="text" id="name" name="name" required />
          <button type="submit">Submit</button>

        </form>
      )}
    </>
  );
}
