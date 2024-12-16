import cron from 'node-cron';
import fetchRegisterBigshareonline from "../Controllers/Register/register-bigshareonline.js";
import fetchRegisterLinkintime from "../Controllers/Register/register-linkintime.js";
import fetchRegisterMaashitla from "../Controllers/Register/register-maashitla.js";
import fetchRegisterSatellitecorporate from "../Controllers/Register/register-satellitecorporate.js";
import fetchRegisterBeetalmail from "../Controllers/Register/register-beetalmail.js";
import fetchRegisterAlankit from "../Controllers/Register/register-alankit.js";


const fetchAllRegister = async () => {
    // await fetchRegisterBigshareonline();
    await fetchRegisterLinkintime();
    // await fetchRegisterMaashitla();
    // await fetchRegisterSatellitecorporate();
    // await fetchRegisterBeetalmail();
    // await fetchRegisterAlankit();
};


const scheduleTimes = [
    { time: "0 1 * * *", message: "1:00 AM" },  // 1:00 AM
    { time: "30 1 * * *", message: "1:30 AM" }, // 1:30 AM
    { time: "0 2 * * *", message: "2:00 AM" },  // 2:00 AM
    { time: "30 2 * * *", message: "2:30 AM" }, // 2:30 AM
    { time: "0 3 * * *", message: "3:00 AM" },  // 3:00 AM
    { time: "30 3 * * *", message: "3:30 AM" }, // 3:30 AM
    { time: "0 7 * * *", message: "7:00 AM" },  // 7:00 AM
    { time: "0 8 * * *", message: "8:00 AM" },  // 8:00 AM
    { time: "0 9 * * *", message: "9:00 AM" },  // 9:00 AM
    { time: "0 10 * * *", message: "10:00 AM" }, // 10:00 AM
    { time: "0 11 * * *", message: "11:00 AM" }, // 11:00 AM
    { time: "0 12 * * *", message: "12:00 PM" } // 12:00 PM
];

const scheduleFetch = (time, message) => {
    cron.schedule(time, async () => {
        try {
            console.log(`Starting fetch at ${message}...`);
            await fetchAllRegister();
            console.log(`Successfully fetched and saved companies at ${message}`);
        } catch (error) {
            console.error(`Error fetching companies at ${message}:`, error.message);
        }
    });
};


export default () => {
    scheduleTimes.forEach(({ time, message }) => scheduleFetch(time, message));
};