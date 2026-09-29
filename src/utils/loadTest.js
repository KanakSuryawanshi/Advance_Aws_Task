import http from "k6/http";
import { sleep } from "k6";

export const options = {
    vus: 100,
    duration: "3m",
};

export default function () {
    http.get("http://tnplabalb-1735675416.ap-south-1.elb.amazonaws.com/api/health");
    sleep(1);
}