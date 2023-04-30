import styles from '../styles/Home.module.css'
import ScheduleCard from '../components/ScheduleCard';

export default function ScheduleCards({ schedules }) {
  if(!schedules)
    return (
      <div className={styles.grid}>
        no data yet
      </div>
    )

  // console.log("ScheduleCards", schedules);
  // console.log("typeof schedules", typeof schedules[0]);

  return (
    <div className={styles.grid}>
      {schedules.map((sch) => (
        <ScheduleCard key={sch.id} schedule={sch} />
      ))}
    </div>
  );
}
