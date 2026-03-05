/**
 * Thrown when a database operation is attempted while the connection is not
 * in a connected state. Handlers can use `instanceof DatabaseNotConnectedError`
 * to distinguish this from other database or application errors.
 */
class DatabaseNotConnectedError extends Error {
  constructor(message = 'Database not connected') {
    super(message);
    this.name = 'DatabaseNotConnectedError';
  }
}

module.exports = { DatabaseNotConnectedError };
