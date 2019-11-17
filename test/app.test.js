const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);
describe("Server!", () => {

  it("when no end point is specified", done => {
    chai
    .request(app)
    .post('/')
    .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.message).to.equals("Not Found");
        done();
    });
  });

//   it("When signin is successful", done => {

//     const user = {
//         email: 'john1234@yahoo.com',
//         password: '12345678'
//     };

//     chai
//       .request(app)
//       .post("/api/v1/auth/signin")
//       .send(user)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equals("success");
//         done();
//       });
//   });

//   it("adds 2 numbers", done => {
//     chai
//       .request(app)
//       .post("/add")
//       .send({ num1: 5, num2: 5 })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.status).to.equals("success");
//         expect(res.body.result).to.equals(10);
//         done();
//       });
//   });
});