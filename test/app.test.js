const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const request = require('supertest');

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



});