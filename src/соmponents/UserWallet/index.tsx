import React, { FC, ReactElement } from "react";
import styles from "./UserWallet.module.css";
import { Badge } from "@alfalab/core-components/badge";
import { inject, observer } from "mobx-react";
import User from "../../store/user";

interface Props {
  user: User;
}

const UserWallet: FC<Props> = ({
  user: { walletBanknotesList },
}): ReactElement => {
  return (
    <div className={styles.block}>
      <h3 className={styles.title}>Ваш кошелёк</h3>
      <div className={styles.nominals}>
        {walletBanknotesList.map((banknote, key) => (
          <div key={key} className={styles.nominal}>
            {banknote.nominal}
            <Badge
              className={styles.count}
              view="count"
              content={banknote.count}
              size="m"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default inject("user")(observer(UserWallet));
