import { getRolls } from "../models/RollAct.js"

const getRollPermissions = async (objName, par1, par2) => {
    try {
        const rollPermission = await getRolls(objName, par1, par2);
        return rollPermission;
    } catch (err) {
        throw new Error(`Greška prilikom provere prava uH_singin: ${err.message}`);
    }
};

export default {
    getRollPermissions,
};