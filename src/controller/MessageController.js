import cloudinary from "../lib/Cloudinary.js";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";

export const getUsersInSidebar = async (req, res) => {
  try {
    const Myid = req.user._id;
    const users = await User.find({ _id: { $ne: Myid } }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { id } = req.params;
  const MyId = req.user.id;
  try {
    const message = await Message.find({
      $or: [
        { senderId: MyId, receiverId: id },
        { senderId: id, receiverId: MyId },
      ],
    });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const MyId = req.user._id;
    const {message,image} = req.body
    let imageUrl;
   if (image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
    }
    const newMessage = new Message({
        senderId:MyId,
        receiverId:id,
        message,
        image:imageUrl
    })

    
    await newMessage.save()
     return res.status(200).json(newMessage);

  } catch (error) {
     return res.status(500).json({ message: error.message });
  }
};
