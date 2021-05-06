import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { format, parseISO, setMilliseconds } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeStrig';
import styles from './home.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../contexts/PlayerContext';


type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  durationAsString: string;
  duration: number;
}

type HomeProps = {
  lastEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ lastEpisodes, allEpisodes }: HomeProps) {

  const { playList } = usePlayer()

  const episodeList = [...lastEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
     <section className={styles.lastEpisodes}>
      <h2>Últimos lançamentos</h2>

      <ul>
        {lastEpisodes.map((episode, index) =>{
          return(
            <li key={episode.id}>
              <Image
                width={192} 
                height={192} 
                objectFit="cover"
                src={episode.thumbnail} 
                alt={episode.title}
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episode/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button" onClick={() => playList(episodeList, index)}>
                <img src="/play-green.svg" alt="Tocar episodio"/>
              </button>

            </li>
          )
        })}
      </ul>
     </section>
     <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) =>{
              return(
                <tr>
                  <td style={{width:72}}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width:100}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + lastEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
     </section>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,

    }
  })

  const lastEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return{
    props:{
      lastEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}