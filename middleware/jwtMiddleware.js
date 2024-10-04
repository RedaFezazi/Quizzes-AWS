const jwt = require("jsonwebtoken");

const jwtMiddleware = () => {
  return {
    before: async (handler) => {
      const token = handler.event.headers.Authorization?.split(" ")[1];

      if (!token) {
        throw new Error("Unauthorized");
      }

      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        handler.context.user = decodedToken;
      } catch (err) {
        throw new Error("Unauthorized");
      }
    },
  };
};

module.exports = jwtMiddleware;
