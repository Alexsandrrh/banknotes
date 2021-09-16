import React, { FC, ReactElement, ChangeEvent, useState } from "react";
import styles from "./AddNominal.module.css";
import { Link } from "react-router-dom";
import { SliderInput } from "@alfalab/core-components/slider-input";
import { Amount } from "@alfalab/core-components/amount";
import { Button } from "@alfalab/core-components/button";
import { CDNIcon } from "@alfalab/core-components/cdn-icon";
import { inject, observer } from "mobx-react";
import Cashpoint from "../../store/cashpoint";
import User from "../../store/user";

interface Props {
  cashpoint: Cashpoint;
  user: User;
}

const AddNominals: FC<Props> = ({ user, cashpoint }): ReactElement => {
  const { walletBanknotesList } = user;
  const [values, setValues] = useState<{ [key: number]: number }>({});
  const amountOfValues = Object.keys(values)
    .map(Number)
    .map((n) => n * values[n])
    .reduce((a, b) => a + b, 0);

  const handleSubmit = () => {
    user.getBanknotes(values);
    cashpoint.addBanknotes(values);
  };

  return (
    <div className={styles.block}>
      <Link to="/" className={styles.head}>
        <CDNIcon name="glyph_arrow-back_m" />
        <span className={styles.title}>Пополнение счета</span>
      </Link>
      <div className={styles.nominals}>
        {walletBanknotesList.map((banknote, key) => (
          <SliderInput
            key={key}
            className={styles.input}
            block
            min={0}
            max={banknote.count}
            label={`${banknote.nominal} ₽`}
            value={values[banknote.nominal]}
            onChange={(
              e: ChangeEvent<HTMLInputElement>,
              payload: { value: number | "" }
            ) => {
              setValues((state) => ({
                ...state,
                [banknote.nominal]: +payload.value,
              }));
            }}
          />
        ))}
      </div>
      <div className={styles.amount}>
        <span className={styles.name}>Итог:</span>
        <Amount value={amountOfValues} currency="RUB" minority={1} />
      </div>
      <Button
        block
        view="primary"
        onClick={handleSubmit}
        disabled={!amountOfValues}
      >
        Пополнить
      </Button>
    </div>
  );
};

export default inject("user", "cashpoint")(observer(AddNominals));
