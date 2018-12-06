import User from "../../models/User";
import {getConnection} from "typeorm";
import ParkingArea from "../../models/ParkingArea";

export const resolvers = {
  Query: {
    getParkingAreas: async (_, args, { user }) => {
      const connection = getConnection();
      const parkingAreaRepository = connection.getRepository(ParkingArea);

      const parkingAreas = await parkingAreaRepository.find({
        where: { ownerId: user.id }
      });
      console.log(parkingAreas)
      return parkingAreas
    },
  },
};
