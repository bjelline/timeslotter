import { useState } from "react";
import { adminRewriteScheduleStartNow } from "../lib/supabaseClient.js";

export default function ResetButton({scheduleId}) {
  const [loading, setLoading] = useState(false);

  async function handleButtonClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/schedule/start-now?id=${scheduleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        throw new Error('Failed to call function');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div>
      <button className="rounded-md bg-blue-700 p-1 text-white" disabled={loading} onClick={handleButtonClick}>
        {loading ? "Loading..." : "Admin: Jetzt starten"}
      </button>
    </div>
  );
}
