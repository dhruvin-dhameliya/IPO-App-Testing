import * as cheerio from "cheerio";
import axios from "axios";
import dotenv from "dotenv";
import IpoModel from "../../Models/IpoModel.js";
import getRandomUserAgent from "../../Utils/userAgentHelper.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchRegisterSatellitecorporate = async () => {
    try {
        // randomized delay (2-5 seconds)
        const delayTime = Math.floor(Math.random() * 3000) + 2000;
        await delay(delayTime);

        const url = "https://www.satellitecorporate.com/ipo-query.php";
        const scraperApiUrl = `${process.env.SCRAPERAPI_URL}?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}&country=IN&cache=true`;

        const response = await axios.get(scraperApiUrl, {
            headers: {
                'User-Agent': getRandomUserAgent()
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        const options = $('#company option');

        for (let i = 0; i < options.length; i++) {
            const element = options[i];
            const company_id = $(element).val().trim();
            const company_name = $(element).text().trim();

            const isExist = await IpoModel.findOne({ company_name: company_name });
            if (isExist) break;
            if (company_id && company_id !== "Select Company") {
                await IpoModel.create({ company_id, company_name, registrar_name: "satellitecorporate" });
            }
        }
        return;
    } catch (error) {
        console.error("Company fetch error:", error.message);
        throw error;
    }
};

export default fetchRegisterSatellitecorporate;