// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}


import { adminRewriteScheduleStartNow } from "../lib/supabaseClient.js";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Call the adminRewriteScheduleStartNow function here
    await adminRewriteScheduleStartNow();

    // Send a success response
    res.status(200).json({ message: 'Schedule started successfully' });
  } else {
    // Send a "Method Not Allowed" response
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

