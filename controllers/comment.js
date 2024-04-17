import Comment from '../models/comment';

export async function createCommnents(req, res) {
  try {
    const { body, taskId, projectId, user } = req.body;

    const newComment = await Comment.create({ body, taskId, projectId, user });

    res.status(200).json({
      status: 'success',
      comment: newComment,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      message: 'Unable to create comments',
    });
  }
}

export async function deleteCommnents(req, res) {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      comment,
    });

    return comment;
  } catch (error) {

  }
}

// req res cycle
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
