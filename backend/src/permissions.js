import { shield, not, and } from "graphql-shield";
import isAuthenticated from "./lib/middlewares/isAuthenticated";
import isParkingOwner from "./lib/middlewares/isParkingOwner";
import isAdministrator from "./lib/middlewares/isAdministrator";

export default shield({
  Query: {
    myInfo: isAuthenticated,
    getNotifications: isAuthenticated
  },
  Mutation: {
    registerUser: not(isAuthenticated),
    loginUser: not(isAuthenticated),
    logoutUser: isAuthenticated,
    removeVehicle: isAuthenticated,
    addParkingArea: and(isAuthenticated, isParkingOwner),
    addUser: and(isAuthenticated, isAdministrator),
    addNotification: and(isAuthenticated, isAdministrator)    
  }
});
