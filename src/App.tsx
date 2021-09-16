import React, { FC, ReactElement } from "react";
import { Switch, Route } from "react-router-dom";
import styles from "./App.module.css";

import UserAccount from "./соmponents/UserAccount";
import AddNominals from "./соmponents/AddNominal";
import GetNominal from "./соmponents/GetNominal";
import UserWallet from "./соmponents/UserWallet";

const App: FC = (): ReactElement => {
  return (
    <div className={styles.view}>
      {/* @ts-ignore */}
      <UserWallet />
      <Switch>
        <Route exact path="/" component={UserAccount} />
        <Route path="/add-nominal/" component={AddNominals} />
        <Route path="/get-nominal" component={GetNominal} />
      </Switch>
    </div>
  );
};

export default App;
