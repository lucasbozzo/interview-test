import { SchoolActionKind, schoolReducer } from '../src/school-context';

describe('School reducer test', () => {
  describe('Add Teacher action', () => {
    it('should add a teacher', () => {
      const state = schoolReducer(
        { teachers: [], students: [], assignments: [], submissions: [] },
        {
          type: SchoolActionKind.ADD_TEACHER,
          payload: { id: '1', name: 'First Teacher', students: [] },
        }
      );
      expect(state.teachers[0].id).to.equal('1');
    });
  });
  describe('Add an Assignment action', () => {
    it('should add an assignment', () => {
      const state = schoolReducer(
        { teachers: [], students: [], assignments: [], submissions: [] },
        {
          type: SchoolActionKind.ADD_ASSIGNMENT,
          payload: {
            id: '1',
            name: 'Math Quiz #1',
            teacherId: '1',
            dueDate: '2025-01-01',
          },
        }
      );
      expect(state.assignments[0]).toEqual({
        id: '1',
        name: 'Math Quiz #1',
        teacherId: '1',
        dueDate: '2025-01-01',
      });
    });
  });
  describe('Create or update a Submission action', () => {
    it("should create a submission if doesn't exist", () => {
      const state = schoolReducer(
        { teachers: [], students: [], assignments: [], submissions: [] },
        {
          type: SchoolActionKind.ADD_OR_UPDATE_SUBMISSION,
          payload: {
            assignmentId: '1',
            studentId: '2',
            teacherId: '3',
            date: '2025-01-01',
          },
        }
      );
      expect(state.submissions[0]).toEqual({
        assignmentId: '1',
        studentId: '2',
        teacherId: '3',
        date: '2025-01-01',
      });
    });
    it('should update a submission if exists', () => {
      const submission = {
        assignmentId: '1',
        studentId: '2',
        teacherId: '3',
        date: '2025-01-01',
      };
      const state = schoolReducer(
        {
          teachers: [],
          students: [],
          assignments: [],
          submissions: [submission],
        },
        {
          type: SchoolActionKind.ADD_OR_UPDATE_SUBMISSION,
          payload: {
            ...submission,
            date: '2025-02-02',
          },
        }
      );
      expect(state.submissions[0].date).toEqual('2025-02-02');
    });
  });
});
