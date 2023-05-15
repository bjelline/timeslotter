import Head from 'next/head'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

const LoginPage = () => {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [data, setData] = useState()

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabaseClient.from('schedules').select('*')
      console.log(error);
      setData(data)
    }
    // Only run query once user is logged in.
    if (user) loadData()
  }, [user, subabaseClient])

  if (!user)
    return (
      <div className="container">
        <Head>
          <title>Timeslotter - Login and Logout</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="main">
          <Auth
            redirectTo="http://localhost:3000/"
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={['google', 'github']}
            socialLayout="horizontal"
          />
        </main>
      </div>
    )

  return (
    <div className="container">
      <Head>
        <title>Timeslotter - Login and Logout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <button className="rounded-md bg-blue-700 p-1 text-white" onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
        <p>user:</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <p>client-side data fetching with RLS</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </main>
    </div>
  )
}

export default LoginPage
