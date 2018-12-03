import { shield, not } from "graphql-shield";
import isAuthenticated from "./lib/middlewares/isAuthenticated";
import isParkingOwner from "./lib/middlewares/isParkingOwner";
import isAdministrator from "./lib/middlewares/isAdministrator";

export default shield({
  Query: {
    myInfo: isAuthenticated
  },
  Mutation: {
    registerUser: not(isAuthenticated),
    loginUser: not(isAuthenticated),
    logoutUser: isAuthenticated,
    removeVehicle: isAuthenticated,
   // addParkingArea: isParkingOwner,
    addUser: isAdministrator
  }
});
