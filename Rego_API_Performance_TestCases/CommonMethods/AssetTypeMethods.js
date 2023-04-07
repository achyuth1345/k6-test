
// To import all the required packages.
import http from 'k6/http';

//To declare the variables globally.
var res, res2, res1, payload = null;

// Method to return back the required API as passed in the environment variables.
export function ReturnAPI(value, id = null, payload = null) {

    // To get all info for a particular Asset Type Id:
    if (value == 'GET_ASSETTYPEID') {
        const AssetTypeId = ['a5082175-4b2d-4829-8462-3128624381d7', '15616b87-6067-4ef9-a619-8851ccaf8962', 'e04aed47-0c6c-4630-a1e9-f44be961edbd']
        const random = AssetTypeId[Math.floor(Math.random() * AssetTypeId.length)];
        const API = 'https://rego-dev-api.dovertech.co.in/assetmanagement/api/v1/assettype/assetTypeId/' + random;
        const payload = null;
        const headers = null;
        return [API, payload, headers]
    }

    // To get all info for all Asset types:
    else if (value == 'GET_ASSETTYPE') {
        const API = 'https://rego-dev-api.dovertech.co.in/assetmanagement/api/v1/assettype';
        const payload = null;
        const headers = null;
        return [API, payload, headers]
    }

    // To create a new Asset type:
    else if (value == 'POST_ASSETTYPE') {
        let UniqueId = Math.floor(Math.random() * 10000);
        payload = {
            "assetTypeName": "Asset Type #" + UniqueId,
            "assetTypeDesc": "Just For Trial.",
            "assetTypeUniqueId": "AT #" + UniqueId,
            "assetTypeVersion": "1.0.0",
            "assetTypeTenantIdentifier": "Rego",
            "assetTypeAppIdentifier": "1.0.0",
            "associatedAssetType": [],
            "properties": [{ "key": "Valve Pressure", "valueType": "string", "defaultValue": "100", "required": false }],
            "tags": { "Valve Pressure": "100" }
        }
        const API = 'https://rego-dev-api.dovertech.co.in/assetmanagement/api/v1/assettype';
        // const payload = RandomPayload[Math.floor(Math.random() * RandomPayload.length)];
        const headers =
        {
            'Content-Type': 'application/json'
        };
        return [API, payload, headers]
    }

    // To update an existing Asset type:
    else if (value == 'PUT_ASSETTYPE') {
        const API = 'https://rego-dev-api.dovertech.co.in/assetmanagement/api/v1/assettype/assetTypeId/' + id;
        let UniqueId = Math.floor(Math.random() * 100);
        payload.tags['Valve Pressure'] = '"' + UniqueId + '"';
        const headers = {
            'Content-Type': 'application/json'
        };
        return [API, payload, headers]
    }

    // To delete an existing Asset type:
    else if (value == 'DELETE_ASSETTYPE') {
        const API = 'https://rego-dev-api.dovertech.co.in/assetmanagement/api/v1/assettype/assetTypeId/' + id;

        const headers =
        {
            'Content-Type': 'application/json'
        };
        return [API, payload, headers]
    }
}

// Method to return back the responses of the respective API call.
export function ResponseBody(UpperCase_Value, env, API_Details) {
    // GET call, either by all or by id.
    if (UpperCase_Value == 'GET_ASSETTYPEID' || UpperCase_Value == 'GET_ASSETTYPE') {
        res = http.get(API_Details.API_Called, {
            // Customized tags.
            tags: {
                API_Type: UpperCase_Value,
                Environment: env
            }
        });
        console.log(UpperCase_Value + " RESPONSE: ", res)
        return [res, res1, res2]
    }
    // POST Call.
    else if (UpperCase_Value == 'POST_ASSETTYPE') {
        res = http.post(API_Details.API_Called.API, JSON.stringify(API_Details.API_Called.payload), { headers: API_Details.API_Called.headers }, {
            tags: {
                API_Type: UpperCase_Value,
                Environment: env
            }
        });
        console.log(UpperCase_Value + " RESPONSE: ", res)
        return [res, res1, res2]
    }
    // PUT Call.
    else if (UpperCase_Value == 'PUT_ASSETTYPE') {
        res = http.put(API_Details.API_Called.API, JSON.stringify(API_Details.API_Called.payload), { headers: API_Details.API_Called.headers }, {
            tags: {
                API_Type: UpperCase_Value,
                Environment: env
            }
        });
        console.log(UpperCase_Value + " RESPONSE: ", res)
        return [res, res1, res2]
    }
    // DELETE Call.
    else if (UpperCase_Value == 'DELETE_ASSETTYPE') {
        res = http.del(API_Details.API_Called.API, {
            tags: {
                API_Type: UpperCase_Value,
                Environment: env
            }
        });
        console.log(UpperCase_Value + " RESPONSE: ", res)
        return [res, res1, res2]
    }

    // POST + PUT + DELETE Call.
    else if (UpperCase_Value == 'POST_PUT_DEL_ASSETTYPE') {
        const API_Called = ReturnAPI('POST_ASSETTYPE')
        res = http.post(API_Called[0], JSON.stringify(API_Called[1]), { headers: API_Called[2] }, {
            tags: {
                API_Type: UpperCase_Value,
                Environment: env
            }
        });
        console.log(UpperCase_Value + " RESPONSE ID: ", res.body.substring(7, 43))
        console.log("POST RESPONSE: ", res.body)

        const API_Called1 = ReturnAPI('PUT_ASSETTYPE', res.body.substring(7, 43), API_Called[1]);
        console.log("API for updating: ", API_Called1[0])
        res1 = http.put(API_Called1[0], JSON.stringify(API_Called1[1]), { headers: API_Called1[2] }, {
            tags: {
                API_Type: UpperCase_Value,
                Environment: env
            }
        });
        console.log("UPDATE RESPONSE: ", res1.body)

        const API_Called2 = ReturnAPI('DELETE_ASSETTYPE', res.body.substring(7, 43));
        console.log("API for deleting: ", API_Called2[0])
        res2 = http.del(API_Called2[0], {
            tags: {
                API_Type: UpperCase_Value,
                Environment: env
            }
        });
        console.log("DELETE RESPONSE: ", res2.body)
        // sleep(40)
        return [res, res1, res2]
    }
}