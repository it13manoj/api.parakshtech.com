const sequelize = require("../parakshDB/database");

const User = require("./User");
const Home = require("./home/home");
const ContactUs = require("./contact");
const Portfolio = require("./Portfolio");
const Service = require("./Service");
const Job = require("./Job");
const Team = require("./Team");
const Testimonial = require("./Testimonial");
const ContactInquiry = require("./ContactInquiry");
const SiteContent = require("./SiteContent");

module.exports = {
  sequelize,
  User,
  Home,
  ContactUs,
  Portfolio,
  Service,
  Job,
  Team,
  Testimonial,
  ContactInquiry,
  SiteContent,
};

