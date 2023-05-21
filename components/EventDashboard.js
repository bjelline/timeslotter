import FormattedTime from './FormattedTime';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import OverTimeReport from './OverTimeReport';
import StartStopButtons from './StartStopButtons';
import { convertItems, fmtTime } from '../lib/data_normalizer';

export default function EventDashboard({ supabaseClient, setItems, schedule, items }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);
  const user = useUser();
  const router = useRouter();
  const [mustFit, setMustFit] = useState(false);
  let id = schedule.id;
  let currentIndex = items.findIndex((item) => item.status == 'current');
  let isRunning = (currentIndex >= 0);
  let firstFutureIndex = items.findIndex((item) => item.status == 'future');
  let lastItemEndAt = items.reduce((max, current) => {
    return current.end_at > max ? current.end_at : max;
  }, -Infinity);
  let timeSlotLength = items
    .filter((item) => item.status == 'future')
    .map((item) => {
      return ((new Date(item.end_at) - new Date(item.start_at)) / 1000) / 60;
    })[0];
  let overTime = lastItemEndAt - schedule.end;

  const handleDragStart = (e, index) => {
    setDraggedItem(items[index]);
    setTargetIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setTargetIndex(index);
  };

  async function handleDragEnd() {
    const sourceIndex = items.indexOf(draggedItem);
    setDraggedItem(null);

    if (sourceIndex !== targetIndex) {
      console.log("moving", draggedItem.name, "from", sourceIndex, "to", targetIndex);
      let min = Math.min(sourceIndex, targetIndex);
      let max = Math.max(sourceIndex, targetIndex);

      const updatedList = [...items];
      updatedList.splice(sourceIndex, 1);
      updatedList.splice(targetIndex, 0, draggedItem);
      if (min < max) {
        let newTimes = {};
        console.log("i should change around the times of all the items in between:");
        for (let i = min; i <= max; i++) {
          // console.log("item time", i, fmtTime(items[i].start_at), "-", fmtTime(items[i].end_at));
          newTimes[i] = { start_at: items[i].start_at, end_at: items[i].end_at };
        }
        for (let i = min; i <= max; i++) {
          // console.log("updated time", i,fmtTime(updatedList[i].start_at), "-", fmtTime(updatedList[i].end_at));
        }
        for (let i = min; i <= max; i++) {
          // console.log("changing time for", i,updatedList[i].name, "to", fmtTime(newTimes[i].start_at), "-", fmtTime(newTimes[i].end_at));
          updatedList[i].start_at = newTimes[i].start_at;
          updatedList[i].end_at = newTimes[i].end_at;
        }
      }
      // write to database, the update state!
      const { data, error } = await supabaseClient
        .from('items')
        .upsert(updatedList)
        .select();
      if (error) {
        console.log("error saving to database:", error);
      } else {
        console.log("saved to database:", data);
        setItems(convertItems(data));
      }
    }
  };

  function diff_mins(dt1, dt2) {
    let msec = new Date(dt2) - new Date(dt1);
    let s = msec / 1000;
    let mins = Math.round(s / 60);
    return mins;
  }

  async function handleStartClick(e) {
    let index = parseInt(e.target.id.split('_')[2]);
    let item = items[index];
    let params = { p_schedule_id: schedule.id, p_item_id: item.id, p_must_fit: mustFit };
    const { data, error } = await supabaseClient.rpc('start_schedule', params);
    if (!error) {
      setItems(convertItems(data));
    }
  }

  async function handleStopClick(e) {
    let index = parseInt(e.target.id.split('_')[2]);
    const { error } = await supabaseClient
      .from('items')
      .update({ end_at: new Date().toISOString(), status: 'past' })
      .eq('id', items[index].id);
    const { data: new_items, error: new_items_error } = await supabaseClient
      .from('items')
      .select('*')
      .eq('schedule_id', schedule.id)
      .order('start_at', { ascending: true });
    if (new_items_error) {
      console.log("errror", new_items_error);
    } else {
      setItems(convertItems(new_items));
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
              draggable={item.status === 'future'}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="w-10 mr-2">
                {(user && user.id == schedule.user_id) && (
                  <StartStopButtons {...{ item, index, currentIndex, firstFutureIndex, handleStopClick, handleStartClick }} />
                )}
                {' '}
              </div>
              <FormattedTime time={item.start_at} className="w-20 text-gray-600  mr-2" />
              <FormattedTime time={item.end_at} className="w-20 text-gray-600  mr-2" />
              <span className="w-24  text-right text-gray-600  mr-8" >{diff_mins(item.start_at, item.end_at)} Mins</span>
              <span>{item.name}</span>
            </li>
          )
        }
        )}
      </ol >
    </>
  )
}
