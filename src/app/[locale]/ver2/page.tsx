import styles from './ver2.module.css';

export default function Ver2Playground() {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.titleContainer}>
          <h1 className={styles.wordHello}>HELLO</h1>
          <h2 className={styles.wordLiar}>LIAR</h2>
        </div>
        
        <p className={styles.subtext}>
          A place to confess your truest lies.
        </p>

        <button className={styles.btnConfess}>
          CONFESS
        </button>
      </div>
    </div>
  );
}
