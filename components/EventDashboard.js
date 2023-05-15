import Timer from './Timer';
import OverTimer from './OverTimer';
import FormattedTime from './FormattedTime';
import { isToday, isPast, isFuture } from 'date-fns'
import { useState } from 'react';


export default function EventDashboard({ supabaseClient, schedule, items }) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  // findIfCurrent();

  let item = null;
  let fullTime = 0;
  let remainingTime = 0;

  if (isRunning) {
    item = items[currentIndex];
    let fullTime = Math.floor((new Date(item.planned_end_at) - new Date(item.planned_start_at)) / 1000);
    let remainingTime = Math.floor((new Date(item.planned_end_at) - new Date()) / 1000);
    console.log('EventDashboard remainingTime', remainingTime)
  }

  function findIfCurrent() {
    const now = new Date();
    const index = items.findIndex((item) => {
      const start = new Date(item.started_at);
      return (start <= now && item.ended_at == null);
    });
    if(index >= 0) {
      setCurrentIndex(index);
      setIsRunning(true);
    }
  }

  function findIfRunning(schedule) {
    const now = new Date();
    const start = new Date(schedule.start);
    const end = new Date(schedule.end);

    return (start <= now && now <= end);
  }

  async function handleStartClick(e) {
    let index = parseInt(e.target.id.split('_')[2]);
    let item = items[index];
    let timestamp = new Date().toISOString();
    console.log("calling handleStartClick on", index, "item id=", item.id, "planned=", item.planned_start_at, "set started=", timestamp);
    const { error } = await supabaseClient
      .from('items')
      .update({ started_at: timestamp })
      .eq('id', items[index].id);
    console.log("error?", error);
    setCurrentIndex(index);
    setIsRunning(true);
  }

  async function handleStopClick(e) {
    let index = parseInt(e.target.id.split('_')[2]);
    console.log("calling handleStopClick on", index, "item", items[index]);
    const { error } = await supabaseClient
      .from('items')
      .update({ ended_at: new Date().toISOString()  })
      .eq('id', items[index].id);
    setCurrentIndex(-1);
    setIsRunning(false);
  }
  return (
    <>
      <ol className="item_list">
        {items.map((item, index) => {
          let className = 'current';
          if (index < currentIndex) {
            className = 'past';
          } else if (index > currentIndex) {
            className = 'future';
          }
          return (
            <li key={item.id} className={className} tabIndex="0">
              <FormattedTime time={item.planned_start_at} />
              {' '}
              <span className="text-gray-400 pl-2 pr-2">-</span>
              {item.name}
              {isRunning && index == currentIndex ? (
                <button
                  id={`stop_item_${index}`}
                  className="bg-blue-400  ml-4 pl-1 pr-1 rounded text-white show-on-hover"
                  onClick={handleStopClick}>
                  starten
                </button>
              ) : (
                <button
                  id={`start_item_${index}`}
                  className="bg-blue-400  ml-4 pl-1 pr-1 rounded text-white show-on-hover"
                  onClick={handleStartClick}>
                  starten
                </button>
              )}
            </li>
          )
        }
        )}
      </ol>
    </>
  )
}


/*

✓

      {isRunning ? (
        <div className="flex items-center gap-0.5 m-5 p-5 bg-slate-50/50 rounded-full w-full">
          <FormattedTime time={items[currentIndex].planned_start_at} /> -
          <FormattedTime time={items[currentIndex].planned_end_at} />
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
