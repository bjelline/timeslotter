import FormattedTime from './FormattedTime';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import OverTimeReport from './OverTimeReport';
import StartStopButtons from './StartStopButtons';

export default function EventDashboard({ supabaseClient, setItems, schedule: scheduleProp, items: itemsProp }) {
  // const [draggedItem, setDraggedItem] = useState(null);

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
      return ((new Date(item.end_at) - new Date(item.start_at)) / 1000) / 60;
    })[0];
  console.log("end from items is", lastItemEndAt, "schedule.end is", schedule.end);
  let overTime = lastItemEndAt - schedule.end;

  let item = null;
  let fullTime = 0;
  let remainingTime = 0;

  /*
                draggable={item.status === 'future'}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}


    const handleDragStart = (e, index) => {
      setDraggedItem(items[index]);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index);
    };

    const handleDragOver = (e, index) => {
      e.preventDefault();
      const targetIndex = index;
      const sourceIndex = items.indexOf(draggedItem);
      if (sourceIndex !== targetIndex) {
        const updatedList = [...items];
        updatedList.splice(sourceIndex, 1);
        updatedList.splice(targetIndex, 0, draggedItem);
        setitems(updatedList);
      }
    };

    const handleDragEnd = () => {
      setDraggedItem(null);
    };
  */

  function diff_mins(dt1, dt2) {
    let msec = new Date(dt2) - new Date(dt1);
    let s = msec / 1000;
    let mins = Math.round(s / 60);
    return mins;
  }


  async function handleStartClick(e) {
    let index = parseInt(e.target.id.split('_')[2]);
    let item = items[index];
    let timestamp = new Date().toISOString();
    let params = { p_schedule_id: schedule.id, p_item_id: item.id, p_must_fit: mustFit };
    console.log("calling handleStartClick on", params);
    const { data, error } = await supabaseClient.rpc('start_schedule', params);
    console.log("error?", error);
    console.log("data?", data);
    if (!error) {
      setItems(data);
    }
    // router.push(`/schedule/${id}`);
  }

  async function handleStopClick(e) {
    let index = parseInt(e.target.id.split('_')[2]);
    console.log("calling handleStopClick on", index, "item", items[index]);
    const { error } = await supabaseClient
      .from('items')
      .update({ end_at: new Date().toISOString(), status: 'past' })
      .eq('id', items[index].id);
    const { data: new_items, error: new_items_error } = await supabaseClient
      .from('items')
      .select('*')
      .eq('schedule_id', schedule.id)
      .order('start_at', { ascending: true });
    console.log("error?", new_items_error);
    console.log("data?", new_items);
    if (!error) {
      setItems(new_items);
    }
  }
  return (
    <>
      <OverTimeReport lastItemEndAt={lastItemEndAt} overTime={overTime} schedule={schedule} timeSlotLength={timeSlotLength} />
      <ol className="item_list">
        {user && user.id == schedule.user_id && (
          <li>
            <div className="w-10 mr-2 text-right mr-8">
              <input
                className="h-8"
                type="checkbox"
                checked={mustFit}
                onChange={(event) => setMustFit(event.target.checked)}
                id="mustFitCheckbox"
              />
            </div>
            <label htmlFor="mustFitCheckbox">Must Fit</label>
          </li>
        )}
        {items.map((item, index) => {
          let className = item.status;
          return (
            <li key={item.id} className={`${className}`} tabIndex="0"

            >
              <div className="w-10 mr-2">
                {(user && user.id == schedule.user_id) && (
                  <StartStopButtons {...{ item, index, currentIndex, handleStopClick, handleStartClick }} />
                )}
                {' '}
              </div>
              <FormattedTime time={item.start_at} className="w-20 text-gray-600  mr-2" />
              <FormattedTime time={item.end_at} className="w-20 text-gray-600  mr-2" />
              <span className="w-20  text-right text-gray-600  mr-8" >{diff_mins(item.start_at, item.end_at)} Mins</span>
              <span>{item.name}</span>
            </li>
          )
        }
        )}
      </ol >
    </>
  )
}
