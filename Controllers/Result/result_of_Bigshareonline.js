import axios from "axios";
import dotenv from "dotenv";
import getRandomUserAgent from "../../Utils/userAgentHelper.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const result_of_Bigshareonline = async (req, res) => {
    try {
        const { pan } = req.headers;
        const { company_id, company_name, registrar } = req.company;

        if (!pan) {
            return res.status(400).send("PAN number is required.");
        }

        // randomized delay (2-5 seconds)
        const delayTime = Math.floor(Math.random() * 3000) + 2000;
        await delay(delayTime);

        const url = "https://ipo.bigshareonline.com/Data.aspx/FetchIpodetails";
        const scraperApiUrl = `${process.env.SCRAPERAPI_URL}?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}&country=IN&cache=true`;

        const response = await axios.post(
            scraperApiUrl,
            {
                Applicationno: "",
                Company: company_id,
                SelectionType: "PN",
                PanNo: pan,
                txtcsdl: "",
                txtDPID: "",
                txtClId: "",
                ddlType: ""
            },
            {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'User-Agent': getRandomUserAgent()
                }
            }
        );

        const resData = response.data.d;
        if (resData && resData.APPLICATION_NO) {
            return res.status(200).json({
                COMPANY_ID: company_id,
                COMPANY_NAME: company_name,
                APPLICATION_NO: resData.APPLICATION_NO,
                DPID: resData.DPID,
                NAME: resData.Name,
                APPLIED: resData.APPLIED,
                ALLOTED: resData.ALLOTED
            });
        }

        return res.status(404).json({ message: `No allotment result found for this PAN: ${pan}` });
    } catch (error) {
        console.error("Error in Bigshareonline API:", error.message);
        res.status(500).json({ message: "Error calling Bigshareonline API", error: error.message });
    }
};

export default result_of_Bigshareonline;