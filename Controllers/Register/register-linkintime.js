import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";
import IpoModel from "../../Models/IpoModel.js";
import getRandomUserAgent from "../../Utils/userAgentHelper.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCompanyId = async () => {
    try {
        // randomized delay (2-5 seconds)
        const delayTime = Math.floor(Math.random() * 3000) + 2000;
        await delay(delayTime);

        const url = "https://linkintime.co.in/initial_offer/IPO.aspx/GetDetails";
        const scraperApiUrl = `${process.env.SCRAPERAPI_URL}?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}&country=IN&cache=true`;

        const response = await axios.post(scraperApiUrl, {}, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'User-Agent': getRandomUserAgent()
            }
        });

        const xmlData = response.data.d;
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlData);

        return result.NewDataSet?.Table?.map(table => ({
            company_id: table.company_id[0],
            company_name: table.companyname[0]
        })) || [];
    } catch (error) {
        console.error("Error fetching company list:", error.message);
        throw error;
    }
};


const fetchRegisterLinkintime = async () => {
    try {
        const data = await fetchCompanyId();

        for (let i = 0; i < data.length; i++) {
            const { company_id, company_name } = data[i];
            const isExist = await IpoModel.findOne({ company_name: company_name });
            if (isExist) break;
            if (company_id) {
                await IpoModel.create({ company_id, company_name, registrar_name: "linkintime" });
            }
        }
        return;
    } catch (error) {
        console.error("Company fetch error:", error.message);
        throw error;
    }
};

export default fetchRegisterLinkintime;