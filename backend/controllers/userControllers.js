import User from "../model/userModel.js";

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, mobile, image } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        mobile,
        image,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default updateUser;
