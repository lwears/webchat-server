import userService from './userService';

describe('Testing userService functions', () => {
  const userObject = {
    id: '4',
    username: 'David',
  };

  beforeEach(() => {
    userService.addUser('Daniel', '1');
    userService.addUser('Liam', '2');
  });

  afterEach(() => {
    userService.removeUser('1');
    userService.removeUser('2');
  });

  describe('Validate function - Reject invalid usernames', () => {
    test('It should reject usernames that are too short ', () => {
      function throwErrorShortUsername() {
        userService.validateUsername('li');
      }
      expect(throwErrorShortUsername).toThrow(Error);
    });
    test('It should reject usernames with invalid characters ', () => {
      function throwErrorInvalidChars() {
        userService.validateUsername('li€$');
      }
      expect(throwErrorInvalidChars).toThrow(Error);
    });
  });
  describe('addUser function', () => {
    test('It should add and return a user', () => {
      expect(userService.addUser('David', '4')).toMatchObject(userObject);
    });

    test('It should throw an error if username already exists', () => {
      function throwErrorUserExists() {
        userService.addUser('Daniel', '5');
      }
      expect(throwErrorUserExists).toThrow(Error);
    });
  });

  describe('getAllUsers function', () => {
    test('Should return an array with user', () => {
      expect(userService.getAllUsers()).toContainEqual(userObject);
    });
    test('Should return an array', () => {
      expect(Array.isArray(userService.getAllUsers())).toBe(true);
    });
  });

  describe('getUser function', () => {
    test('Should return a user object', () => {
      expect(userService.getUser('4')).toMatchObject(userObject);
    });
  });

  describe('removeUser function', () => {
    test('Should remove user and return a user object', () => {
      expect(userService.removeUser('4')).toMatchObject(userObject);
      expect(userService.getAllUsers).not.toContainEqual(userObject);
    });
  });
});
