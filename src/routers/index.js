import express from 'express';

import docrouter from '../documentation/index.doc';
import userRouter from './userRouter';
import authRouter from './authRouter';
import schoolRouter from './schoolRouter';
import collegeRouter from './collegeRouter';
import campusRouter from './campusRouter';
import facilityRouter from './facilityRouter';
import departmentRouter from './departmentRouter';
import programRouter from './programRouter';
import privilegesRouter from './privilegesRouter';
import intakeRouter from './intakeRouter';
import groupRouter from './groupRouter';
import bookingRouter from './bookingRouter';
import notificationRouter from './notificationRouter';
import moduleRouter from './moduleRouter';
const router = express.Router();

router.use('/docs', docrouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/college', collegeRouter);
router.use('/school', schoolRouter);
router.use('/campus', campusRouter);
router.use('/facilities', facilityRouter);
router.use('/department', departmentRouter);
router.use('/program', programRouter);
router.use('/privileges', privilegesRouter);
router.use("/intake", intakeRouter);
router.use("/group", groupRouter);
router.use("/booking", bookingRouter);
router.use("/notifications", notificationRouter);
router.use("/modules", moduleRouter);

export default router;
