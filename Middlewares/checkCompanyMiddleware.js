import IpoModel from "../Models/IpoModel.js";

const checkCompanyMiddleware = async (req, res, next) => {
    try {
        const { company_name } = req.headers;

        if (!company_name) {
            return res.status(400).json({ message: "Company name is required." });
        }

        const company = await IpoModel.findOne({ company_name });

        if (!company) {
            return res.status(404).json({ message: `Company ${company_name} not found.` });
        }

        const registrar = company.registrar_name.toLowerCase();

        req.company = {
            company_id: company.company_id,
            company_name: company.company_name,
            registrar
        };
        next();
    } catch (error) {
        console.error("Error in middleware:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export default checkCompanyMiddleware;
