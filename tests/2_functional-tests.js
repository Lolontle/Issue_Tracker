const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { Test } = require('mocha');

chai.use(chaiHttp);

let deleteID;
suite('Functional Tests', function() {
  suite("Routing Tests", function () {
      suite("3 Post request Tests", function() {
          test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
              chai
                .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_by: "FCC",
                    assigned_to: "Dom",
                    status_text: "Not Done",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    deleteID = res.body._id;
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.assigned_to, "Dom");
                    assert.equal(res.body.created_by, "FCC");
                    assert.equal(res.body.status_text, "Not Done");
                    assert.equal(res.body.issue_text, "Functional Test");
                    done();
                });
          });
          test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
              chai
                .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_by: "fCC",
                    assigned_to: "",
                    status_text: "",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200)
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.created_by, "fCC");
                    assert.equal(res.body.issue_text, "Functional Test");
                    assert.equal(res.body.assigned_to, "");
                    assert.equal(res.body.status_text, "");
                    
                    done();
                });
          });
          test("Create an issue with missing required fields: Post request to /api/issues/{project}", function (done) {
              chai
                .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                    issue_title: "",
                    issue_text: "",
                    created_by: "",
                    assigned_to: "",
                    status_text: "",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    // console.log("res status", res.status)
                    assert.equal(res.body.error, "required field(s) missing");
                    done();
                });
          });
      });

      suite("3 Get request Tests", function () {
          test("View issues on a project: GET request to /api/issues/{project}", function (done) {
              chai
                .request(server)
                .get("/api/issues/projects")
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 37);
                    done();
                });
          });
          test("View issues on a project with one filter: Get request to /api/issues/{project}", function (done) {
            chai
            .request(server)
            .get("/api/issues/projects")
            .query({
                _id: "607daafbd1611b00c60aa63d" // Put in test id
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body[0], {
                    _id: "607daafbd1611b00c60aa63d", // Put in test id
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_on: "2021-04-19T16:08:27.271Z",
                    updated_on: "2021-04-19T16:08:27.271Z",
                    created_by: "FCC",
                    assigned_to: "",
                    open: true,
                    status_text: "",
                });
                done();
            });
      });
      test("View issues on a project with two filters: Get request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .get("/api/issues/projects")
        .query({
            issue_title: "Issue",
            issue_text: "Functional Test",
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
                _id: "607daafbd1611b00c60aa63d", // Put in test id
                issue_title: "Issue",
                issue_text: "Functional Test",
                created_on: "2021-04-19T16:08:27.271Z",
                updated_on: "2021-04-19T16:08:27.271Z",
                created_by: "FCC",
                assigned_to: "",
                open: true,
                status_text: "",
            });
            done();
      });  
  });
});
suite("5 Put request Test", function () {
    test("Update one field on an issue: PUT request to /api/issues/test-data.put", function (done) {
        chai
        .request(server)
        .put("/api/issues/projects")
        .send({
            _id: "607dab2cd23d0a0115763e24", // Put test id
            issue_title: "different"
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "607dab2cd23d0a0115763e24");
            done();
        });
    });
    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/projects")
        .send({
            _id: "607dad15f2baf50043b3d05e",
            issue_title: "random",
            issue_text: "random",
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "607dad15f2baf50043b3d05e");
            done();
        });
    });
    test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/projects")
        .send({
            _id: "",
            issue_title: "update",
            issue_text: "update",
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            
            done();
        });
    });
    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/projects")
        .send({
            _id: "607db04b6dfd0b0037d0756b",
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");
            
            done();
        });
    });
    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/projects")
        .send({
            _id: "utr64768hjbjxdf68p",
            issue_title: "update",
            issue_text: "update",
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");
            
            done();
        });
    });
});

suite("3 DELETE request tests", function() {
    test("DELETE an issue: DELETE request to /api/issues/projects", function (done) {
        chai
            .request(server)
            .delete("/api/issues/projects")
            .send({
                _id: deleteID,
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, "successfully deleted");

                done();
            });
    });
    test("DELETE an issue with an invalid _id: DELETE request to /api/issues/projects", function (done) {
        chai
            .request(server)
            .delete("/api/issues/projects")
            .send({
                _id: "6a7dd53y89te53f079d1c5g4",
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "could not delete");

                done();
            });
    });
    test("DELETE an issue with missing _id: DELETE request to /api/issues/projects", function (done) {
        chai
            .request(server)
            .delete("/api/issues/projects")
            .send({ _id: "" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "missing _id");

                done();
            });
    });

    });
});
  });