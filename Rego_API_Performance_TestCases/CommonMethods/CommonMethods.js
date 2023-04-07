import { textSummary } from 'https://github.com/grafana/k6-jslib-summary/releases/download/v0.0.3/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import http from 'k6/http';

let row1 = []

// import * as TeamData from 'File://TestData//CommonData.json';

var TeamData = JSON.parse(open('../TestData/CommonData.json'));

//Method to display the teams message in the table format.
export function MSTeamsNotification(data) {
    // Displaying the required metrics in a Json format.
    // console.log("DATA FROM:", data.metrics)

    const Trend1 = {
        "http_req_blocked": data.metrics.http_req_blocked,
        "http_req_connecting": data.metrics.http_req_connecting,
        "http_req_duration": data.metrics.http_req_duration,
        "http_req_receiving": data.metrics.http_req_receiving,
        "http_req_sending": data.metrics.http_req_sending,
        "http_req_tls_handshaking": data.metrics.http_req_tls_handshaking,
        "http_req_waiting": data.metrics.http_req_waiting,
        "iteration_duration": data.metrics.iteration_duration
    }
    const Counter1 = {
        "data_received": data.metrics.data_received,
        "data_sent": data.metrics.data_sent,
        "iterations": data.metrics.iterations,
        "http_reqs": data.metrics.http_reqs
    }

    const Rate1 = {
        "checks": data.metrics.checks,
        "http_req_failed": data.metrics.http_req_failed,
    }
    const Gauge1 = {
        "vus": data.metrics.vus,
        "vus_max": data.metrics.vus_max
    }

    //To create a row with all the respective Metrics.
    const rowForTrend = ReplaceStringinJson("Trend", Trend1)
    const rowForCounter = ReplaceStringinJson("Counter", Counter1)
    const rowForRate = ReplaceStringinJson("Rate", Rate1)
    const rowForGauge = ReplaceStringinJson("Gauge", Gauge1)

    //To create a table format with all the respective Metrics in a row.
    const TeamsTableforTrend = TeamData.Teams_Message.sections[1].text.concat(rowForTrend, TeamData.Teams_Message.sections[1].text1);
    const TeamsTableforCounter = TeamData.Teams_Message.sections[2].text.concat(rowForCounter, TeamData.Teams_Message.sections[2].text1);
    const TeamsTableForGauge = TeamData.Teams_Message.sections[3].text.concat(rowForGauge, TeamData.Teams_Message.sections[3].text1);
    const TeamsTableForRate = TeamData.Teams_Message.sections[4].text.concat(rowForRate, TeamData.Teams_Message.sections[4].text1);

    const final_table = (" " + TeamsTableforCounter + " " + TeamsTableForRate + " " + TeamsTableForGauge + " " + TeamsTableforTrend)

    const event = {
        text: "\\n" + TeamsTableforCounter + "\\n" + TeamsTableForRate + "\\n" + TeamsTableForGauge + "\\n" + TeamsTableforTrend
    }
    // Passing the metrics to the Microsoft teams webhooks to send the metrics to the required teams channel.
    const resp = http.post('https://dover.webhook.office.com/webhookb2/c8c61c1a-0f92-4e87-8b74-38f94117710a@3d2d2b6f-061a-48b6-b4b3-9312d687e3a1/IncomingWebhook/1f9b22e75fbf4b89b43ee14bf010535d/cb2b921a-b9db-4691-ab54-fded9208e4cd', JSON.stringify(event, null, 4), {
        headers: { 'Content-Type': 'application/json' },
    });
    // Verify if the metrics are successfully passed.
    if (resp.status != 200) {
        console.error('Could not send summary, got status' + resp.status);
    }
    // Returns the metrics in a html file along with the standard output data seen in the console.
    return {
        "summary.html": htmlReport(data),
        'stdout': textSummary(data),
    };
}

//To receive only the required metrics in the tabular column.
export function ReplaceStringinJson(Metric_Type, Metric_data) {
    // const len = Object.keys(Metric_data).length
    // console.log("Trend", Metric_data)
    if (Metric_Type.toUpperCase() == 'TREND') {
        row1 = []
        for (var i in Metric_data) {
            var tr1 = ('<tr>');
            var name = '<td>' + i + '</td>';
            var type = '<td>' + Metric_data[i].type + '</td>';
            var avg = '<td>' + Metric_data[i].values.avg + '</td>';
            var min = '<td>' + Metric_data[i].values.min + '</td>';
            var med = '<td>' + Metric_data[i].values.med + '</td>';
            var max = '<td>' + Metric_data[i].values.max + '</td>';
            var p90 = '<td>' + Metric_data[i].values['p(90)'] + '</td>';
            var p95 = '<td>' + Metric_data[i].values['p(95)'] + '</td>';
            var p99 = '<td>' + Metric_data[i].values['p(99)'] + '</td>';
            var tr2 = ('</tr>')
            var new_value = tr1.concat(name, type, avg, min, med, max, p90, p95, p99, tr2)
            row1.push(new_value)
        }
        return row1
    }
    else if (Metric_Type.toUpperCase() == 'COUNTER') {
        row1 = []
        for (var i in Metric_data) {
            var tr1 = ('<tr>');
            var name = '<td>' + i + '</td>';
            var type = '<td>' + Metric_data[i].type + '</td>';
            var count = '<td>' + Metric_data[i].values.count + '</td>';
            var rate = '<td>' + Metric_data[i].values.rate + '</td>';
            var tr2 = ('</tr>')
            var new_value = tr1.concat(name, type, count, rate, tr2)
            row1.push(new_value)
        }
        return row1
    }
    else if (Metric_Type.toUpperCase() == 'RATE') {
        row1 = []
        for (var i in Metric_data) {
            var tr1 = ('<tr>');
            var name = '<td>' + i + '</td>';
            var type = '<td>' + Metric_data[i].type + '</td>';
            var rate = '<td>' + Metric_data[i].values.rate + '</td>';
            var pass = '<td>' + Metric_data[i].values.passes + '</td>';
            var fail = '<td>' + Metric_data[i].values.fails + '</td>';
            var tr2 = ('</tr>')
            var new_value = tr1.concat(name, type, rate, pass, fail, tr2)
            row1.push(new_value)
        }
        return row1
    }
    else if (Metric_Type.toUpperCase() == 'GAUGE') {
        row1 = []
        for (var i in Metric_data) {
            var tr1 = ('<tr>');
            var name = '<td>' + i + '</td>';
            var type = '<td>' + Metric_data[i].type + '</td>';
            var value = '<td>' + Metric_data[i].values.value + '</td>';
            var min = '<td>' + Metric_data[i].values.min + '</td>';
            var max = '<td>' + Metric_data[i].values.max + '</td>';
            var tr2 = ('</tr>')
            var new_value = tr1.concat(name, type, value, min, max, tr2)
            row1.push(new_value)
        }
        return row1
    }
}

