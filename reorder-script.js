"use strict";

let id;
let printMsg;

function printResult() {
    const result = (document.getElementById("result").textContent = printMsg);
}

function reorder(sentence) {
    let words = sentence.split(" ");
    // for storing numbers present in words.

    let numbers = [];

    let len = -1;
    while (++len < words.length) {
        for (let i = 0; i < words[len].length; i++) {
            let num = Number(words[len].charAt(i));
            if (num >= 1 && num <= 9) {
                numbers.push(num);
                words[len] = words[len].replace(num, "");
            }
        }
    }

    // Rearranging words to make proper sentences
    let num = 1;
    let result = "";
    for (let i = 0; i < 9; i++) {
        if (numbers[i] == num) {
            result += words[i];
            num++;
            if (num > numbers.length) break;
            result += " ";
            i = -1;
        }
    }
    return result;
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    let putRequest =
        "{\n" +
        '"token" : "' +
        connToken +
        '",' +
        '\n"cmd" : "PUT",\n' +
        '"dbName": "' +
        dbName +
        '",\n' +
        '"rel" : "' +
        relName +
        '",' +
        '\n"jsonStr": \n' +
        jsonObj +
        "\n" +
        "}";
    return putRequest;
}

function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    const url = dbBaseUrl + apiEndPointUrl;
    let jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function addDataInDB(id, username, email, mobileno, unorderedSentence, orderedSentence) {
    const token = "90936035|-31949284084870622|90940478";
    const dbName = "Sentence-Reorder";
    const relName = "Sentence-Reorder-Rel";
    const jsonObj = `{
    "id": "${Number(id) + 1}",
    "name": "${username}",
    "email": "${email}",
    "mobileno": "${mobileno}",
    "unordered-sentence": "${unorderedSentence}",
    "ordered-sentence": "${orderedSentence}"
    }`;
    const putReq = createPUTRequest(token, jsonObj, dbName, relName);
    jQuery.ajaxSetup({ async: false });
    let result = executeCommandAtGivenBaseUrl(
        putReq,
        "http://api.login2explore.com:5577",
        "/api/iml"
    );
    jQuery.ajaxSetup({ async: true });
    alert(JSON.stringify(result.message));
}

function updatecounter() {
    let data = `{
        "token": "90936035|-31949284084870622|90940478",
        "dbName": "Sentence-Reorder",
        "cmd": "LAST_RECORD",
        "rel": "Sentence-Reorder-Rel",
        "createTime": true,
        "updateTime": true
    }`;
    jQuery.ajaxSetup({ async: false });
    let result = executeCommandAtGivenBaseUrl(
        data,
        "http://api.login2explore.com:5577",
        "/api/irl"
    );
    jQuery.ajaxSetup({ async: true });
    const count = JSON.parse(result.data).rec_no;
    id = document.getElementById("counter").textContent = count;

    printMsg = JSON.parse(result.data).record["ordered-sentence"];
}

function organizeData() {
    const form = document.getElementById("form");
    const username = form.elements[0].value;
    const email = form.elements[1].value;
    const mobileno = form.elements[2].value;
    const unorderedSentence = form.elements[3].value;

    const orderedSentence = reorder(unorderedSentence);
    addDataInDB(
        id,
        username,
        email,
        mobileno,
        unorderedSentence,
        orderedSentence
    );
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    organizeData();
    updatecounter();
    printResult();
});

updatecounter();

function recordsUpdate() {
    alert("Coming Soon...");
}
