import express, { Router } from "express";
import path from "path";
import assignments from "./assignments";
import auth from "./authentication";
import cities from "./cities";
import congregations from "./congregations";
import files from "./files";
import general from "./general";
import go from "./go";
import health from "./health";
import maps from "./maps";
import publishers from "./publishers";
import scripts from "./scripts";
import users from "./users";

const router = Router();

router.use("/assignments", assignments);
router.use("/auth", auth);
router.use("/cities", cities);
router.use("/congregations", congregations);
router.use("/general", general);
router.use("/maps", maps);
router.use("/publishers", publishers);
router.use("/users", users);
router.use("/scripts", scripts);
router.use("/health", health);

if (process.env.IS_CYCLIC) router.use("/go/*", go);

router.use("/apple-app-site-association", files);
router.use("/.well-known", express.static(path.join(__dirname, "public")));

export default router;
