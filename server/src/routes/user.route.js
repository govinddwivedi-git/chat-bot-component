import {Router} from 'express';
import { loginUser, logoutUser, registerUser, refreshAccessToken, validateToken } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { chatResult, getChatHistory } from '../controllers/chat.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Chat routes
router.route("/chat").post(
    upload.single("image"),
    verifyJWT,
    chatResult
);

router.route("/chat-history").get(verifyJWT, getChatHistory);

// User routes  
router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/validate-token").get(verifyJWT, validateToken);

export default router;