import { useState } from 'react';
import {
  Assignment,
  SchoolActionKind,
  SumbissionGrade,
  useSchool,
  useSchoolDispatch,
} from './school-context';
import infinitasLogo from '/infinitas-logo.svg';
import './App.css';

type ReportForm = { assignmentId: string; date: string };

function App() {
  const school = useSchool();
  const schoolDispatch = useSchoolDispatch();

  const [studentEditingId, setUserEditingId] = useState<string | null>(null);
  const [updatedStudentName, setUpdatedStudentName] = useState<string>('');

  const [teacherEditingId, setTeacherEditingId] = useState<string | null>(null);
  const [newAssignedStudentId, setNewAssignedStudentId] = useState<
    string | null
  >(null);

  const [managingAssignment, setManagingAssignment] =
    useState<Assignment | null>(null);

  const [reportValues, setReportValues] = useState<ReportForm | null>(null);

  const handleTeacherSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const teacherName = target.teacher.value;
    const id = crypto.randomUUID();
    schoolDispatch?.({
      type: SchoolActionKind.ADD_TEACHER,
      payload: { name: teacherName, id, students: [] },
    });

    target.reset();
  };

  const handleStudentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const studentName = target.student.value;
    const id = crypto.randomUUID();
    schoolDispatch?.({
      type: SchoolActionKind.ADD_STUDENT,
      payload: { name: studentName, id },
    });

    target.reset();
  };

  const handleUpdateStudent = () => {
    if (studentEditingId) {
      schoolDispatch?.({
        type: SchoolActionKind.UPDATE_STUDENT,
        payload: { name: updatedStudentName, id: studentEditingId },
      });
    }

    setUserEditingId(null);
    setUpdatedStudentName('');
  };

  const handleAssignStudent = () => {
    if (teacherEditingId && newAssignedStudentId) {
      schoolDispatch?.({
        type: SchoolActionKind.ASSIGN_STUDENT_TO_TEACHER,
        payload: {
          teacherId: teacherEditingId,
          studentId: newAssignedStudentId,
        },
      });
    }

    setTeacherEditingId(null);
    setNewAssignedStudentId(null);
  };

  const handleAssignmentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.currentTarget;

    const assignmentName = target.assignment.value;
    const teacherId = target.teacherId.value;
    const dueDate = target.dueDate.value;
    const id = crypto.randomUUID();

    schoolDispatch?.({
      type: SchoolActionKind.ADD_ASSIGNMENT,
      payload: { id, name: assignmentName, teacherId, dueDate },
    });

    target.reset();
  };

  const handleReportFormChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.currentTarget;

    const formData = new FormData(target);
    const formValues = Object.fromEntries(formData.entries());
    setReportValues(formValues as ReportForm);
  };

  return (
    <div className="App">
      <div>
        <a href="/" target="_blank">
          <img src={infinitasLogo} className="logo" alt="Infinitas logo" />
        </a>
      </div>
      <h1>IL Interview</h1>
      <div className="section">
        <h2>Teacher</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {school?.teachers.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.name}</td>
                  <td>
                    <ul>
                      {teacher.students.map((s) => (
                        <li>
                          {school?.students.map((s1) =>
                            s === s1.id ? s1.name : ''
                          )}
                        </li>
                      ))}
                    </ul>
                    {teacher.id === teacherEditingId ? (
                      <>
                        <select
                          value={newAssignedStudentId || ''}
                          onChange={(e) =>
                            setNewAssignedStudentId(e.target.value)
                          }
                        >
                          <option value={''}></option>
                          {school?.students.map((student) => (
                            <option value={student.id}>{student.name}</option>
                          ))}
                        </select>
                        <button onClick={handleAssignStudent}>Assign</button>
                      </>
                    ) : (
                      <button onClick={() => setTeacherEditingId(teacher.id)}>
                        Assign student
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr></hr>
        <form onSubmit={handleTeacherSubmit}>
          <label htmlFor="teacher">Teacher</label>
          <input type="text" id="teacher" name="teacher" />
          <button type="submit">Add Teacher</button>
        </form>
      </div>
      <div className="section">
        <h2>Students</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {school?.students.map((student) => {
              return (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>
                    {student.id === studentEditingId ? (
                      <>
                        <input
                          type="text"
                          value={updatedStudentName}
                          onChange={(e) =>
                            setUpdatedStudentName(e.target.value)
                          }
                        ></input>
                        <button onClick={handleUpdateStudent}>Done</button>
                      </>
                    ) : (
                      <button onClick={() => setUserEditingId(student.id)}>
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr></hr>
        <form onSubmit={handleStudentSubmit}>
          <label htmlFor="student">Student</label>
          <input type="text" id="student" name="student" />
          <button type="submit">Add Student</button>
        </form>
      </div>
      <div className="section">
        <h2>Assignments</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Teacher</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {school?.assignments.map((it) => {
              return (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.name}</td>
                  <td>
                    {
                      school.teachers.find(
                        (teacher) => teacher.id === it.teacherId
                      )?.name
                    }
                  </td>
                  <td>{it.dueDate}</td>
                  <td>
                    <button onClick={() => setManagingAssignment(it)}>
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr></hr>
        <form onSubmit={handleAssignmentSubmit}>
          <label htmlFor="assignment">Assignment</label>
          <input type="text" id="assignment" name="assignment" required />
          <label htmlFor="teacherId">Teacher</label>
          <select id="teacherId" name="teacherId" required>
            <option value={''}></option>
            {school?.teachers.map((it) => (
              <option value={it.id}>{it.name}</option>
            ))}
          </select>
          <label htmlFor="dueDate">Due Date</label>
          <input type="date" id="dueDate" name="dueDate" required />
          <button type="submit">Add Assignment</button>
        </form>
      </div>
      {managingAssignment && (
        <div className="section">
          <h2>
            Manage Assignment:{' '}
            {
              school?.assignments.find(
                (assignment) => assignment.id === managingAssignment.id
              )?.name
            }
          </h2>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Date</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {school?.teachers
                ?.find((teacher) => teacher.id === managingAssignment.teacherId)
                ?.students.map((studentId) => {
                  const submission = school.submissions.find(
                    (submission) =>
                      submission.assignmentId === managingAssignment.id &&
                      submission.studentId === studentId
                  ) ?? {
                    studentId,
                    date: managingAssignment.dueDate,
                    teacherId: managingAssignment.teacherId,
                    assignmentId: managingAssignment.id,
                  };
                  return (
                    <tr key={studentId}>
                      <td>
                        {
                          school.students.find(
                            (student) => student.id === studentId
                          )?.name
                        }
                      </td>
                      <td>
                        <input
                          type="date"
                          value={submission?.date ?? managingAssignment.dueDate}
                          onChange={({ target: { value } }) =>
                            schoolDispatch?.({
                              type: SchoolActionKind.ADD_OR_UPDATE_SUBMISSION,
                              payload: {
                                ...submission,
                                date: value,
                              },
                            })
                          }
                        />
                      </td>
                      <td>
                        <select
                          onChange={({ target: { value: grade } }) =>
                            schoolDispatch?.({
                              type: SchoolActionKind.ADD_OR_UPDATE_SUBMISSION,
                              payload: {
                                ...submission,
                                grade: grade as SumbissionGrade,
                              },
                            })
                          }
                        >
                          <option value=""></option>
                          {Object.values(SumbissionGrade).map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
      <hr></hr>
      <div className="section">
        <h2>Report</h2>
        <form onChange={handleReportFormChange}>
          <label htmlFor="reportAssignment">Assignment</label>
          <select id="reportAssignment" name="assignmentId">
            {school?.assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.name}
              </option>
            ))}
          </select>
          <label htmlFor="reportDate">Date</label>
          <input type="date" id="reportDate" name="date" />
        </form>
        {reportValues && (
          <span>
            Total students with "PASSED":{' '}
            {
              school?.submissions.filter(
                ({ assignmentId, date, grade }) =>
                  assignmentId === reportValues.assignmentId &&
                  date === reportValues.date &&
                  grade === SumbissionGrade.PASS
              ).length
            }
          </span>
        )}
      </div>
    </div>
  );
}

export default App;
