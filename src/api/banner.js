import {
  request
} from "@/api/axios";



let getBanner = function () {
  return request.get("/banner")
};


export const bannerApi = {
  getBanner
}
