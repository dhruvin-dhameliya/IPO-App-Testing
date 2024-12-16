import axios from "axios";
import dotenv from "dotenv";
import IpoModel from "../../Models/IpoModel.js";
import getRandomUserAgent from "../../Utils/userAgentHelper.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchRegisterAlankit = async () => {
    try {
        // randomized delay (2-5 seconds)
        const delayTime = Math.floor(Math.random() * 3000) + 2000;
        await delay(delayTime);

        const url = "http://ipo.alankit.com/Query/companylist";
        const scraperApiUrl = `${process.env.SCRAPERAPI_URL}?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}&country=IN&cache=true`;

        const response = await axios.get(scraperApiUrl, {
            headers: {
                'User-Agent': getRandomUserAgent()
            }
        });
        const data = response.data;

        for (let i = 0; i < data.length; i++) {
            let { CompanyCode, CompanyName } = data[i];
            const isExist = await IpoModel.findOne({ company_name: CompanyName });
            if (isExist) break;
            if (CompanyCode) {
                await IpoModel.create({ company_id: CompanyCode, company_name: CompanyName, registrar_name: "alankit" });
            }
        }
        return;
    } catch (error) {
        console.error("Company fetch error:", error.message);
        throw error;
    }
};

export default fetchRegisterAlankit;