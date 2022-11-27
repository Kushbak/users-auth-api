const Router = require('express')
const userController = require('../controllers/user-controller')
const { body } = require('express-validator')
const router = new Router()
const authMiddleware = require('../middlewares/auth.middleware')

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Auth:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            description: The email of the user.
 *          password:
 *            type: string
 *            description: password of the user.
 *        example:
 *           email: "example.com"
 *           password: "example"
 */


/**
 *  @swagger
 *  /signup:
 *    post:
 *      summary: You can create user without id .But you should give email,password,name and age.
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: The created book
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/users'
 *        500:
 *          description: Server error
 */
router.post(
  '/signup', 
  body('email').isEmail(),
  body('password').isLength({ max: 32, min: 8 }),
  body('name').exists(),
  body('age').exists(),
  userController.signup
)


/**
 *  @swagger
 *  /signin:
 *    post:
 *      summary: You can sign in to your account.
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Auth'
 *      responses:
 *        200:
 *          description: The created book
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/users'
 *        500:
 *          description: Server error
 *        404:
 *          description: Login or Password invalid
 */
router.post('/signin', userController.signin)


router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)


/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *          - password
 *          - name
 *          - age
 *        properties:
 *          _id:
 *            type: string
 *            description: The auto-generated id of the user.
 *          email:
 *            type: string
 *            description: The email of the user.
 *          password:
 *            type: string
 *            description: password of the user.
 *          name:
 *            type: string
 *            description: name of the user.
 *          age:
 *            type: number
 *            description: age of the user.
 *        example:
 *           age: 20
 *           email: "example@mail.com"
 *           name: "example"
 *           password: "example1"
 */

/**
 *  @swagger
 *  tags:
 *    name: Users
 *    description: API to manage the users in the database.
 */

/**
 *  @swagger
 *  /users:
 *    get:
 *      summary: Lists all the users
 *      tags: [Users]
 *      responses:
 *        200:
 *          description: The list of all users.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/users'
 */
router.get('/users', authMiddleware, userController.getUsers)


/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the user by token
 *     tags: [Users]
 *     headers:
 *         name: authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       404:
 *         description: The User not found.
 */
router.get('/users/me', authMiddleware, userController.getMe)


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       404:
 *         description: The User not found.
 */
router.get('/users/:id', authMiddleware, userController.getUser)

/**
 *  @swagger
 *  /signup:
 *    post:
 *      summary: You can create user without id .But you should give email,password,name and age.
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: The created book
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/users'
 *        500:
 *          description: Server error
 */
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update the user by id
 *     tags: [Users]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was updated
 *       404:
 *         description: The user not found.
 */
router.patch('/users/:id', authMiddleware, userController.updateUser)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user not found.
 */
router.delete('/users/:id', authMiddleware, userController.deleteUser)

module.exports = router