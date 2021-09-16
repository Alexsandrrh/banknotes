import { makeObservable, observable, action, computed } from "mobx";

export interface ILimits {
  [key: number]: number;
}

export interface IBanknote {
  nominal: number;
  count: number;
}

class Cashpoint {
  limits: ILimits = {
    5000: 4,
    2000: 6,
    1000: 9,
    500: 8,
    200: 2,
    100: 5,
  };

  constructor() {
    makeObservable(this, {
      limits: observable,
      nominals: computed,
      totalAmount: computed,
      meta: computed,
      banknotesList: computed,
      getBanknotes: action,
    });
  }

  // Получаем все номиналы
  get nominals(): number[] {
    return Object.keys(this.limits).map(Number);
  }

  // Получаем доступные номиналы
  get availableNominals(): number[] {
    return this.nominals.filter((n) => this.limits[n] !== 0);
  }

  // Получаем сумму
  get totalAmount(): number {
    return this.nominals.map((n) => n * this.limits[n]).reduce((a, b) => a + b);
  }

  // Мета данные для настроек
  get meta(): { min: number; max: number } {
    const min = Math.min(...this.availableNominals);

    return {
      min,
      max: this.totalAmount,
    };
  }

  // Получаем массив банкнот
  get banknotesList(): IBanknote[] {
    return this.nominals
      .sort((a, b) => a - b)
      .map((nominal) => ({
        nominal,
        count: this.limits[nominal],
      }));
  }

  getBanknotes = (amount: number): ILimits | undefined => {
    if (amount === this.totalAmount) {
      this.nominals.map((n) => (this.limits[n] = 0));
    } else {
      const sortedNominals = this.availableNominals.sort((a, b) => b - a);

      const getLimitsAmount = (
        amount: number,
        nominals: number[]
      ): ILimits | undefined => {
        // Поверяем остаток суммы для выдачи
        if (amount === 0) return {};

        // Проверяем наличие номинала
        if (!nominals.length) return;

        let currentNominal = nominals[0];
        let countOfBanknotes = Math.min(
          this.limits[currentNominal],
          Math.floor(amount / currentNominal)
        );

        for (let count = countOfBanknotes; count >= 0; count--) {
          let limits: ILimits | undefined = getLimitsAmount(
            amount - count * currentNominal,
            nominals.slice(1)
          );

          if (limits) {
            return count ? { [currentNominal]: count, ...limits } : limits;
          }
        }
      };

      const limits = getLimitsAmount(amount, sortedNominals);

      if (limits) {
        for (const nominal of Object.keys(limits)) {
          const n = +nominal;
          if (this.limits[n] - this.limits[n] >= 0) {
            this.limits[n] -= limits[n];
          }
        }
      }

      return limits;
    }
  };

  addBanknotes = (banknotes: ILimits) => {
    for (const nominal of Object.keys(banknotes)) {
      const n = +nominal;
      if (this.limits[n]) {
        this.limits[n] += banknotes[n];
      } else {
        this.limits[n] = banknotes[n];
      }
    }
  };
}

export default Cashpoint;
