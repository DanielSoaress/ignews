import Head from 'next/head';
import { GetStaticProps } from 'next';
import styles from './home.module.scss';

export default function Home({  }) {
  return (
    <>
      <Head>
        <title>Home | lostCode</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span><div className={styles.hand}>🖐</div> Hello World!</span>
          <h1>Novidades sobre o mundo do <span>desenvolvimento</span></h1>
          <p>
            Compartilho um pouco do meu trabalho<br />
            e alguns aprendizados
          </p>
        </section>
        
        <div className={styles.imgContainer}>
          <img src="/images/avatar.png" alt="lostCode coding" />
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      
    },
    revalidate: 60 * 60 * 24, //24 hours
  }
}
