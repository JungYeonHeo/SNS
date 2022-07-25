const nodemailer = require("nodemailer");
const { createRandomNumber, createRandomPassword } = require("../utils/createAuthInfo");
const response = require("./response");
const dotenv = require("dotenv");
dotenv.config();

const variable = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PW,
  },
});

const emailConfirmOptions = {
  from: process.env.EMAIL,
  to: "",
  subject: response.EMAIL_CONFIRM_FROM_SNS,
  html:
    `<h2>${response.EMAIL_SECRET_KEY}</h2>
    <h4 style='background: #ccc; padding: 20px'>createRandomNumber(6)</h4>`,
};

const loginConfirmOptions = {
  from: process.env.EMAIL,
  to: "",
  subject: response.EMAIL_NEW_LOGIN,
  html: 
    `<h2>${response.EMAIL_LOGIN_INFO}</h2>
    <p>${response.EMAIL_LOGIN_TIME}: </p> 
    <p>${response.EMAIL_LOGIN_LOCATION}: </p> 
    <p>${response.EMAIL_LOGIN_DEVICE}: </p> 
    <hr>
    <p>${response.EMAIL_IS_IT_YOU}</p>
    <button onclick=\"location.href()\">${response.EMAIL_YES}</button>
    <button onclick=\"location.href()\">${response.EMAIL_NO}</button>`, 
};

const tempPWOptions = {
  from: process.env.EMAIL,
  to: "",
  subject: response.EMAIL_TEMP_PW,
  html:
    `<h3>${response.EMAIL_TEMP_PW}</h3> 
    <h2 style='background: #ccc; padding: 20px'>${createRandomPassword(variable, 8)}</h2>
    <h3 style='color: crimson;'>${response.EMAIL_TEMP_PW_WARNING}</h3>`
};

module.exports = { transporter, emailConfirmOptions, loginConfirmOptions, tempPWOptions };