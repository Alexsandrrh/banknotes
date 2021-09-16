import React, { FC, ReactElement } from "react";
import styles from "./UserAccount.module.css";
import { Amount } from "@alfalab/core-components/amount";
import { CardImage } from "@alfalab/core-components/card-image";
import { Button } from "@alfalab/core-components/button";
import { useHistory } from "react-router-dom";
import { inject, observer } from "mobx-react";
import User from "../../store/user";

interface Props {
  user: User;
}

const UserAccount: FC<Props> = ({ user }): ReactElement => {
  const history = useHistory();
  const { debitAmount } = user;

  return (
    <div className={styles.block}>
      <div className={styles.head}>
        <span className={styles.name}>Ваш счет</span>
        <Amount value={debitAmount} currency="RUB" minority={1} />
      </div>
      <CardImage className={styles.card} width={280} cardId="SU" />
      <Button
        onClick={() => history.push("/add-nominal")}
        className={styles.button}
        view="primary"
      >
        Внести наличные
      </Button>
      <Button
        onClick={() => history.push("/get-nominal")}
        className={styles.button}
        view="secondary"
      >
        Снять наличные
      </Button>
    </div>
  );
};

export default inject("user")(observer(UserAccount));
