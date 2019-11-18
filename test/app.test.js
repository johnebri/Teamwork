// var assert = require("assert");
// let chai = require("chai");
// let chaiHttp = require("chai-http");
// let server = require("../app");
// let should = chai.should();
// chai.use(chaiHttp);

// const Pool = require('pg').Pool
// const pool = new Pool({
//     user: process.env.USER,
//     host: process.env.HOST,
//     database: process.env.DB,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// })

// describe("Feed", function(){
//   describe("Get all feeds", function(){
//     it("should fetch all feed", done=>{
//       console.log('getting feeds');
//       chai.request(server)
//       .get('/api/v1/feed')
//       .end((err,res) => {
//         res.should.have.status(200);
//         console.log("Response body", res.body);
//         done()
//       })
//     })
//   });
// });

// const app = require("../app");
// const chai = require("chai");
// const chaiHttp = require("chai-http");

// const request = require('supertest');

// const { expect } = chai;
// chai.use(chaiHttp);
// describe("Server!", () => {

//   it("when no end point is specified", done => {
//     chai
//     .request(app)
//     .post('/')
//     .end((err, res) => {
//         expect(res).to.have.status(404);
//         expect(res.body.error.message).to.equals("Not Found");
//         done();
//     });
//   });

//   it("When signin is successful", done => {

//     // const user = {
//     //     email: 'john1234@yahoo.com',
//     //     password: '12345678'
//     // };   
    

//     // chai
//     //   .request(app)
//     //   .post("/api/v1/auth/signin")
//     //   .send(user)
//     //   .end((err, res) => {
//     //     expect(res).to.have.status(200);
//     //     expect(res.body.message).to.equals("success");
//     //     done();
//     //   });
//   });

// });