import ReactSelect from 'react-select';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { SelectOption } from 'components';
import { useLocale } from 'hooks';
import { Locale } from 'stores';

import styles from './LanguageSelect.module.scss';

const options: SelectOption<Locale>[] = [
  { value: Locale.EN, label: 'EN' },
  { value: Locale.RU, label: 'RU' },
];

interface LanguageSelectProps {
  onSelect?: () => void;
  isDropDown?: boolean;
}

export const LanguageSelect = observer(
  ({ onSelect, isDropDown = true }: LanguageSelectProps): JSX.Element => {
    const [locale, setLocale] = useLocale();

    const handleChange = (newOption: unknown): void => {
      const newLocale = (newOption as SelectOption<Locale>).value;
      setLocale(newLocale);
      onSelect?.call(null);
    };

    return (
      <div className={styles.container} data-testid="language-select">
        <ReactSelect
          options={options}
          value={
            locale
              ? options.find((option) => option.value === locale)
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
          styles={{
            menu: (baseStyles) =>
              isDropDown
                ? baseStyles
                : {
                    position: 'relative',
                    zIndex: 0,
                    border: 'none',
                  },
            dropdownIndicator: (baseStyles, props) => {
              const {
                selectProps: { menuIsOpen },
              } = props;
              return {
                ...baseStyles,
                transform: menuIsOpen ? 'rotate(180deg)' : undefined,
              };
            },
          }}
        />
      </div>
    );
  },
);
