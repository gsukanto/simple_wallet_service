import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import bluebird from "bluebird";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import multer from "multer";

import { Authenticate } from "./middlewares/authentication";
import { ValidateInitWalletRequest, ValidateDisableWalletRequest, ValidateDepositRequest, ValidateWithdrawalRequest } from "./middlewares/requestValidation";
import { requestLogger, expressErrorLogger } from "./util/logger";
import { initWallet, getWallet, postWallet, patchWallet } from "./controllers/wallet";
import { postDeposit, postWithdrawal } from "./controllers/transaction";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().array("")); // Parsing form-data
app.use(requestLogger);
app.use(expressErrorLogger);
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        mongoUrl,
        mongoOptions: {
            useUnifiedTopology: true
        }
    })
}));

// Set up route inside /api/v1
const v1 = express.Router();
v1.post("/init", ValidateInitWalletRequest, initWallet);
v1.get("/wallet", Authenticate, getWallet);
v1.post("/wallet", Authenticate, postWallet);
v1.patch("/wallet", ValidateDisableWalletRequest, Authenticate, patchWallet);
v1.post("/wallet/deposits", ValidateDepositRequest, Authenticate, postDeposit);
v1.post("/wallet/withdrawals", ValidateWithdrawalRequest, Authenticate, postWithdrawal);


/**
 * Primary app routes.
 */
app.use("/api/v1", v1);
app.get("/health", (_req, res) => res.json({ status: "UP" }));

export default app;