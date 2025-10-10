export const ok = () => {
  console.log("ok");
};

// there must be an async involved somewhere or the error does not trigger
await Promise.resolve("something");

// simulate an error in a module
throw new Error("stop");