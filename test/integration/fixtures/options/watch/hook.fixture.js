export default {
  mochaHooks: {
    ["<hook>"]: function() {
      throw new Error("<hook> Hook Error");
    },
  },
};
