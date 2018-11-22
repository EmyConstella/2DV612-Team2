import {getConnection} from "typeorm";
import User from "../../models/User";
import emailSender from "../../nodemailer";

const bcrypt = require("bcrypt");


export const resolvers = {
  Mutation: {
    registerUser: async (_, args) => {
      let connection = getConnection()
      let saltRounds = 6

      // await Promise for the password to be hashed before proceeding
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(args.password, saltRounds, async (err, hash) => {
          if (err)
          reject(err)
          resolve(hash)
        })
      })
      
      let user = new User(args.role, args.firstName, args.lastName, args.email, args.personalNumber, hashedPassword)
      let userRepository = connection.getRepository(User)

      // Query the database to check if user exists with email specified.
      let data = await userRepository.find({ where: {email: args.email }})

      // If user with specified email doesn't exist, save the user to the database.
      if (data.length < 1) {
        // call send email function
        emailSender.sendEmail(args.email);        
        return connection.manager.save(user) 
      } else {
        // Throw Error?
      }
    },
  },
};