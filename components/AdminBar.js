import Link from "next/link";
import { useState } from "react";

export default function ResetButton({supabaseClient, scheduleId, handleComplete, setItems }) {
  const [loading, setLoading] = useState(false);

  async function handleButtonClick(url) {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        throw new Error('Failed to call function');
      }
      console.log("done with serverside, initiating rerender");
      handleComplete();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  async function handleResetClick() {
    handleButtonClick(`/api/admin/schedule/start-now?id=${scheduleId}`)
  }
  async function handleFitClick() {
    setLoading(true);
    let params = { "p_schedule_id": scheduleId};
    console.log("calling plan_to_fit", params);
    const { data, error } = await supabaseClient.rpc('plan_to_fit', params);
    console.log("done calling, got", data, error);
    if(!error) {
      setLoading(false);
      setItems(data);
    }
  }
  async function handleOverrunClick() {
    setLoading(true);
    let params = { "p_schedule_id": scheduleId};
    console.log("calling plan_to_fixed_length", params);
    const { data, error } = await supabaseClient.rpc('plan_to_fixed_length', params);
    console.log("done calling, got", data, error);
    if(!error) {
      setLoading(false);
      setItems(data);
    }
  }
  return (
    <div>
      <button className={`rounded-md ${loading ? "bg-gray-400" : "bg-blue-700"} p-1 m-3 text-white`} disabled={loading} onClick={handleResetClick}>
        {"Start Event Now"}
      </button>
      <button className={`rounded-md ${loading ? "bg-gray-400" : "bg-blue-700"} p-1 m-3 text-white`} disabled={loading} onClick={handleFitClick}>
        {"Plan to fit"}
      </button>
      <button className={`rounded-md ${loading ? "bg-gray-400" : "bg-blue-700"} p-1 m-3 text-white`} disabled={loading} onClick={handleOverrunClick}>
        {"Plan to fixed length"}
      </button>
      <Link href={`/schedule/${scheduleId}/edit`}>Edit</Link>
    </div>
  );
}
