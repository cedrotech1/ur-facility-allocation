import { checkprivileges, privileges } from '../helpers/privileges';

export const getAllPrivileges = (req, res) => {
  if (req.user.role !== 'HR' && req.user.role !== 'admin') {
    if (
      req.user.role === 'user' &&
      !checkprivileges(req.user.privileges, 'manage-users')
    )
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
  }

  return res.status(200).json({
    success: true,
    message: 'privileges fetched successfully',
    data: { privileges }
  });
};
