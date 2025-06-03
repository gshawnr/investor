import Target from "../models/Target";
import TargetGeneratorService from "./TargetGeneratorService";
import { ITarget } from "../types/ITarget";

class TargetService {
  async createTarget() {
    await TargetGeneratorService.createTargets();
  }

  async getTargets({ filter = {}, options = {} }): Promise<ITarget[]> {
    return Target.find(filter, null, options);
  }

  async deleteTargets(ticker_year?: string) {
    if (ticker_year) {
      console.log(`removing ${ticker_year} target`);
      return Target.deleteMany({ ticker_year });
    } else {
      console.log("removing all existing targets");
      return Target.deleteMany({});
    }
  }
}

export default new TargetService();
