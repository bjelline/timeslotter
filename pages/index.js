import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Timeslotter - keep tracks of timeslots</title>
        <meta name="description" content="a one page app to keep track of timeslots" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Timeslotter
        </h1>

        <p className={styles.description}>
          Let's set up your schedule!
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Project Presentations</h2>
            <p>something</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>exams</h2>
            <p>about somethings</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>create a new schedule</h2>
            <p>about something</p>
          </a>

        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://brigitte-jellinek.at"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by by Brigitte Jellinek
        </a>
      </footer>
    </div>
  )
}
