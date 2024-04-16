import Comment from '../models/comment';

export async function createCommnents(commentData) {
  const { body, taskId, projectId, user } = commentData;

  const newComment = await Comment.create({ body, taskId, projectId, user });

  return newComment;
}

export async function deleteCommnents(commentData) {
  const { _id } = commentData;

  const comment = await Comment.findByIdAndDelete(_id);

  return comment;
}

export async function getAllTaskComments(req, res) {
  try {
    const { taskId } = req.body;

    const comments = await Comment.find({ taskId });

    res.status(200).json({
      status: 'success',
      comments,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      message: 'unable to fetch comments',
    });
  }
}
