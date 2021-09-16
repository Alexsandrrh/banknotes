import { makeObservable, observable, computed, action } from "mobx";

class User {
  debitAmount: number = 7900000;
  walletBanknotes: { [key: number]: number } = {
    2000: 1,
    1000: 4,
    100: 2,
  };

  constructor() {
    makeObservable(this, {
      debitAmount: observable,
      walletBanknotes: observable,
      walletBanknotesList: computed,
      addBanknotes: action,
      getBanknotes: action,
    });
  }

  get walletBanknotesList() {
    return Object.keys(this.walletBanknotes)
      .map(Number)
      .sort((a, b) => a - b)
      .map((nominal) => ({
        nominal,
        count: this.walletBanknotes[nominal],
      }));
  }

  addBanknotes(banknotes: { [key: number]: number }) {
    Object.keys(banknotes)
      .map(Number)
      .forEach((nominal) => {
        this.debitAmount -= nominal * banknotes[nominal];

        if (this.walletBanknotes[nominal]) {
          this.walletBanknotes[nominal] += banknotes[nominal];
        } else {
          this.walletBanknotes[nominal] = banknotes[nominal];
        }
      });
  }

  getBanknotes(banknotes: { [key: number]: number }) {
    Object.keys(banknotes)
      .map(Number)
      .forEach((nominal) => {
        this.debitAmount += nominal * banknotes[nominal];
        if (
          this.walletBanknotes[nominal] - this.walletBanknotes[nominal] >=
          0
        ) {
          this.walletBanknotes[nominal] -= banknotes[nominal];
        }
      });
  }
}

export default User;
