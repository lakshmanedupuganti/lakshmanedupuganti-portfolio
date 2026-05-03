import type { AxiosRequestConfig, AxiosResponse } from "axios";

const axios = async <T = any, R = T>(
  config: AxiosRequestConfig<T>
): Promise<AxiosResponse<R>> => {
  const ret = (await import("axios")).default;
  return ret(config);
};

export default axios;
