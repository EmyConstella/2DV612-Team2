import { getConnection } from "typeorm";
import User from "../../models/User";
import emailSender from "../../nodemailer";
import createEmailConfirmToken from "../../lib/redis/createEmailConfirmToken";

const bcrypt = require("bcrypt");

export const resolvers = {
  Mutation: {
    registerUser: async (_, args, { redis }) => {
      const connection = getConnection();
      const saltRounds = 6;

      const hashedPassword = await bcrypt.hash(args.password, saltRounds);

      const user = new User(
        0,
        args.role,
        args.firstName,
        args.lastName,
        args.email,
        args.personalNumber,
        hashedPassword
      );
      const userRepository = connection.getRepository(User);

      // Query the database to check if user exists with email specified.
      const data = await userRepository.find({ where: { email: args.email } });

      // If user with specified email doesn't exist, save the user to the database.
      if (data.length < 1) {
        await connection.manager.save(user);

        // Create email token
        const token = await createEmailConfirmToken(user.id, redis);
        // TODO: use token in email
        console.log(token);

        // call send email function
        emailSender.sendEmail(args.email);

        return user;
      }
      // Throw Error?
      return null;
    }
  }
};
