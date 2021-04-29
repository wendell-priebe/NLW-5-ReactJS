import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './styles.module.scss';

export default function Header(){
  //const currentDate = new Date().toLocaleDateString() // metodo pegando a hora e formato do dispositivo 
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })  //usando biblioteca date-fns para formatar a data

  return(
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />
      
      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>
    </header>
  );
}