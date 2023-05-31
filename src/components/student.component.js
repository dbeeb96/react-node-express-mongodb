import React, { Component } from "react";
import StudentDataService from "../services/student.service";

export default class Student extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeCourse = this.onChangeCourse.bind(this);
    this.getStudent = this.getStudent.bind(this);
    this.updateRegistered = this.updateRegistered.bind(this);
    this.updateStudent = this.updateStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);

    this.state = {
      currentStudent: {
        id: null,
        name: "",
        course: "",
        registered: false,
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getStudent(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function (prevState) {
      return {
        currentStudent: {
          ...prevState.currentStudent,
          name: name,
        },
      };
    });
  }

  onChangeCourse(e) {
    const course = e.target.value;

    this.setState(prevState => ({
      currentStudent: {
        ...prevState.currentStudent,
        course: course,
      },
    }));
  }

  getStudent(id) {
    StudentDataService.get(id)
      .then(response => {
        this.setState({
          currentStudent: response.data,
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateRegistered(status) {
    var data = {
      id: this.state.currentStudent.id,
      name: this.state.currentStudent.name,
      course: this.state.currentStudent.course,
      registered: status,
    };

    StudentDataService.update(this.state.currentStudent.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentStudent: {
            ...prevState.currentStudent,
            registered: status,
          },
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateStudent() {
    StudentDataService.update(
      this.state.currentStudent.id,
      this.state.currentStudent
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The Student was updated successfully!",
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteStudent() {
    StudentDataService.delete(this.state.currentStudent.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push("/Students");
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentStudent } = this.state;

    return (
      <div>
        {currentStudent ? (
          <div className="edit-form">
            <h4>Student</h4>
            <form>
              <div className="form-group">
                <label htmlFor="Name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="Name"
                  value={currentStudent.name}
                  onChange={this.onChangeName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Course">Course</label>
                <input
                  type="text"
                  className="form-control"
                  id="Course"
                  value={currentStudent.course}
                  onChange={this.onChangeCourse}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentStudent.registered ? "Registered" : "Pending"}
              </div>
            </form>

            {currentStudent.registered ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateRegistered(false)}>
                UnRegister
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateRegistered(true)}>
                Register
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteStudent}>
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateStudent}>
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Student...</p>
          </div>
        )}
      </div>
    );
  }
}
