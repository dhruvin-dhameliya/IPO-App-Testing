import axios from "axios";
import dotenv from "dotenv";
import * as cheerio from "cheerio";
import getRandomUserAgent from "../../Utils/userAgentHelper.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchToken = async () => {
    try {
        // randomized delay (2-5 seconds)
        const delayTime = Math.floor(Math.random() * 3000) + 2000;
        await delay(delayTime);

        const tokenurl = "https://www.beetalmail.com/smeipo.aspx";
        const scraperTokenUrl = `${process.env.SCRAPERAPI_URL}?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(tokenurl)}&country=IN&cache=true`;

        const response = await axios.get(scraperTokenUrl, {
            headers: {
                'User-Agent': getRandomUserAgent()
            }
        });
        const $ = cheerio.load(response.data);

        return {
            viewstate: $('#__VIEWSTATE').val().trim(),
            eventvalidation: $('#__EVENTVALIDATION').val().trim(),
        };
    } catch (error) {
        console.error("Error generating token:", error.message);
        throw error;
    }
};

const convertIntoJson = (company_id, company_name, html) => {
    const $ = cheerio.load(html);
    return {
        COMPANY_ID: company_id,
        COMPANY_NAME: company_name,
        APPLICATION_NO: $('#ctl00_CPHDetails_rep1_ctl00_Lblaplno').text().trim(),
        DPID: $('#ctl00_CPHDetails_rep1_ctl00_lbldpcl').text().trim(),
        NAME: $('#ctl00_CPHDetails_rep1_ctl00_lblname').text().trim(),
        PAN: $('#ctl00_CPHDetails_rep1_ctl00_lblpan').text().trim(),
        APPLIED: $('#ctl00_CPHDetails_rep1_ctl00_applied').text().trim(),
        ALLOTED: $('#ctl00_CPHDetails_rep1_ctl00_lblallot').text().trim() !== "0" ?
            $('#ctl00_CPHDetails_rep1_ctl00_lblallot').text().trim() : "NON-ALLOTED",
    };
};

const result_of_BeetalMail = async (req, res) => {
    try {
        const { pan } = req.headers;
        const { company_id, company_name, registrar } = req.company;

        if (!pan) {
            return res.status(400).send("PAN number is required.");
        }

        const token = await fetchToken();

        // randomized delay (2-5 seconds)
        const delayTime = Math.floor(Math.random() * 3000) + 2000;
        await delay(delayTime);

        const url = "https://www.beetalmail.com/smeipo.aspx";
        const scraperApiUrl = `${process.env.SCRAPERAPI_URL}?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}&country=IN&cache=true`;

        const response = await axios.post(
            scraperApiUrl,
            new URLSearchParams({
                '__VIEWSTATE': token.viewstate,
                '__VIEWSTATEGENERATOR': '79E9CD7B',
                '__EVENTVALIDATION': token.eventvalidation,
                'ctl00$CPHDetails$DropDownList1': company_id,
                'ctl00$CPHDetails$txtappl': '',
                'ctl00$CPHDetails$Txtpan': pan,
                'ctl00$CPHDetails$dpcl': '',
                'ctl00$CPHDetails$Button1': 'Submit'
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': getRandomUserAgent()
                }
            }
        );

        const result = convertIntoJson(company_id, company_name, response.data);

        if (result.NAME) {
            return res.status(200).json({ result });
        }
        return res.status(404).json({ message: `No allotment result found for this PAN: ${pan}` });
    } catch (error) {
        console.error("Error in BeetalMail API:", error.message);
        res.status(500).json({ message: "Error calling BeetalMail API", error: error.message });
    }
};

export default result_of_BeetalMail;