import Head from 'next/head'
import Link from 'next/link'

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import ScheduleCard from '../components/ScheduleCard';



export const getServerSideProps = async (context) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(context)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  const { data: schedules, error } = await supabase
    .from('schedules')
    .select('*')
    .order('start', { ascending: true })
    .filter('user_id', `eq.{session.id}`);
  return {
    props: {
      initialSession: session,
      user: session.user,
      schedules: schedules
    },
  }
}


export default function Profile({ user, schedules }) {
  return (
    <>
      <Head>
        <title>Timeslotter - Profil</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div>
          <h1 className="pb-2">Mein Profile</h1>
          <p>{user.email}</p>

          <h2 className="pt-2 pb-2">Meine Schedules</h2>

          {(!schedules) ? (
            <p>keine</p>
          ) : (
            <>
              {schedules.map((sch) => (
                <div key={sch.id}>
                  <Link
                    href={{
                      pathname: '/schedule/[id]',
                      query: { id: sch.id },
                    }}
                  >{sch.title}</Link>
                </div>
              ))}
            </>
          )}

          <h2 className="pt-2 pb-2">Debug</h2>


          <details>
            <summary>Raw user object</summary>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </details>
          <details>
            <summary>My Schedules</summary>
            <pre>{JSON.stringify(schedules, null, 2)}</pre>
          </details>
        </div>
      </main>
    </>
  )
}
