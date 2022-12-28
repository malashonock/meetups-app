import styles from './InputLabel.module.scss';

type Props = {
  text: string;
};

export function Label(props: Props): JSX.Element {
  return <h3 className={styles.label}>{props.text}</h3>;
}
