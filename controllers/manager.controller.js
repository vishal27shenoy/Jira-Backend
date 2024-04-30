const Project = require("../models/project.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const addProjects = async (req, res) => {
  try {
    const { projectName, projectMembers, projectManager } = req.body;

    if (projectName?.trim() == "" || projectMembers?.length == 0) {
      return res.status(204).json({ message: "Provide all required details" });
    }

    const isProject = await Project.findOne({ projectName: projectName });
    if (isProject) {
      return res
        .status(403)
        .json({ message: "Project with this name already exist" });
    }

    const createProject = new Project({
      projectName: projectName,
      projectMembers: projectMembers,
      projectManager: projectManager,
    });

    const projectSaved = await createProject.save();

    const result = await User.updateMany(
      { _id: { $in: projectMembers } },
      {
        $push: {
          project: projectSaved._id,
        },
      }
    );

    console.log("this is result", result);

    if (projectSaved) {
      return res.status(200).json({ message: "Project Created Successfully" });
    } else {
      return res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addDeveloper = async (req, res) => {
  try {
    const { projectMembers } = req.body;
    const projectID = req.query.projectID;
    console.log(projectMembers, projectID);

    if (projectMembers?.length == 0 || projectID) {
      console.log("came here subayeel");
      return res.status(204).json({ message: "Provide all required details" });
    }

    const projectExist = await Project.updateOne(
      { _id: projectID, projectMembers: { $nin: projectMembers } },
      { $push: { projectMembers: { $each: projectMembers } } }
    );

    const result = await User.updateMany(
      { _id: { $in: projectMembers }, project: { $nin: [projectID] } },
      {
        $push: {
          project: projectID,
        },
      }
    );

    if (projectExist.acknowledged) {
      return res.status(200).json({ message: "Developer Added Successfully" });
    } else {
      return res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeDeveloper = async (req, res) => {
  try {
    const { projectMembers } = req.body;
    const projectID = req.query.projectID;

    if (projectMembers?.length == 0 || !projectID) {
      return res.status(204).json({ message: "Provide all required details" });
    }
    console.log("came here");
    const projectExist = await Project.updateOne(
      { _id: projectID, projectMembers: { $in: projectMembers } },
      { $pull: { projectMembers: { $in: projectMembers } } }
    );

    const usersProject = await User.updateMany(
      { _id: { $in: projectMembers } },
      { $pull: { project: projectID } }
    );

    if (usersProject.acknowledged && projectExist.acknowledged) {
      return res
        .status(200)
        .json({ message: "Developer Removed Successfully" });
    } else {
      return res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllProject = async (req, res) => {
  try {
    const userID = req.query.userID;

    const allProjects = await Project.find({
      projectMembers: { $in: [userID] },
    });
    if (allProjects) {
      return res.status(200).json({ data: allProjects });
    } else {
      return res.status(204).json({ message: "no content" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getDeveloper = async (req, res) => {
  try {
    const response = await User.find({ role: "Employee" }).select(
      "userName email _id"
    );
    console.log(response);
    if (response) {
      return res.status(200).json({ data: response });
    } else {
      return res.status(404).json({ message: "No Developer Found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchDevelopers = async (req, res) => {
  try {
    const key = req.query.key;
    const userID = req.query.userID;
    console.log(key);
    const response = await User.find({
      $or: [{ userName: key }, { email: key }],
      _id: { $nin: [userID] },
    }).select("userName email _id");
    console.log(response, "this is searched");

    if (response?.length > 0) {
      return res.status(200).json({ data: response });
    } else {
      return res.status(404).json({ message: "No Developer Found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addProjects,
  addDeveloper,
  removeDeveloper,
  getAllProject,
  getDeveloper,
  searchDevelopers,
};
