const jwt = require("jsonwebtoken");
const Project = require('../models/Project')

const secret = process.env.JWT_SECRET;
const expiration = "24h";

function authMiddleware(req, res, next) {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.body?.token || req.query?.token || req.headers?.authorization;

  // We split the token string into an array and return actual token
  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    next();
  }

  // If token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch {
    console.log("Invalid token");
  }

  // Return the request object so it can be passed to the resolver as `context`
  //   return req;
  next();
}

async function getProjectMiddleware(req, res, next) {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "Can't find the project ID on this path"})
    }

    const project = await Project.findById(projectId);

    if(!project) {
      res.status(404).json({message: `Project with id: ${projectId} not found!`});
    }

    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'User is not authorized to managage tasks for this project!'});
    }

    req.project = project;
    next();

  } catch (error) {
    console.error('Error in getProjectMiddleware:', error);
    res.status(500).json({error: 'Server error finding project' });
  }
}

// A middleware to check for admin role
function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
}

function signToken({ username, email, _id }) {
    const payload = { username, email, _id };
 
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }

module.exports = {
  authMiddleware,
  adminOnly,
  signToken,
  getProjectMiddleware
};
