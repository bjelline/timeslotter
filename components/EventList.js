import FormattedTime from './FormattedTime';
import { isToday, isPast, isFuture } from 'date-fns'


export default function EventList({items, currentIndex}) {
  return (
    <ol className="item_list">
    {items.map((item, index) => {
      let className = 'current';
      if (index < currentIndex) {
        className = 'past';
      } else if (index > currentIndex) {
        className = 'future';
      }
      return (
        <li key={item.id} className={className} tabIndex="0"><FormattedTime time={item.start_at} /> {item.name}</li>
      )
    }
    )}
  </ol>
  )
}
