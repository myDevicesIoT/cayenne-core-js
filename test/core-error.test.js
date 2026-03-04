const { expect } = require('code');
const CoreError = require('../lib/CoreError');

describe('[CoreError]', () => {
  describe('constructor', () => {
    it('should set isCore flag', () => {
      const error = new CoreError('test error');
      expect(error.isCore).to.be.true();
    });

    it('should preserve string message as originalMessage', () => {
      const error = new CoreError('Database connection failed');
      expect(error.originalMessage).to.equal('Database connection failed');
    });

    it('should preserve Error instance message as originalMessage', () => {
      const cause = new Error('Upstream timeout');
      const error = new CoreError(cause);
      expect(error.originalMessage).to.equal('Upstream timeout');
    });

    it('should restore message in output.payload for 5xx errors', () => {
      const error = new CoreError('Service unavailable');
      // Default CoreError is 500 (server error)
      expect(error.isServer).to.be.true();
      expect(error.output.payload.message).to.equal('Service unavailable');
    });

    it('should NOT override output.payload.message for 4xx errors', () => {
      const error = CoreError.badRequest('Invalid input');
      expect(error.isServer).to.be.false();
      expect(error.output.statusCode).to.equal(400);
      expect(error.output.payload.message).to.equal('Invalid input');
    });

    it('should set status from output.statusCode', () => {
      const error = new CoreError('test');
      expect(error.status).to.equal(error.output.statusCode);
    });
  });

  describe('static factory methods', () => {
    it('InvalidConfiguration should be badRequest', () => {
      const error = CoreError.InvalidConfiguration();
      expect(error.output.statusCode).to.equal(400);
      // Note: badRequest is not overridden via CoreError.override(),
      // so isInternal is stored in Boom's data property, not on the error directly
      expect(error.data.isInternal).to.be.true();
    });

    it('InvalidCredentials should be unauthorized and internal', () => {
      const error = CoreError.InvalidCredentials();
      expect(error.output.statusCode).to.equal(401);
      expect(error.isInternal).to.be.true();
      expect(error.isCore).to.be.true();
    });

    it('CachedNotFound should be notFound and cached', () => {
      const error = CoreError.CachedNotFound();
      expect(error.output.statusCode).to.equal(404);
      expect(error.isCache).to.be.true();
      expect(error.isCore).to.be.true();
    });
  });

  describe('instanceof check', () => {
    it('should identify CoreError instances via Symbol.hasInstance', () => {
      const error = new CoreError('test');
      expect(error instanceof CoreError).to.be.true();
    });

    it('should not match plain Error', () => {
      const error = new Error('test');
      expect(error instanceof CoreError).to.be.false();
    });
  });

  describe('error propagation for server errors', () => {
    it('should propagate string message through output.payload for 500', () => {
      const error = new CoreError('Fuse validation failed');
      expect(error.output.statusCode).to.equal(500);
      expect(error.output.payload.message).to.equal('Fuse validation failed');
      expect(error.originalMessage).to.equal('Fuse validation failed');
    });

    it('should propagate Error message through output.payload for 500', () => {
      const cause = new Error('Connection refused');
      const error = new CoreError(cause);
      expect(error.output.statusCode).to.equal(500);
      expect(error.output.payload.message).to.equal('Connection refused');
      expect(error.originalMessage).to.equal('Connection refused');
    });

    it('should handle undefined message gracefully', () => {
      const error = new CoreError();
      expect(error.isCore).to.be.true();
      expect(error.originalMessage).to.be.undefined();
    });

    it('should handle empty string message', () => {
      const error = new CoreError('');
      expect(error.isCore).to.be.true();
      expect(error.originalMessage).to.be.undefined();
    });
  });
});
