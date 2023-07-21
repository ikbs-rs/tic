import Userpermiss from "../models/Userpermiss.js";

// U petlji vrtim prosledjeni slog i proveravam da li je dodeljen korisniku
export const checkUserPermissions = async (userId, roles) => {
    try {
      for (let i = 0; i < roles.length; i++) {
        const role = roles[i].roll;
        const userPermission = await Userpermiss.getUserPermission(userId, role);
        if (userPermission) {
          return true; // korisnik ima dozvole za dati set uloga
        }
      }
      return false; // korisnik nema dozvole za dati set uloga
    } catch (error) {
      throw new Error(`Greška pri provjeri korisničkih dozvola: ${error.message}`);
    }
  };