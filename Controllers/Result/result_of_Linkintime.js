import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";
import getRandomUserAgent from "../../Utils/userAgentHelper.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const result_of_Linkintime = async (req, res) => {
    try {
        const { pan } = req.headers;
        const { company_id, company_name, registrar } = req.company;

        if (!pan) {
            return res.status(400).send("PAN number is required.");
        }

        // randomized delay (2-5 seconds)
        const delayTime = Math.floor(Math.random() * 3000) + 2000;
        await delay(delayTime);

        const tokenurl = "https://linkintime.co.in/initial_offer/IPO.aspx/generateToken";
        const scraperTokenUrl = `${process.env.SCRAPERAPI_URL}?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(tokenurl)}&country=IN&cache=true`;

        const tokenResponse = await axios.post(scraperTokenUrl, {}, {
            headers: {
                'User-Agent': getRandomUserAgent()
            }
        });
        const token = tokenResponse.data.d;

        await delay(delayTime);

        const url = "https://linkintime.co.in/initial_offer/IPO.aspx/SearchOnPan";
        const scraperApiUrl = `${process.env.SCRAPERAPI_URL}?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}&country=IN&cache=true`;

        const response = await axios.post(
            scraperApiUrl,
            {
                clientid: company_id,
                PAN: pan,
                IFSC: "",
                CHKVAL: "1",
                token
            },
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'User-Agent': getRandomUserAgent()
                }
            }
        );

        const xmlData = response.data.d;
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlData);

        const table = result.NewDataSet?.Table?.[0];
        if (table) {
            return res.status(200).json({
                COMPANY_ID: company_id,
                COMPANY_NAME: table.companyname[0],
                APPLICATION_NO: "",
                DPID: table.DPCLITID[0],
                NAME: table.NAME1[0],
                APPLIED: "",
                ALLOTED: table.ALLOT[0] !== "0" ? table.ALLOT[0] : "NON-ALLOTTED"
            });
        }

        return res.status(404).json({ message: `No allotment result found for this PAN: ${pan}` });
    } catch (error) {
        console.error("Error in Linkintime API:", error.message);
        res.status(500).json({ message: "Error calling Linkintime API", error: error.message });
    }
};

export default result_of_Linkintime;