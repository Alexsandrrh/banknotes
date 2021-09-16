import React, { Component } from "react";
import styles from "./GetNominal.module.css";
import { Link } from "react-router-dom";
import { AmountInput } from "@alfalab/core-components/amount-input";
import { Button } from "@alfalab/core-components/button";
import { CDNIcon } from "@alfalab/core-components/cdn-icon";
import { inject, observer } from "mobx-react";
import Cashpoint from "../../store/cashpoint";
import User from "../../store/user";

interface Props {
  cashpoint: Cashpoint;
  user: User;
}

interface State {
  amount: number | null;
  error: string | null;
  isSubmitting: boolean;
}

class GetNominal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      amount: null,
      error: null,
      isSubmitting: false,
    };
  }

  private setAmount = (value: number | null): void => {
    const { meta } = this.props.cashpoint;
    console.log(meta);
    const result: State = { ...this.state };
    if (value) {
      if (value < meta.min) {
        result.error = `Минимальная сумма для снятия ${meta.min}₽`;
      } else if (value > meta.max) {
        result.error = `Максимальная сумма для вывода ${meta.max}₽`;
      } else if (!value.toString().endsWith("00")) {
        result.error = 'Последние две цифры должны быть "00"';
      } else if (this.state.error) {
        result.error = null;
      }
    }

    result.amount = value;

    this.setState(result);
  };
  private handleChange = (_: any, payload: { value: null | number }) =>
    this.setAmount(payload.value);

  private handleSubmit = () => {
    const { amount } = this.state;
    if (amount) {
      const limits = this.props.cashpoint.getBanknotes(amount);

      if (!limits) {
        this.setState((state) => ({
          ...state,
          error: "Операция не может быть выполнена",
        }));
      } else {
        this.props.user.addBanknotes(limits);
      }
    }
  };

  render() {
    const { amount, error, isSubmitting } = this.state;
    const { cashpoint } = this.props;
    const { banknotesList } = cashpoint;

    return (
      <div className={styles.block}>
        <Link to="/" className={styles.head}>
          <CDNIcon name="glyph_arrow-back_m" />
          <span className={styles.title}>Снятие наличных</span>
        </Link>
        <AmountInput
          className={styles.amountInput}
          block
          label="Введите сумму"
          value={amount}
          onChange={this.handleChange}
          minority={1}
          error={error}
        />
        <div className={styles.quickAmount}>
          {banknotesList.map((banknote, key) => (
            <Button
              size="xs"
              key={key}
              view="filled"
              disabled={!banknote.count}
              onClick={() => this.setAmount(banknote.nominal)}
            >
              {banknote.nominal} ₽
            </Button>
          ))}
        </div>
        <Button
          block
          className={styles.buttonSubmit}
          view="primary"
          disabled={!amount}
          loading={isSubmitting}
          onClick={this.handleSubmit}
        >
          Снять
        </Button>
      </div>
    );
  }
}

export default inject("user", "cashpoint")(observer(GetNominal));
