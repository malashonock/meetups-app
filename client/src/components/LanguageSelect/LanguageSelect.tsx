import ReactSelect from 'react-select';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { SelectOption } from 'components';
import { useUiStore } from 'hooks';
import { Locale } from 'stores';

import styles from './LanguageSelect.module.scss';

const options: SelectOption<Locale>[] = [
  { value: Locale.EN, label: 'English' },
  { value: Locale.RU, label: 'Русский' },
];

export const LanguageSelect = observer((): JSX.Element => {
  const { uiStore } = useUiStore();

  const handleChange = (newOption: unknown): void => {
    if (uiStore) {
      uiStore.locale = (newOption as SelectOption<Locale>).value;
    }
  };

  return (
    <div className={styles.container}>
      <ReactSelect
        options={options}
        value={
          uiStore
            ? options.find((option) => option.value === uiStore.locale)
            : options[0]
        }
        onChange={handleChange}
        classNames={{
          control: (state) =>
            classNames(styles.input, {
              [styles.focused]: state.isFocused,
            }),
          menu: () => styles.menu,
          option: (state) =>
            classNames(styles.option, {
              [styles.selected]: state.isSelected,
            }),
        }}
      />
    </div>
  );
});
