it('should emit an unhandled rejection', async function() {
  setTimeout(() => {
    Promise.resolve().then(() => {
      throw new Error('yikes');
    });
  });
});
