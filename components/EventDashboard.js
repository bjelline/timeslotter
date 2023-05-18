import FormattedTime from './FormattedTime';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import OverTimeReport from './OverTimeReport';

export default function EventDashboard({ supabaseClient, schedule: scheduleProp, items: itemsProp }) {
  let items = itemsProp.map((item) => {
    return {
      ...item,
      end_at: new Date(item.end_at),
      start_at: new Date(item.start_at)
    };
  });
  let schedule = {
    ...scheduleProp,
    start: new Date(scheduleProp.start),
    end: new Date(scheduleProp.end)
  }
  const user = useUser();
  const router = useRouter();
  const [mustFit, setMustFit] = useState(false);
  let id = schedule.id;
  let currentIndex = items.findIndex((item) => item.status == 'current');
  let isRunning = (currentIndex >= 0);
  let lastItemEndAt = items.reduce((max, current) => {
    return current.end_at > max ? current.end_at : max;
  }, -Infinity);
  let timeSlotLength = items
  .filter((item) => item.status == 'future')
  .map((item) => {
    return ((new Date(item.end_at) - new Date(item.start_at))/1000)/60;
  })[0];
  console.log("end from items is", lastItemEndAt, "schedule.end is", schedule.end);
  let overTime = lastItemEndAt - schedule.end;

  let item = null;
  let fullTime = 0;
  let remainingTime = 0;


  async function handleStartClick(e) {
    let index = parseInt(e.target.id.split('_')[2]);
    let item = items[index];
    let timestamp = new Date().toISOString();
    console.log("calling handleStartClick on", index, "item id=", item.id, "planned=", item.start_at, "set started=", timestamp);
    const { error } = await supabaseClient
      .from('items')
      .update({ start_at: timestamp, status: 'current' })
      .eq('id', items[index].id);
    console.log("error?", error);
    router.push(`/schedule/${id}`);
  }

  async function handleStopClick(e) {
    let index = parseInt(e.target.id.split('_')[2]);
    console.log("calling handleStopClick on", index, "item", items[index]);
    const { error } = await supabaseClient
      .from('items')
      .update({ end_at: new Date().toISOString(), status: 'past' })
      .eq('id', items[index].id);
    router.push(`/schedule/${id}`);
  }
  return (
    <>
      <OverTimeReport lastItemEndAt={lastItemEndAt} overTime={overTime} schedule={schedule} timeSlotLength={timeSlotLength} />
      {user && user.id == schedule.user_id && (
        <>
          <input
            type="checkbox"
            checked={mustFit}
            onChange={(event) => setMustFit(event.target.checked)}
            id="mustFitCheckbox"
          />
          <label htmlFor="mustFitCheckbox">Must Fit</label>
        </>
      )}
      <ol className="item_list">
        {items.map((item, index) => {
          let className = item.status;
          return (
            <li key={item.id} className={className} tabIndex="0">
              <FormattedTime time={item.start_at} />
              {' - '}
              <FormattedTime time={item.end_at} />
              {' '}
              <span className="text-gray-400 pl-2 pr-2">-</span>
              {item.name}
              {user && user.id == schedule.user_id && (() => {
                switch (item.status) {
                  case 'past':
                    return null
                  case 'current':
                    if (currentIndex > -1)
                      return (
                        <button
                          id={`stop_item_${index}`}
                          className="bg-blue-400  ml-4 pl-1 pr-1 rounded text-white"
                          onClick={handleStopClick}>
                          stop
                        </button>
                      );
                    return null;
                  case 'future':
                    if (currentIndex == -1) return (
                      <button
                        id={`start_item_${index}`}
                        className="bg-blue-400  ml-4 pl-1 pr-1 rounded text-white"
                        onClick={handleStartClick}>
                        starten
                      </button>
                    );
                    return null;
                  default:
                    return null
                }
              })()}
            </li>
          )
        }
        )}
      </ol >
    </>
  )
}


/*

✓

      {isRunning ? (
        <div className="flex items-center gap-0.5 m-5 p-5 bg-slate-50/50 rounded-full w-full">
          <FormattedTime time={items[currentIndex].start_at} /> -
          <FormattedTime time={items[currentIndex].end_at} />
          <h2 className="">
            {items[currentIndex].name}
          </h2>
          <div className="ml-5">
            {(remainingTime > 0) ? (
              <Timer isPlaying={true} duration={fullTime} initialRemainingTime={remainingTime} />
            ) : (
              <OverTimer isPlaying={true} duration={fullTime} initialRemainingTime={-remainingTime} />
            )}
          </div>
        </div>
      ) : (
        <p></p>
      )}
*/
