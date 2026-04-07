import { Router } from 'express'
import { getHods, getStaff, getStudents } from '../controllers/userController'
import { authMiddleware } from '../middleware/authMiddleware'
import { roleMiddleware } from '../middleware/roleMiddleware'

const router = Router()

router.use(authMiddleware)

router.get('/students', roleMiddleware('staff', 'hod', 'principal'), getStudents)
router.get('/staff', roleMiddleware('hod', 'principal'), getStaff)
router.get('/hods', roleMiddleware('principal'), getHods)

export default router
