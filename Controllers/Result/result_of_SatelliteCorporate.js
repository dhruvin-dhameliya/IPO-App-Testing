import axios from "axios";
import dotenv from "dotenv";
import getRandomUserAgent from "../../Utils/userAgentHelper.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const result_of_SatelliteCorporate = async (req, res) => {
    try {
        const { pan } = req.headers;
        const { company_id, company_name, registrar } = req.company;

        if (!pan) {
            return res.status(400).send("PAN number is required.");
        }

        // randomized delay (2-5 seconds)
        const delayTime = Math.floor(Math.random() * 3000) + 2000;
        await delay(delayTime);

        const url = `https://www.satellitecorporate.com/mainAjax.php?action=search_applicant&data_search=pan_no&company=${company_id}&search_no=${pan}`;
        const scraperApiUrl = `${process.env.SCRAPERAPI_URL}?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}&country=IN&cache=true`;

        const response = await axios.get(scraperApiUrl, {
            headers: {
                'User-Agent': getRandomUserAgent()
            }
        });

        const resData = response.data.applicantDetails;
        if (resData && resData.length > 0) {
            return res.status(200).json({
                COMPANY_ID: company_id,
                COMPANY_NAME: company_name,
                APPLICATION_NO: resData.application_Number,
                DPID: resData.demat_Account_Number,
                NAME: resData.name,
                APPLIED: resData.share_Applied,
                ALLOTED: resData.share_Alloted !== "0" ? res.share_Alloted : "NON-ALLOTTED"
            });
        }

        return res.status(404).json({ message: `No allotment result found for this PAN: ${pan}` });
    } catch (error) {
        console.error("Error in SatelliteCorporate API:", error.message);
        res.status(500).json({ message: "Error calling SatelliteCorporate API", error: error.message });
    }
};

export default result_of_SatelliteCorporate;