import Cashpoint from "./cashpoint";
import User from "./user";

class Store {
  public cashpoint = new Cashpoint();
  public user = new User();
}

export default Store;
