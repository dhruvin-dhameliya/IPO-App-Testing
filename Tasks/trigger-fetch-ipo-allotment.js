import axios from "axios";
import cron from "node-cron";
import schedulingTask from "../Tasks/triggerAPI-date-match.js";

const fetchAllotmentDateAndScheduleTask = async () => {
    try {
        const response = await axios.get('https://webnodejs.chittorgarh.com/cloud/report/data-read/118/1/12/2024/2024-25/0/mainline?search=');
        const ipoData = response.data?.reportTableData || [];

        const currentDate = new Date().toISOString().split("T")[0];

        const eligibleCompanies = ipoData.filter(company => {
            return !company["~IPO_Listing_date"] && company["~Timetable_BOA_dt"].startsWith(currentDate);
        });

        if (eligibleCompanies.length > 0) {
            console.log('YES eligible companies for today: ', eligibleCompanies.length);
            schedulingTask();
        } else {
            console.log('No eligible companies for today.');
        }
    } catch (error) {
        console.error('Error fetching or processing IPO data:', error.message);
    }
};

export default () => {
    cron.schedule("0 1 * * *", async () => { // Every day 1:00 AM
        await fetchAllotmentDateAndScheduleTask();
        console.log('Scheduled task (fetch allotment date) completed.');
    }, {
        timezone: "Asia/Kolkata"
    });
};