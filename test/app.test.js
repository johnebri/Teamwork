require('dotenv').config();
process.env.NODE_ENV = 'test';

const chai = require("chai");

const chaiHttp = require("chai-http");

const app = require("../server");
const testDb = require('./testHelper');

const environment = process.env.NODE_ENV; // test

const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4xLmVicmlAeWFob28uY29tIiwidXNlcklkIjo0NCwicm9sZSI6InVzZXIiLCJpYXQiOjE1NzUwMzI0ODgsImV4cCI6MTU3NTA1MDQ4OH0.BWPC8cuu-yVAqBIN4FXJ-STz8YKfnrjFudNjW4es1jA';

const { expect } = chai;
chai.use(chaiHttp);
describe("Teamwork API Tests", () => {
    it('User can signin', done => {
        const user = {
            email: "john.ebri@yahoo.com",
            password: "12345678"
        };
        chai
            .request(app)
            .post('/api/v1/auth/signin')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
    it("Displays an error message when email or password is not correct", done => {
        const user = {
            email: "wrongemail@this.com",
            password: "wrongpassword"
        };
        chai
            .request(app)
            .post('/api/v1/auth/signin')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    })
});