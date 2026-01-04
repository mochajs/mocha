// Simple TypeScript test example for Mocha
describe('TypeScript Example', function() {
  it('should run TypeScript tests', function() {
    const message: string = 'Hello TypeScript!';
    if (message.length === 0) {
      throw new Error('Message should not be empty');
    }
  });

  it('should handle async operations', async function() {
    const delay = (ms: number): Promise<void> => 
      new Promise(resolve => setTimeout(resolve, ms));
    
    await delay(1);
    // Test passes if we reach here
  });
});
