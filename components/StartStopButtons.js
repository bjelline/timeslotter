import Timer from './Timer';
import OverTimer from './OverTimer';
import FormattedTime from './FormattedTime';


export default function StartStopButtons({ item, currentIndex, index, handleStopClick, handleStartClick }) {
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
            ⏹
          </button>
        );
      return null;
    case 'future':
      if (currentIndex == -1) return (
        <button
          id={`start_item_${index}`}
          className="bg-blue-400  ml-4 pl-1 pr-1 rounded text-white"
          onClick={handleStartClick}>
          ▶
        </button>
      );
      return null;
    default:
      return null
  }
}
