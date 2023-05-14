import Timer from './Timer';
import OverTimer from './OverTimer';
import FormattedTime from './FormattedTime';
import { isToday, isPast, isFuture } from 'date-fns'
import { useState } from 'react';
import { FlapDisplay, Presets } from 'react-split-flap-effect';


export default function EventDashboard({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  let title_width = Math.max(...items.map(i => i.name.length))
  let words = items.map(i => i.name);
  let item = items[currentIndex];

  // console.log("words", words, "length", title_width);

  if (isRunning) {
    let fullTime = Math.floor((new Date(item.planned_end_at) - new Date(item.planned_start_at)) / 1000);
    let remainingTime = Math.floor((new Date(item.planned_end_at) - new Date()) / 1000);
    console.log('EventStatus remainingTime', remainingTime)
  }
  return (
    <>
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
              {item.ended_at ? (
                <span>✓</span>
              ) : (
                <button className=" bg-blue-400  ml-4 pl-1 pr-1 rounded text-white show-on-hover">
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
