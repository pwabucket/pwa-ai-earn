import { LeonardoProvider } from "./LeonardoProvider";

class DjangoProvider extends LeonardoProvider {
  async validate() {
    const data = await super.validate();
    const userInfo = data.userInfo;

    delete userInfo["interestList"];

    return { data: userInfo };
  }
}

export { DjangoProvider };
