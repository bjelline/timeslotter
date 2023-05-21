export function convertItems(items) {
  return items.map((item) => {
    return {
      ...item,
      end_at: new Date(item.end_at),
      start_at: new Date(item.start_at)
    };
  })
}

export function convertSchedule(schedule) {
  return {
    ...schedule,
    start: new Date(schedule.start),
    end: new Date(schedule.end)
  };
}

export function fmtTime(time) {
  let formattedTime = "??:??";
  try {
    const locale = 'de';
    const options = {
      hour: 'numeric',
      minute: '2-digit'
    };
    formattedTime = new Intl.DateTimeFormat(locale, options).format(time);
    if (formattedTime.startsWith('0')) formattedTime = formattedTime.slice(1);

  } catch (error) {
    formattedTime = "??:??";
  }
  return formattedTime;
}
