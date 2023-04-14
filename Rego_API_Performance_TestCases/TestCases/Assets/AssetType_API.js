// To import all the required packages.
import { sleep } from 'k6';
import { check } from 'k6';
import * as AssetTypeMethods from '../CommonMethods/AssetTypeMethods.js';
import * as CommonMethods from '../CommonMethods/CommonMethods.js';
var resp = null;




// export let options = {
//     thresholds: {
//         "http_req_duration": ["p(95)<1000"],
//         "http_req_failed": ["rate<0.01"],
//     }
// };

export let options = {
    // To display the summary with the below mentioned metrics.
    summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
    noConnectionReuse: true,
};

//Main function.
export default function () {
    // To get the type of API from the environment variables.
    const value = __ENV.API
    const UpperCase_Value = value.toUpperCase()
    // To get the Environment value from the environment variables.
    const environment = __ENV.env
    // To get the API value from the ReturnAPI method.
    const API_Called = AssetTypeMethods.ReturnAPI(UpperCase_Value)
    // Get call for the API.
    resp = AssetTypeMethods.ResponseBody(UpperCase_Value, environment, API_Called);

    // To check if the status code returned after executing the API does not fall in 5**.
    let pattern = /^[2][0-9][0-9]$/;
    let status1 = resp[0].status;
    let status_TF = pattern.test(status1)
    check(resp[0], { 'Response code status is not 3**,4**,5**': (r) => status_TF })

    if (resp[1] != null) {
        // To check if the status code returned after executing the API does not fall in 5**.
        let pattern = /^[2][0-9][0-9]$/;
        let status1 = resp[1].status;
        let status_TF = pattern.test(status1)
        check(resp[1], { 'Response code status is not 3**,4**,5**': (r) => status_TF })
    }

    if (resp[2] != null) {
        // To check if the status code returned after executing the API does not fall in 5**.
        let pattern = /^[2][0-9][0-9]$/;
        let status1 = resp[2].status;
        let status_TF = pattern.test(status1)
        check(resp[2], { 'Response code status is not 3**,4**,5**': (r) => status_TF })
    }
    // sleep(1);
}

// To return the output in the expected format.
export function handleSummary(data) {
    //To send the response obtained.
    // console.log(data.metrics.http_req_sending)
    CommonMethods.MSTeamsNotification(data)
}

// export function teardown(data) {
//     // send notification request to Microsoft Teams API
//     const event = {
//         text: "HI NILEENA",
//     }
//     const resp = http.post('https://dover.webhook.office.com/webhookb2/c8c61c1a-0f92-4e87-8b74-38f94117710a@3d2d2b6f-061a-48b6-b4b3-9312d687e3a1/IncomingWebhook/1f9b22e75fbf4b89b43ee14bf010535d/cb2b921a-b9db-4691-ab54-fded9208e4cd', JSON.stringify(event), {
//         headers: { 'Content-Type': 'application/json' },
//     });
// }







