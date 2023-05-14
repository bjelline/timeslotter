import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import { adminFit } from "../../../../lib/supabaseClient.js";

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  console.log("api/schedule/fit.js", req.method, req.query, req.body);
  const { id } = req.query;
  if (req.method === 'POST') {
    // Call the adminRewriteScheduleStartNow function here
    await adminFit(supabase, id);

    // Send a success response
    res.status(200).json({ message: 'Changed Plan successfully' });
  } else {
    // Send a "Method Not Allowed" response
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

