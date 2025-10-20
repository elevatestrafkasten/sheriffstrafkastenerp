function searchFine() {
    let searchFor = document.getElementById("searchbar_input").value.toLocaleLowerCase()
    let fines = document.querySelectorAll(".fine");
    for (var i = 0; i < fines.length; i++) {
        if (fines[i].querySelectorAll(".fineText")[0].innerHTML.toLocaleLowerCase().includes(searchFor)) {
            fines[i].classList.add("showing")
            fines[i].classList.remove("hiding")
        } else {
            fines[i].classList.remove("showing")
            fines[i].classList.add("hiding")
        }
    }
}

function selectFine(event) {
    let element = event.target
    if (element.tagName == "FONT") return
    if (element.tagName == "TD") element = element.parentElement
    if (element.tagName == "I") element = element.parentElement.parentElement
    if (element.classList.contains("selected")) {
        element.classList.remove("selected")
    } else {
        element.classList.add("selected")
    }
    startCalculating()
}

function startCalculating() {
    document.getElementById("finesListTable").innerHTML = `<tr>
                    <th style="width: 80%;">Grund für die Geldstrafe</th>
                    <th style="width: 20%;">Bußgeld</th>
                </tr>`

    let fineResult = document.getElementById("fineResult")
    let fineAmount = 0
    let wantedResult = document.getElementById("wantedsResult")
    let wantedAmount = 0
    let reasonResult = document.getElementById("reasonResult")
    let reasonText = ""
    let noticeText = ""
    let removeWeaponLicense = false
    let removeDriverLicense = false
    let tvübergabe_org = document.getElementById("übergabeInput_select").value
    let shortMode = false
    let fineCollection = document.querySelectorAll(".selected")

    for (var i = 0; i < fineCollection.length; i++) { 
        let cache_wanted_amount = parseInt(fineCollection[i].querySelector(".wantedAmount").getAttribute("data-wantedamount")) || 0
        cache_wanted_amount += fineCollection[i].querySelector(".wantedAmount").querySelectorAll(".selected_extrawanted").length

        const wantedAmountElement = fineCollection[i].querySelector(".wantedAmount");
        if (cache_wanted_amount > 40) {
            cache_wanted_amount = 40;
            wantedAmountElement.style.color = "red";
        } else {
            wantedAmountElement.style.color = "";
        }

        let cache_fine_amount = parseFloat(fineCollection[i].querySelector(".fineAmount").getAttribute("data-fineamount")) || 0
        let extrawanteds_found = fineCollection[i].querySelector(".wantedAmount").querySelectorAll(".selected_extrawanted")
        for (let b = 0; b < extrawanteds_found.length; b++) {
            if (extrawanteds_found[b].getAttribute("data-addedfine")) {
                cache_fine_amount += parseFloat(extrawanteds_found[b].getAttribute("data-addedfine"))
            }
        }

        wantedAmount += cache_wanted_amount
        fineAmount += cache_fine_amount
    }

    for (var i = 0; i < fineCollection.length; i++) {
        let extrawanteds_found = fineCollection[i].querySelector(".wantedAmount").querySelectorAll(".selected_extrawanted")
        let extrafines_amount = 0
        for (let b = 0; b < extrawanteds_found.length; b++) {
            extrafines_amount += parseFloat(extrawanteds_found[b].getAttribute("data-addedfine"))
        }

        let fineText = fineCollection[i].querySelector(".fineText").innerHTML.split("<i>")[0]

        if (reasonText == "") {
            reasonText = fineCollection[i].querySelector(".paragraph").innerHTML + " - " + fineText
        } else {
            reasonText += " + " + fineCollection[i].querySelector(".paragraph").innerHTML + " - " + fineText
        }

        if (fineCollection[i].getAttribute("data-removedriverlicence") == "true") removeDriverLicense = true
        if (fineCollection[i].getAttribute("data-removeweaponlicence") == "true") removeWeaponLicense = true

        if (fineCollection[i].classList.contains("addPlateInList")) {
            document.getElementById("finesListTable").innerHTML +=
            `<tr class="finesList_fine">
                <td onclick="JavaScript:copyText(event)">${fineCollection[i].querySelector(".paragraph").innerHTML} - ${fineText}${plate !== "" ? " - " + plate.toLocaleUpperCase() : ""}${blitzerort !== "" ? " - " + blitzerort : ""}</td>
                <td>$${(parseFloat(fineCollection[i].querySelector(".fineAmount").getAttribute("data-fineamount")) + extrafines_amount).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
            </tr>`
        } else {
            document.getElementById("finesListTable").innerHTML +=
            `<tr class="finesList_fine">
                <td onclick="JavaScript:copyText(event)">${fineCollection[i].querySelector(".paragraph").innerHTML} - ${fineText}</td>
                <td>$${(parseFloat(fineCollection[i].querySelector(".fineAmount").getAttribute("data-fineamount")) + extrafines_amount).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
            </tr>`
        }
    }

    if (removeDriverLicense) noticeText = "Führerschein entziehen"
    if (removeWeaponLicense) noticeText = noticeText == "" ? "Waffenschein entziehen" : noticeText + " + Waffenschein entziehen"
    if (tvübergabe_org !== "none" && tvübergabe_name !== "") reasonText += ` - @${tvübergabe_org.toLocaleUpperCase()} ${tvübergabe_name}`

    fineResult.innerHTML = `<b>Geldstrafe:</b> <font style="user-select: all;">${fineAmount.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%</font>`;
    wantedResult.innerHTML = `<b>Haftzeit:</b> <font style="user-select: all;">${wantedAmount}</font>`
    reasonResult.innerHTML = `<b>Grund:</b> <font style="user-select: all;" onclick="JavaScript:copyText(event)">${reasonText}</font>`
    if (reasonText.length <= 150) characterResult.innerHTML = `<b>Zeichen:</b> ${reasonText.length}/150`
    else characterResult.innerHTML = `<b>Zeichen:</b> <font style="color: red;">${reasonText.length}/150<br>Dieser Grund ist zu lang!</font>`
}


function showFines() {
    if (document.getElementById("finesListContainer").style.opacity == 0) {
        document.getElementById("finesListContainer").style.opacity = 1
        document.getElementById("finesListContainer").style.pointerEvents = ""
    } else {
        document.getElementById("finesListContainer").style.opacity = 0
        document.getElementById("finesListContainer").style.pointerEvents = "none"
    }
} 

function showAttorneys() {
    if (document.getElementById("attorneyContainer").style.opacity == 0) {
        document.getElementById("attorneyContainer").style.opacity = 1
        document.getElementById("attorneyContainer").style.pointerEvents = ""
    } else {
        document.getElementById("attorneyContainer").style.opacity = 0
        document.getElementById("attorneyContainer").style.pointerEvents = "none"
    }
} 

window.onload = async () => {
    let savedBody;
    let alreadyBig = true
    await sleep(Math.round(Math.random() * 2500))
    document.body.innerHTML = document.getElementById("scriptingDiv").innerHTML
    savedBody = document.body.innerHTML
    openDisclaimer()
    setInterval(() => {
        if (document.body.clientWidth < 700) {
            alreadyBig = false
            document.body.innerHTML = `<div style="transform: translate(-50%, -50%); font-weight: 600; font-size: 8vw; color: white; width: 80%; position: relative; left: 50%; top: 50%; text-align: center;">Diese Website kann nur auf einem PC angesehen werden<div>`
            document.body.style.backgroundColor = "#121212"
        } else if (alreadyBig == false) {
            alreadyBig = true
            location.reload()
        }
    }, 1)
}

function resetButton() {
    let fineCollection = document.querySelectorAll(".selected")
    for (var i = 0; i < fineCollection.length; i++) {
        fineCollection[i].classList.remove("selected")
    }
    document.getElementById("notepadArea_input").value = ""
    document.getElementById("reue_box").checked = false
    startCalculating()
}

function resetErinnerung() {
    let fineCollection = document.querySelectorAll(".selected")
    for (var i = 0; i < fineCollection.length; i++) {
        fineCollection[i].classList.remove("selected")
    }
    document.getElementById("notepadArea_input").value = ""
    document.getElementById("reue_box").checked = false
    startCalculating()
}

function copyText(event) {
    let target = event.target
    var copyText = target.innerHTML
    navigator.clipboard.writeText(copyText.replace("<br>", ""))
    insertNotification("success", "Der Text wurde kopiert.", 5)
}

function toggleExtraWanted(event) {
    let target = event.target
    let extrastarNumber = 0
    let isSelected = false
    let isLead = false
    if(target.classList.contains("extrawanted1")) extrastarNumber = 1
    if(target.classList.contains("extrawanted2")) extrastarNumber = 2
    if(target.classList.contains("extrawanted3")) extrastarNumber = 3
    if(target.classList.contains("extrawanted4")) extrastarNumber = 4
    if(target.classList.contains("extrawanted5")) extrastarNumber = 5
    if (target.classList.contains("selected_extrawanted")) isSelected = true
    if (isSelected && target.parentElement.querySelectorAll(".selected_extrawanted").length == extrastarNumber) isLead = true
    if (isSelected && isLead) {
        let foundEnabled = target.parentElement.querySelectorAll(".selected_extrawanted")
        for (let i = 0; i < foundEnabled.length; i++) {
            foundEnabled[i].classList.remove("selected_extrawanted")
        }
        startCalculating()
        return
    }
    if (isSelected) {
        let found = target.parentElement.querySelectorAll(".extrawanted")
        for (let i = 0; i < found.length; i++) {
            if (i + 1 > extrastarNumber) {
                found[i].classList.remove("selected_extrawanted")
            }
        }
        startCalculating()
        return
    }
    if (!isSelected) {
        let found = target.parentElement.querySelectorAll(".extrawanted")
        for (let i = 0; i < extrastarNumber; i++) {
            found[i].classList.add("selected_extrawanted")
        }
    }
    startCalculating()
}

setInterval(() => {
    if (document.getElementById("disclaimer_title_warning").style.color == "rgb(255, 73, 73)") {
        document.getElementById("disclaimer_title_warning").style.color = "rgb(255, 255, 255)"
    } else {
        document.getElementById("disclaimer_title_warning").style.color = "rgb(255, 73, 73)"
    }
}, 1000)

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function disclaimerAccepted() {
    document.getElementById("disclaimer_button").setAttribute("disabled", "")
    let disclaimerNode = document.getElementById("disclaimer")
    disclaimerNode.style.boxShadow = "rgba(0, 0, 0, 0.219) 0px 0px 70px 0vw"
    disclaimerNode.style.opacity = 0
    document.body.removeChild(document.getElementById("disclaimerBackgroundBlocker"))
    await sleep(1000)
    disclaimerNode.style.display = "none"
}

async function openDisclaimer() {
    await sleep(500)
    let disclaimerNode = document.getElementById("disclaimer")
    disclaimerNode.style.opacity = 1
    disclaimerNode.style.boxShadow = "rgba(0, 0, 0, 0.219) 0px 0px 70px 30vw"
}
