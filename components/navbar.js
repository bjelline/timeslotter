import Link from 'next/link'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


export default function Navbar() {
  const supabaseClient = useSupabaseClient()
  const user = useUser()

  if(!user)
  return (
    <nav>
      <Link
        href={{
          pathname: '/'
        }}
      >Schedules</Link>
      <Link
        href={{
          pathname: '/auth'
        }}
      >Login</Link>
    </nav>
  )

  // user is logged in
  return (
    <nav>
      <Link
        href={{
          pathname: '/schedule/new'
        }}
      >New Event</Link>
      <Link
        href={{
          pathname: '/'
        }}
      >Schedules</Link>
      <Link
        href={{
          pathname: '/profile'
        }}
      >Profile</Link>
      <button className="rounded-md bg-blue-700 p-1 text-white" onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
    </nav>
  )


}
