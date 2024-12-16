import express from "express";
import checkCompanyMiddleware from "../Middlewares/checkCompanyMiddleware.js"
import result_of_Bigshareonline from "../Controllers/Result/result_of_Bigshareonline.js"
import result_of_LinkinTime from "../Controllers/Result/result_of_Linkintime.js"
import result_of_SatelliteCorporate from "../Controllers/Result/result_of_SatelliteCorporate.js";
import result_of_Alankit from "../Controllers/Result/result_of_Alankit.js"
import result_of_Maashitla from "../Controllers/Result/result_of_Maashitla.js"
import result_of_BeetalMail from "../Controllers/Result/result_of_BeetalMail.js"; 

const router = express.Router();

router.post('/ipo-result', checkCompanyMiddleware, async (req, res) => {
    try {
        const { registrar } = req.company;

        switch (registrar) {
            case "bigshareonline":
                return await result_of_Bigshareonline(req, res);

            case "linkintime":
                return await result_of_LinkinTime(req, res);

            case "satellitecorporate":
                return await result_of_SatelliteCorporate(req, res);

            case "alankit":
                return await result_of_Alankit(req, res);

            case "maashitla":
                return await result_of_Maashitla(req, res);

            case "beetalmail":
                return await result_of_BeetalMail(req, res);

            default:
                return res.status(400).json({ message: `Unsupported registrar type: ${registrar}` });
        }
    } catch (error) {
        console.error("Error handling IPO result request:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export default router;
