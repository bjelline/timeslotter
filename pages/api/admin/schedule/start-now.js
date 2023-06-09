import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import { adminRewriteScheduleStartNow } from "../../../../lib/supabaseClient.js";

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  console.log("api/schedule/start-now.js", req.method, req.query, req.body);
  const { id } = req.query;
  if (req.method === 'POST') {
    // Call the adminRewriteScheduleStartNow function here
    await adminRewriteScheduleStartNow(supabase, id);

    // Send a success response
    res.status(200).json({ message: 'Schedule started successfully' });
  } else {
    // Send a "Method Not Allowed" response
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

