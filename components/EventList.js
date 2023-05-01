import FormattedTime from './FormattedTime';
import { isToday, isPast, isFuture } from 'date-fns'


export default function EventList({items}) {
  return (
    <ol className="item_list">
    {items.map((item) => (
      <li key={item.id}><FormattedTime time={item.planned_start_at} /> {item.name}</li>
    ))}
  </ol>
  )
}
