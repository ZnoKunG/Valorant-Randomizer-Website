var agent_list = []
var weapon_list = []
var skin_list = []
var weapon_list_filtered = []
var agent_list_filtered = []
var skin_list_filtered = []
var selectedWeaponType = ""
var selectedAgentRole = ""
var selectedSkinTier = ""

function getData() {
    Promise.all([
        fetch("https://valorant-api.com/v1/agents"),
        fetch("https://valorant-api.com/v1/weapons"),
        fetch("https://valorant-api.com/v1/weapons/skins")
    ]).then(([agentResp, weaponResp, skinResp]) => {
        agentResp.json().then((agentJSON) => {
            agent_list = agentJSON["data"].filter(agent => agent.isPlayableCharacter == true)
            console.log("Agent Response added succesfully")
        })
        weaponResp.json().then((weaponJSON) => {
            weapon_list = weaponJSON["data"].filter(weapon => weapon.displayName != "Melee")
            console.log("Weapon Response added succesfully")
        })
        skinResp.json().then((skinJSON) => {
            skin_list = skinJSON["data"]
            console.log("Skin Response added succesfully")
        })
        })
    .catch((error) => {
        console.warn(error)
    })

    console.log("Fetch data completed")
}

async function getDataAsync() {
    try {
        const [agentResp, weaponResp, skinResp] = await Promise.all([
            fetch("https://valorant-api.com/v1/agents"),
            fetch("https://valorant-api.com/v1/weapons"),
            fetch("https://valorant-api.com/v1/weapons/skins")
        ])
        let agentJSON = await ConvertRespToData(agentResp)
        agent_list = agentJSON["data"].filter(agent => agent.isPlayableCharacter == true)
        console.log("Agent Response added succesfully")

        let weaponJSON = await ConvertRespToData(weaponResp) 
        weapon_list = weaponJSON["data"].filter(weapon => weapon.displayName != "Melee")
        console.log("Weapon Response added succesfully")

        let skinJSON = await ConvertRespToData(skinResp)
        skin_list = skinJSON["data"]
        console.log("Skin Response added succesfully")
    } catch (err) {
        console.log(err)
    }
}
getDataAsync()

function ConvertRespToData(response) {
    return new Promise((resolve, reject) => {
        console.log("Converting Response to JSON ...")
        resolve(response.json())
    })
}


const random_button_agent = document.getElementById("agent-button")
if (random_button_agent) {
    random_button_agent.addEventListener("click", () => {scrollingRandom(randomAgent)});
}


const random_button_weapon = document.getElementById("weapon-button")
if (random_button_weapon) {
    random_button_weapon.addEventListener("click", () => {scrollingRandom(randomWeapon)});
}

const random_button_skin = document.getElementById("skin-button")
if (random_button_skin) {
    random_button_skin.addEventListener("click", () => {scrollingRandom(randomSkin)});
}

document.addEventListener("click", e => {
    const isDropdownButton = e.target.matches("[data-dropdown-button]")
    if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return

    let currentDropdown
    if (isDropdownButton) {
        currentDropdown = e.target.closest("[data-dropdown]")
        currentDropdown.classList.toggle('active')
    }

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        if (dropdown === currentDropdown) return
        dropdown.classList.remove('active')
    })
})

const weaponTypeButtons = document.querySelectorAll('[type-selector-button]')

weaponTypeButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedWeaponType = button.innerText
        if (selectedWeaponType == "Pistol") {
            selectedWeaponType = "Sidearm"
        }
        document.querySelector('[data-weapon-type]').innerText = selectedWeaponType
        document.querySelector('[data-dropdown]').classList.toggle('active')
    })
})

const agentRoleButtons = document.querySelectorAll('[role-selector-button]')

agentRoleButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedAgentRole = button.innerText
        // if (selectedAgentType == "Pistol") {
        //     selectedAgentType = "Sidearm"
        // }
        document.querySelector('[data-agent-role]').innerText = selectedAgentRole
        document.querySelector('[data-dropdown]').classList.toggle('active')
    })
})

function randomAgent(){
    if (selectedAgentRole != "") {
        agent_list_filtered = agent_list.filter(agent => agent['role']['displayName'] == selectedAgentRole)
    }
    else {
        agent_list_filtered = agent_list
    }
    const randIndex = Math.floor(Math.random() * agent_list_filtered.length)
    const random_agent_data = agent_list_filtered[randIndex]
    document.getElementById("name-agent").innerText = random_agent_data["displayName"]
    document.getElementById("image-agent").src = random_agent_data["fullPortrait"]
    console.log("agent randomed")
}

function randomWeapon(){
    if (selectedWeaponType != "") {
        weapon_list_filtered = weapon_list.filter(weapon => weapon['category'] == "EEquippableCategory::" + selectedWeaponType)
    }
    else {
        weapon_list_filtered = weapon_list
    }
    const randIndex = Math.floor(Math.random() * weapon_list_filtered.length)
    const random_weapon_data = weapon_list_filtered[randIndex]
    document.getElementById("name-weapon").innerText = random_weapon_data["displayName"]
    document.getElementById("image-weapon").src = random_weapon_data["displayIcon"]
}

function randomSkin(){
    if (selectedSkinTier != "") {
        skin_list_filtered = skin_list.filter(skin => skin['category'] == "EEquippableCategory::" + selectedSkinTier)
    }
    else {
        skin_list_filtered = skin_list
    }
    const randIndex = Math.floor(Math.random() * skin_list_filtered.length)
    const random_skin_data = skin_list_filtered[randIndex]
    document.getElementById("name-skin").innerText = random_skin_data["displayName"]
    document.getElementById("image-skin").src = random_skin_data["displayIcon"]
}

function scrollingRandom(element) {
    const interval = setInterval(element, 100)
    setTimeout(() => {clearInterval(interval)}, 3000)
}


